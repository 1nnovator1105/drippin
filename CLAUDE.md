# CLAUDE.md

이 파일은 이 저장소에서 작업하는 Claude Code(및 협업자)를 위한 가이드입니다.
서비스의 상세 기반 정보는 **[`docs/base.md`](docs/base.md)** 를 참고하세요. (본 문서는 그 요약 + 작업 규칙)

---

## 프로젝트 개요

**Drippin** — 드립커피의 **'레시피'와 '시음 일지'에 집중한 모바일 우선 커뮤니티**.
레시피를 쉽게 **만들고 · 공유하고 · (타이머처럼) 재생**하고, 마신 커피를 인스타그램처럼 **가볍게 기록**한다.

- Next.js(App Router) + Supabase 웹앱 · 모바일 우선(**max 768px**) · 카카오/구글 소셜 로그인
- 배포: Vercel (`drippin.vercel.app`)

---

## 기술 스택

- **프레임워크**: Next.js 14 (App Router, RSC) / React 18 / TypeScript
- **데이터·인증**: Supabase (`@supabase/ssr`, `@supabase/supabase-js`) + `@supabase-cache-helpers/postgrest-react-query`
- **서버 상태**: TanStack React Query — 피드는 `useInfiniteQuery` 무한스크롤
- **UI**: Tailwind CSS + daisyUI(`react-daisyui`) + Radix UI + `lucide-react` + `next-themes`
- **폼/입력**: `react-hook-form`, `react-select`, `browser-image-compression`
- **레시피 재생**: `react-countdown-circle-timer`(원형 타이머), `swiper`(단계 전환)
- **분석**: Amplitude, Vercel Analytics

---

## 개발 명령어

```bash
yarn dev               # 개발 서버 (localhost:3000)
yarn build             # 프로덕션 빌드
yarn start             # 프로덕션 서버
yarn supabase-gen-type # Supabase DB 타입 생성 → types/database.types.ts
```

- 패키지 매니저: **Yarn (berry/PnP)** — `.yarn/` 가상 캐시 사용.

---

## 코드 구조

```
app/          # App Router 라우트
components/    # home/ share/ nav/ recipe/ ui/ icon/ providers/
queries/       # 데이터 패칭(feed 등) + queryKeys
hooks/  utils/  constants/  types/  styles/  supabase/  public/
docs/          # 프로젝트 문서 (base.md 등)
ux-audit/      # UX 진단 산출물(스크린샷·리포트)
```

### 라우트 맵 (요약)
| 라우트 | 설명 | 로그인 |
|--------|------|--------|
| `/` | 홈 피드(레시피/일지 탭, `?tab=`) | 공개 |
| `/recipe`, `/recipe/[id]` | 레시피 목록 / 상세 | 공개 |
| `/recipe/[id]/onboarding` → `/timer` | 추출 파라미터 → 단계별 타이머 재생 | 공개 |
| `/recipe/[id]/edit`, `/recipe/add` | 편집 / 생성(4단계) | 소유자 / 로그인 |
| `/log`, `/log/[id]` | 일지 목록 / 상세 | 공개 |
| `/log/[id]/edit`, `/log/add` | 수정 / 작성 | 소유자 / 로그인 |
| `/my` | 내정보(비로그인 시 LoginNudge) | 로그인 |

주요 컴포넌트: `components/home/HomeWrapper.tsx`(피드), `components/share/{RecipeCard,LogCard,CreatableSelector}.tsx`, `components/nav/BottomTabNav.tsx`.

---

## 디자인 / UX 원칙

- **모바일 우선, max 768px** 컨테이너. 768px 이상은 콘텐츠 중앙 정렬 + 양옆 여백.
- 하단 글로벌 탭 고정 → 콘텐츠 영역은 **하단 88px 패딩**(`pb-[88px]`)으로 가림 방지.
- 인스타그램 풍의 가벼운 기록 + 정보 밀도 균형(글이 과하거나 빈약하지 않게).
- 화면당 **1차 액션 하나**를 명확히(예: 레시피 상세 `레시피 진행하기`, 목록 작성 FAB).

---

## 작업 Flow (중요)

**큰 단위의 작업은 브랜치에서 진행하고, 끝나면 커밋 → 푸시 → PR 생성을 기본으로 한다.**

1. **브랜치 생성** — `main`에서 분기. 네이밍은 기존 관례를 따른다:
   - `feat-<주제>` (예: `feat-edit-log`), 버그 수정은 `fix-<주제>`.
   - 작은 수정(오타·문서 한 줄 등)은 브랜치 없이 처리해도 무방하나, 기능/리팩터/다중 파일 변경은 반드시 브랜치.
2. **작업 & 커밋** — 한글 **Conventional Commits**:
   - `feat:` 기능 / `fix:` 버그 / `chore:` 잡무·설정 / `refactor:`, `docs:` 등.
   - 예: `feat: 프로필 이미지 업로드`, `fix: 일지 목록 스크롤 복원`.
   - 커밋 푸시는 **사용자가 요청할 때** 수행한다(임의 푸시 금지).
3. **푸시** — `git push -u origin <branch>`.
4. **PR 생성** — `gh pr create` 로 `main` 대상 PR 생성. **반드시 description 작성**:
   - 제목: 커밋 컨벤션과 동일한 톤(한글).
   - 본문 구성: `## 변경 사항`(무엇을·왜) / `## 테스트`(확인 방법) / 관련 이슈·스크린샷(UI 변경 시).
5. 생성 후 PR URL을 사용자에게 보고한다.

### 커밋·PR 푸터 규칙
- 커밋 메시지 끝에:
  ```
  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
  ```
- PR 본문 끝에:
  ```
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  ```

> 비가역적·외부 노출 작업(푸시, PR 생성, 머지 등)은 사용자 승인 후 진행한다.

---

## 포지셔닝 & 로드맵 (요약)

**코어는 "내 기록·재생 도구", 그 위에 커뮤니티 레이어**(토스증권 모델 — 코어에 더 비중).

- **A. 코어(개인 도구)**: 레시피 조회/생성/편집/삭제·재생 ✅, 일지 작성/수정/삭제/사진 ✅, 닉네임 ✅ · **내 기록 통계/요약 🔜(다음)** · 레시피↔일지 연결 강화 🔴
- **B. 커뮤니티 레이어**: 검색·좋아요 ✅ · 프로필 홈 🔴 · 대상별(원두/카페/태그) 페이지 🔴 · 댓글/팔로우/추천 🔴(이후)
- **⏸ 보류**: 프로필 이미지(쓸 화면 없음), 레시피 프리셋(콘텐츠 미정), 본격 소셜(규모 확보 후)

전체 포지셔닝·로드맵·정보구조 상세는 [`docs/base.md`](docs/base.md) 참조.
