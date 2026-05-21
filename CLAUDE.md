# CLAUDE.md

이 파일은 이 저장소에서 작업하는 Claude Code(및 협업자)를 위한 가이드입니다.
상세 문서는 [`docs/`](docs/)에 있으며, 본 문서는 그 **요약 + 작업 규칙**입니다.

| 무엇이 필요한가 | 어디로 |
|---|---|
| 제품이 무엇·누구를 위한지 | [`docs/product/overview.md`](docs/product/overview.md) |
| 지금 무엇을 만드는 중인지(로드맵) | [`docs/product/positioning-roadmap.md`](docs/product/positioning-roadmap.md) |
| 라우트·정보구조 | [`docs/product/information-architecture.md`](docs/product/information-architecture.md) |
| 기술 스택·아키텍처·컨벤션 | [`docs/engineering/`](docs/engineering/) |
| **기능을 더할지 고민될 때(판단 기준)** | [`docs/spirit/`](docs/spirit/) |

---

## 프로젝트 개요

**Drippin** — 드립커피의 **'레시피'와 '시음 일지'에 집중한 모바일 우선 커뮤니티**.
레시피를 쉽게 **만들고 · 공유하고 · (타이머처럼) 재생**하고, 마신 커피를 인스타그램처럼 **가볍게 기록**한다.

- Next.js(App Router) + Supabase 웹앱 · 모바일 우선(**max 768px**) · 카카오/구글 소셜 로그인
- 배포: Vercel (`drippin.vercel.app`)
- 포지셔닝: **코어는 "내 기록·재생 도구", 그 위에 가벼운 커뮤니티**(토스증권 모델).

> 변하지 않는 판단 기준 — 새 기능을 더할지 고민되면 [`docs/spirit/`](docs/spirit/)로 돌아온다:
> ① 레시피·일지 **두 축**을 더 쉽고 깊게 하나 ② 혼자 써도 가치 있나(코어 우선) ③ 무거운 소셜은 서두르지 않는다 ④ 레시피는 "재생"되어야 ⑤ 기록은 가볍게.

---

## 기술 스택 (요약)

- **프레임워크**: Next.js 14 (App Router, RSC) / React 18 / TypeScript
- **데이터·인증**: Supabase (`@supabase/ssr`) + `@supabase-cache-helpers/postgrest-react-query`
- **서버 상태**: TanStack React Query — 피드/목록 `useInfiniteQuery` 무한스크롤
- **UI**: Tailwind CSS + daisyUI(플러그인) + shadcn/ui(Radix, `components/ui/`) + `lucide-react` + `next-themes`
- **폼/입력**: `react-hook-form`, `react-select`, `browser-image-compression`
- **레시피 재생**: `react-countdown-circle-timer`(원형 타이머), `swiper`(단계 전환)
- **알림/통계**: `sonner`(토스트, alert/confirm 대체), `recharts`(기록 요약)
- **분석**: Amplitude, Vercel Analytics

> ⚠️ Realtime 구독은 **사용하지 않음**(동기화는 React Query). `@tiptap/*`는 의존성에 있으나 현재 미사용. 전체: [`docs/engineering/tech-stack.md`](docs/engineering/tech-stack.md).

---

## 개발 명령어

```bash
yarn dev               # 개발 서버 (localhost:3000)
yarn build / yarn start
yarn typecheck         # tsc --noEmit  (PR 전 필수)
yarn lint              # next lint     (PR 전 필수, 0 warnings)
yarn supabase-gen-type # Supabase DB 타입 생성 → types/database.types.ts
```

- 패키지 매니저: **Yarn 4 (berry/PnP)** — `.yarn/` 가상 캐시.

---

## 코드 구조

```
app/          # App Router 라우트 (서버 페이지 = 데이터 prefetch, 클라 컴포넌트 = UI)
components/    # home/ share/ nav/ recipe/ my/ profile/ tag/ auth/ ui/ icon/ providers/
queries/       # 데이터 패칭 함수 + queryKeys(중앙 관리) + (utils/invalidate)
hooks/         # useSession, useDebounce, useIntersectionObserver
utils/  constants/  types/  styles/  supabase/  public/
docs/          # product / engineering / spirit 문서
ux-audit/      # UX 진단 산출물(스크린샷·리포트)
```

### 라우트 맵 (요약 — 전체는 [IA 문서](docs/product/information-architecture.md))
| 라우트 | 설명 | 로그인 |
|--------|------|--------|
| `/` | 홈 피드(레시피/일지 탭, `?tab=`) | 공개 |
| `/recipe`, `/recipe/[id]` | 레시피 목록 / 상세 | 공개 |
| `/recipe/[id]/onboarding` → `/timer` | 추출 파라미터 → 단계별 타이머 재생 | 공개 |
| `/recipe/[id]/edit`, `/recipe/add` | 편집 / 생성(4단계) | 소유자 / 로그인 |
| `/log`, `/log/[id]` | 일지 목록 / 상세 | 공개 |
| `/log/[id]/edit`, `/log/add` | 수정 / 작성 | 소유자 / 로그인 |
| `/profile/[handle]` | 프로필 홈(레시피·일지 모음, handle 고유) | 공개 |
| `/tag/[tag]` | 태그가 담긴 일지 모음 | 공개 |
| `/my` | 내정보 + 기록 요약(비로그인 시 LoginNudge) | 로그인 |

