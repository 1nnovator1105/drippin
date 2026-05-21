# 정보구조 / 라우트 맵 (Information Architecture)

> 화면 단위 구조와 진입 권한. 컴포넌트·데이터 흐름은 [`../engineering/architecture.md`](../engineering/architecture.md) 참조.

---

## 라우트 맵

| 라우트 | 설명 | 로그인 |
|--------|------|--------|
| `/` | 홈 피드. 상단 **레시피 / 일지 탭** 전환(`?tab=`), 무한스크롤 | 공개 |
| `/recipe` | 레시피 목록 + `새로운 레시피 작성하기` FAB | 공개 조회 |
| `/recipe/[recipeId]` | 레시피 상세(히어로 + `레시피 진행하기`) | 공개 |
| `/recipe/[recipeId]/onboarding` | 추출 파라미터 확인(드리퍼/필터/비율/온도/분쇄도/메모) | 공개 |
| `/recipe/[recipeId]/timer` | **단계별 추출 타이머**(붓는 양·시간 안내, 원형 타이머) | 공개 |
| `/recipe/[recipeId]/edit` | 레시피 편집 | 소유자 |
| `/recipe/add` | 레시피 생성 4단계 위저드 | **필요** |
| `/log` | 일지 목록 + `새로운 일지 작성하기` FAB | 공개 조회 |
| `/log/[logId]` | 일지 상세(사진 + 본문 + 해시태그 + 소유자 케밥 메뉴) | 공개 |
| `/log/[logId]/edit` | 일지 수정 | 소유자 |
| `/log/add` | 일지 작성(내용 + 사진) | **필요** |
| `/profile/[handle]` | 프로필 홈 — `@handle`의 레시피·일지 모음(handle 고유) | 공개 |
| `/tag/[tag]` | 태그 페이지 — 해당 태그가 담긴 일지 모음 | 공개 |
| `/my` | 내정보(이름/이메일/닉네임/기록 요약/로그아웃). 비로그인 시 LoginNudge | **필요** |
| `/auth/callback` | 소셜 로그인 콜백 | — |

---

## 글로벌 내비게이션

- **하단 글로벌 탭**: 홈 / 레시피 / 일지 / 내정보 — `components/nav/BottomTabNav.tsx`
- 콘텐츠 영역은 하단 탭에 가리지 않도록 **하단 88px 패딩**(`pb-[88px]`).
- 탭 전환은 `<Link prefetch>` + 즉시 활성 피드백 + 라우트 `loading.tsx`(커피 애니메이션)로 체감 속도 확보. 상세는 [`../engineering/architecture.md`](../engineering/architecture.md#네비게이션-체감-속도).

---

## 진입 권한 패턴

- **공개 조회 + 로그인 게이트**: 목록/상세는 누구나 보되, 작성·편집은 로그인/소유자만. 비로그인 진입 시 `LoginNudge`로 안내.
- `/profile/[handle]`·`/tag/[tag]`는 상단 인라인 앱바(뒤로가기 + 아이콘 + `@handle`/`#tag`)로 컨텍스트를 압축해 보여준다.
