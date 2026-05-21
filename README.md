# ☕ Drippin — 드립커피 커뮤니티

> 드립커피의 **'레시피'와 '시음 일지'에 집중한 모바일 우선 커뮤니티.**
> 레시피를 쉽게 **만들고 · 공유하고 · (타이머처럼) 재생**하고, 마신 커피를 인스타그램처럼 **가볍게 기록**한다.

🔗 **배포**: [drippin.vercel.app](https://drippin.vercel.app)

---

## 📖 소개

Drippin은 드립커피 애호가가 자신의 레시피를 공유하고, 브루잉 경험을 기록하는 플랫폼입니다.
**코어는 "내 기록·재생 도구"**, 그 위에 검색·태그·프로필 같은 가벼운 커뮤니티를 얹는 구조입니다(토스증권 모델). 자세한 철학과 로드맵은 [`docs/`](./docs/)를 참고하세요.

## ✨ 주요 기능

- **레시피**: 4단계 위저드로 작성 · 공유 · 편집 · 삭제, 그리고 **단계별 타이머로 추출 재생**(별도 타이머 앱 불필요)
- **일지**: 사진과 함께 가볍게 기록 · 수정 · 삭제, 해시태그
- **피드**: 홈에서 레시피/일지 탭 무한스크롤, 검색·필터·좋아요
- **프로필 홈** (`/profile/[handle]`): 한 사용자의 레시피·일지 모음
- **태그 페이지** (`/tag/[tag]`): 특정 태그가 담긴 일지 모음
- **내 기록 요약** (`/my`): 이번 달 잔 수·누적·자주 마신 곳·6개월 추이
- **소셜 로그인**: Google · Kakao

## 🛠 기술 스택

- **프레임워크**: Next.js 14 (App Router, RSC) / React 18 / TypeScript
- **데이터·인증**: Supabase (`@supabase/ssr`) + `@supabase-cache-helpers`
- **서버 상태**: TanStack React Query (피드/목록 `useInfiniteQuery` 무한스크롤)
- **UI**: Tailwind CSS + daisyUI + shadcn/ui(Radix) + `lucide-react` + `next-themes`
- **폼/입력**: `react-hook-form`, `react-select`, `browser-image-compression`
- **레시피 재생**: `react-countdown-circle-timer`, `swiper`
- **기타**: `sonner`(토스트), `recharts`(통계), Amplitude · Vercel Analytics

> 전체 스택과 "왜 이 선택인지"는 [`docs/engineering/tech-stack.md`](./docs/engineering/tech-stack.md).

## 🚀 시작하기

```bash
yarn install
yarn dev          # localhost:3000
```

필요 환경 변수(Supabase 프로젝트 URL/anon key 등)는 `.env.local`에 설정합니다.

| 스크립트 | 설명 |
|---|---|
| `yarn dev` | 개발 서버 |
| `yarn build` / `yarn start` | 프로덕션 빌드 / 서버 |
| `yarn typecheck` | `tsc --noEmit` |
| `yarn lint` | `next lint` |
| `yarn supabase-gen-type` | Supabase DB 타입 생성 → `types/database.types.ts` |

> 패키지 매니저는 **Yarn 4 (berry/PnP)**.

## 📁 프로젝트 구조

```
app/          # App Router 라우트 (서버 페이지 = 데이터 prefetch)
components/    # home/ share/ nav/ recipe/ my/ profile/ tag/ auth/ ui/ icon/ providers/
queries/       # 데이터 패칭 함수 + queryKeys + invalidate
hooks/  utils/  constants/  types/  styles/  supabase/  public/
docs/          # 기획(product) · 기술(engineering) · 정신(spirit) 문서
ux-audit/      # UX 진단 산출물(스크린샷·리포트)
```

라우트 맵과 구현 패턴(서버/클라 경계, prefetch, 캐시 무효화)은 [`docs/engineering/architecture.md`](./docs/engineering/architecture.md)를 참고하세요.

## 📚 문서

| 문서 | 내용 |
|---|---|
| [`docs/`](./docs/) | 문서 인덱스 |
| [`docs/product/`](./docs/product/) | 개요 · 포지셔닝/로드맵 · 정보구조 |
| [`docs/engineering/`](./docs/engineering/) | 기술 스택 · 아키텍처 · 컨벤션 |
| [`docs/spirit/`](./docs/spirit/) | 변하지 않을 제품·디자인 정신 |
| [`CLAUDE.md`](./CLAUDE.md) | 위 문서들의 요약 + 협업/작업 규칙 |

## 🤝 기여

브랜치(`feat-`/`fix-`/`docs-` …) → 한글 Conventional Commits → PR(`main` 대상, 변경/테스트 설명 포함). 자세한 규칙은 [`docs/engineering/conventions.md`](./docs/engineering/conventions.md).

---

_이 README는 생성형 AI의 도움을 받아 작성·갱신되었습니다._