주요 컴포넌트: `components/home/HomeWrapper.tsx`(피드), `components/share/{RecipeCard,LogCard,CreatableSelector,CoffeeLoading}.tsx`, `components/nav/BottomTabNav.tsx`, `components/my/{MyContent,MyStats}.tsx`.

---

## 구현 패턴 (꼭 지킬 것 — 상세는 [architecture.md](docs/engineering/architecture.md))

- **서버/클라 경계**: 서버 페이지가 데이터를 prefetch → `HydrationBoundary`로 클라 컴포넌트에 전달. 서버 Supabase는 `getSupabaseServer()`, 클라는 `useSupabaseBrowser()`.
- **워터폴 제거**: 로그인 사용자는 세션뿐 아니라 **첫 페이지 목록까지 서버 prefetch**(`/recipe`·`/log`·`/my`). prefetch 키는 클라 쿼리 키와 **글자까지 동일**해야 hydration이 붙는다.
- **React Query**: 모든 서버 상태는 RQ로. 쿼리 키는 `queries/queryKeys.ts`에서만 생성. 세션은 `hooks/useSession.ts`로 통일.
- **캐시 무효화**: 전체를 갈아엎지 말고 `utils/invalidate.ts`의 `invalidateRecipeQueries`/`invalidateLogQueries`로 **변경 도메인만**(일지 변경은 stats도 무효화).
- **네비 체감 속도**: `<Link prefetch>` + 즉시 활성 피드백 + `loading.tsx`(`CoffeeLoading`). 이 패턴 유지.
- **알림**: `alert/confirm` 금지 → `sonner` 토스트.
- **디자인 토큰**: 색상은 토큰(`text-brand`, `bg-brand-soft`, `--ice/--hot` 등)으로만. 하드코드 hex 지양.

---

## 디자인 / UX 원칙 (요약 — 상세는 [design-spirit.md](docs/spirit/design-spirit.md))

- **모바일 우선, max 768px** 컨테이너. 768px 이상은 콘텐츠 중앙 정렬 + 양옆 여백.
- 하단 글로벌 탭 고정 → 콘텐츠는 **하단 88px 패딩**(`pb-[88px]`)으로 가림 방지.
- 인스타 풍 가벼운 기록 + 정보 밀도 균형. 화면당 **1차 액션 하나**를 명확히. **즉각 반응**(활성/로딩/토스트).

---

## 작업 Flow (중요 — 상세는 [conventions.md](docs/engineering/conventions.md))

**큰 단위 작업은 브랜치에서 진행하고, 끝나면 커밋 → 푸시 → PR 생성을 기본으로 한다.**

1. **브랜치** — `main`에서 분기. `feat-` / `fix-` / `style-` / `perf-` / `docs-` …. 작은 수정(오타·문서 한 줄)은 브랜치 없이 가능.
2. **커밋** — 한글 Conventional Commits(`feat:` `fix:` `chore:` `refactor:` `docs:` `style:` `perf:`). 푸시는 **사용자가 요청할 때만**.
3. **푸시** — `git push -u origin <branch>`.
4. **PR** — `gh pr create` 로 `main` 대상. 본문 필수: `## 변경 사항`(무엇·왜) / `## 테스트`(확인 방법) / UI 변경 시 스크린샷. 생성 후 URL 보고.
5. **머지는 사용자 승인 후.**

### 커밋·PR 푸터 규칙
- 커밋 메시지 끝:
  ```
  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
  ```
- PR 본문 끝:
  ```
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  ```

> 비가역적·외부 노출 작업(푸시, PR 생성, 머지 등)은 사용자 승인 후 진행한다.

---

## 로드맵 (요약 — 변함, 상세·날짜는 [positioning-roadmap.md](docs/product/positioning-roadmap.md))

- **A. 코어(개인 도구)**: 레시피 조회/생성/편집/삭제·재생 ✅, 일지 작성/수정/삭제/사진 ✅, 닉네임 ✅, **내 기록 요약 ✅** · 레시피↔일지 연결 강화 🔴(다음 후보)
- **B. 커뮤니티 레이어**: 검색·좋아요 ✅ · **프로필 홈 ✅** · **태그 페이지 ✅** · 대상별(원두/카페/지역) 페이지 🔴(다음 후보) · 댓글/팔로우/추천 🔴(이후)
- **⏸ 보류**: 프로필 이미지(쓸 화면 없음), 레시피 프리셋(콘텐츠 미정), 본격 소셜(규모 확보 후)
