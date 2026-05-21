# 기술 스택 (Tech Stack)

> 실제 사용 중인 라이브러리 기준(2026-05-21). 코드 구조·패턴은 [`architecture.md`](./architecture.md).

---

## 핵심

| 영역 | 사용 |
|---|---|
| 프레임워크 | **Next.js 14** (App Router, RSC) / React 18 / TypeScript |
| 데이터·인증 | **Supabase** (`@supabase/ssr`, `@supabase/supabase-js`) + `@supabase-cache-helpers/postgrest-react-query` |
| 서버 상태 | **TanStack React Query** (+ devtools) — 피드·목록은 `useInfiniteQuery` 무한스크롤 |
| UI | **Tailwind CSS** + **daisyUI**(플러그인) + **shadcn/ui**(`components/ui/`, Radix 기반) + `lucide-react` + `next-themes` |
| 폼/입력 | `react-hook-form`, `react-select`, `browser-image-compression`(사진 업로드 압축) |
| 레시피 재생 | `react-countdown-circle-timer`(원형 타이머), `swiper`(단계 전환) |
| 토스트 | **`sonner`** — alert/confirm을 대체(`<Toaster position="top-center" richColors closeButton/>`) |
| 차트 | `recharts` — `/my` 기록 요약의 6개월 추이 BarChart |
| 유틸 | `date-fns`, `unique-names-generator`(닉네임 생성), `clsx`/`class-variance-authority`, `cookies-next`, `linkifyjs`/`linkify-html`, `react-device-detect` |
| 분석 | Amplitude(`@amplitude/analytics-browser`), Vercel Analytics |
| 배포 | Vercel (`drippin.vercel.app`) — 푸시 시 자동 배포 |

---

## 도구·스크립트

- **패키지 매니저**: Yarn 4 (berry/PnP) — `.yarn/` 가상 캐시, `.pnp.cjs` 커밋됨.
- **품질**: TypeScript strict + ESLint(`next/core-web-vitals`) + Prettier. CI는 GitHub Actions(`.github/workflows/ci.yml`)에서 `typecheck` + `lint`.

```bash
yarn dev               # 개발 서버 (localhost:3000)
yarn build             # 프로덕션 빌드
yarn start             # 프로덕션 서버
yarn typecheck         # tsc --noEmit
yarn lint              # next lint
yarn supabase-gen-type # Supabase DB 타입 생성 → types/database.types.ts
```

---

## 주의 / 메모

- **Realtime 구독은 사용하지 않는다.** 데이터 동기화는 React Query의 `invalidateQueries`로 처리한다([`architecture.md`](./architecture.md#캐시-무효화) 참조).
- `@tiptap/*`가 의존성에 남아 있으나 현재 코드에서 import되지 않는다(사실상 미사용). 새 기능에서 리치 에디터가 필요 없다면 정리 대상.
- daisyUI는 **플러그인**으로 사용(클래스: `btn`, `input-bordered`, `tabs` 등). `react-daisyui` 래퍼는 미사용으로 제거됨.
