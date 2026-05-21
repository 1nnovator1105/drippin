# 아키텍처 & 구현 패턴 (Architecture)

> 이 코드베이스에서 **반복되는 패턴**을 정리한다. 새 화면/기능은 여기 패턴을 따른다.

---

## 코드 구조 (top-level)

```
app/          # App Router 라우트 (서버 페이지 = 데이터 prefetch, 클라 컴포넌트 = UI/상호작용)
components/    # home/ share/ nav/ recipe/ my/ profile/ tag/ auth/ ui/ icon/ providers/
queries/       # 데이터 패칭 함수 + queryKeys(중앙 관리) + invalidate
hooks/         # useSession, useDebounce, useIntersectionObserver
utils/         # supabase 클라이언트, getQueryClient, invalidate, analytics, cn
constants/  types/  styles/  supabase/  public/
docs/          # 본 문서 (product / engineering / spirit)
ux-audit/      # UX 진단 산출물(스크린샷·리포트) — docs와 별개
```

---

## 서버/클라이언트 경계 (RSC + prefetch)

화면의 표준 형태는 **서버 페이지가 데이터를 prefetch → `HydrationBoundary`로 클라이언트 컴포넌트에 전달**이다.

```tsx
// app/<route>/page.tsx  (서버)
const queryClient = getQueryClient();
const supabase = getSupabaseServer();        // ⚠️ getSupabaseServer (use- 아님)

const sessionData = await fetchSession(supabase);
queryClient.setQueryData(queryKeys.session(), sessionData);

const userId = sessionData?.session?.user.id;
if (userId) {
  await queryClient.prefetchInfiniteQuery({
    queryKey: [...queryKeys.myRecipe(), "", "all"],   // 클라 키와 정확히 일치해야 함
    queryFn: ({ pageParam }) => fetchMyRecipe(supabase, userId, pageParam as number, "", "all"),
    initialPageParam: 0,
  });
}

return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <Recipe />                                  {/* "use client" */}
  </HydrationBoundary>
);
```

- **워터폴 제거 원칙**: 서버에서 세션만 prefetch하고 목록은 클라에서 다시 받으면 `세션→목록` 워터폴이 생긴다. 로그인 사용자의 **첫 페이지 목록까지 서버 prefetch**해 첫 페인트에 콘텐츠가 나오게 한다(`/recipe`·`/log`·`/my` 모두 이 패턴).
- **클라 키 = 서버 키**: prefetch 키는 클라이언트 쿼리 키와 **글자까지 동일**해야 hydration이 붙는다. 예: `myRecipe()`의 클라 키가 `[...myRecipe(), debouncedKeyword, temperature]`면 서버는 `[...myRecipe(), "", "all"]`.
- 클라이언트 Supabase는 `useSupabaseBrowser()`, 서버는 `getSupabaseServer()`.

---

## React Query 규약

- **모든 서버 상태는 React Query로** 관리한다. Realtime 구독은 쓰지 않는다.
- **쿼리 키는 `queries/queryKeys.ts`에서 중앙 관리** — 문자열 배열을 곳곳에 흩뿌리지 않는다.
  - `feed/recipeFeed/logFeed`, `recipe/log`, `session`, `myRecipe/myLog`(=세션 하위), `recipeDetail/logDetail`.
- **무한스크롤**: 피드·목록은 `useInfiniteQuery` + `getRange(page, 5)` 페이지네이션. 교차 관찰은 `hooks/useIntersectionObserver` / `components/share/FetchMore`.
- **세션**: `hooks/useSession.ts`로 통일(`queryKeys.session()`). 게이트가 필요한 화면은 `mySessionQuery`로 로그인 여부 판단 후 `LoginNudge`.

### 캐시 무효화

전체(`invalidateQueries(["drippin"])`)를 갈아엎지 않고 **변경 도메인만** 무효화한다. `utils/invalidate.ts`:

- `invalidateRecipeQueries` → 레시피 피드/상세/내 레시피.
- `invalidateLogQueries` → 일지 피드/상세/내 일지 **+ `["drippin","stats"]`**(일지가 통계에 반영되므로).

레시피·일지의 생성/수정/삭제/좋아요 mutation은 이 헬퍼를 호출한다.

---

## 네비게이션 체감 속도

하단 탭 전환이 느리고 피드백이 없던 문제를 4개 작업으로 해결했다(불변 패턴으로 유지):

1. **`<Link prefetch>`** — `router.push` 대신 Link로 라우트를 미리 가져온다(`BottomTabNav`).
2. **즉시 활성 피드백** — 누른 즉시 해당 탭을 활성 표시(`pendingPath` 상태, 경로 변경 시 해제).
3. **`loading.tsx`** — 라우트 전환 중 `components/share/CoffeeLoading`(SMIL 커피 스팀 애니메이션) 표시. 클라 로딩(`Spinner`)도 동일 컴포넌트로 통일.
4. **서버 prefetch 병렬화 + 목록 prefetch** — 홈은 두 피드를 `Promise.all`로 병렬 prefetch, 목록 화면은 위 "워터폴 제거" 패턴.

---

## 디자인 토큰

`app/globals.css`의 HSL CSS 변수 + `tailwind.config.ts` 색상 매핑. 라이트/다크 양쪽 정의.

| 토큰 | 용도 |
|---|---|
| `--brand` / `text-brand` | 브랜드 메인(따뜻한 커피 브라운). 1차 액션·활성 탭·강조 |
| `--brand-foreground` | 브랜드 배경 위 텍스트 |
| `--brand-soft` / `bg-brand-soft` | 브랜드 옅은 배경(헤더 블록·카드 강조) |
| `--ice` / `--hot` | 아이스/핫 배지 |
| `border`, `muted-foreground` 등 | shadcn 표준 시맨틱 토큰 |

- 색상은 토큰으로만 쓴다(하드코드 hex 지양). 단, `hsl(var(--token))` 에 `/30` 같은 **opacity modifier는 신뢰하기 어려우니** `border-border` 등 별도 토큰을 쓴다.
