# Drippin - 드립커피 커뮤니티 플랫폼

<p align="center">
  <img src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png" alt="Drippin Logo" width="600">
</p>

<p align="center">
  드립커피를 사랑하는 사람들을 위한 레시피 공유 및 브루잉 로그 커뮤니티
</p>

<p align="center">
  <a href="#주요-기능">주요 기능</a> •
  <a href="#기술-스택">기술 스택</a> •
  <a href="#시작하기">시작하기</a> •
  <a href="#프로젝트-구조">프로젝트 구조</a> •
  <a href="#개발-가이드">개발 가이드</a> •
  <a href="#배포">배포</a>
</p>

## 📖 소개

Drippin은 드립커피 애호가들이 자신만의 레시피를 공유하고, 브루잉 경험을 기록하며, 커피 커뮤니티와 소통할 수 있는 플랫폼입니다. Next.js 14와 Supabase를 기반으로 구축되어 실시간 데이터 동기화와 원활한 사용자 경험을 제공합니다.

## ✨ 주요 기능

### 레시피 관리

- **레시피 작성 및 공유**: 자신만의 드립커피 레시피를 상세하게 기록하고 공유
- **단계별 브루잉 가이드**: 시간과 물의 양을 포함한 상세한 브루잉 단계 제공
- **타이머 기능**: 각 브루잉 단계별 카운트다운 타이머 내장
- **온보딩 플로우**: 레시피 따라하기를 위한 가이드 제공

### 브루잉 로그

- **일일 브루잉 기록**: 매일의 커피 브루잉 경험을 사진과 함께 기록
- **레시피 연결**: 사용한 레시피와 로그를 연결하여 추적
- **커뮤니티 피드**: 다른 사용자들의 브루잉 로그 탐색

### 사용자 기능

- **소셜 로그인**: Google, Kakao 계정을 통한 간편 로그인
- **마이페이지**: 내 레시피와 로그 관리
- **좋아요 시스템**: 마음에 드는 레시피와 로그에 좋아요 표시
- **무한 스크롤**: 피드에서 끊김 없는 콘텐츠 탐색

### UI/UX 특징

- **모바일 최적화**: 모바일 퍼스트 디자인과 하단 탭 네비게이션
- **실시간 업데이트**: Supabase 실시간 구독을 통한 즉각적인 데이터 동기화
- **반응형 디자인**: 모든 디바이스에서 최적화된 경험 제공

## 🛠 기술 스택

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**:
  - Tailwind CSS
  - shadcn/ui 컴포넌트
  - DaisyUI
- **State Management**:
  - React Query (TanStack Query) - 서버 상태 관리
  - React Hook Form - 폼 상태 관리

### Backend & Infrastructure

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (OAuth - Google, Kakao)
- **Real-time**: Supabase Realtime subscriptions
- **Image Storage**: Supabase Storage + Next.js Image Optimization

### Development Tools

- **Package Manager**: Yarn 4.4.1
- **Code Quality**: TypeScript, ESLint
- **Type Generation**: Supabase CLI for database types
- **Analytics**: Vercel Analytics
- **Rich Text Editor**: Tiptap

### Key Libraries

- `@supabase/ssr`: 쿠키 기반 인증 관리
- `@tanstack/react-query`: 데이터 페칭 및 캐싱
- `react-countdown-circle-timer`: 타이머 UI
- `browser-image-compression`: 이미지 최적화
- `swiper`: 이미지 슬라이더
- `next-scroll-restorer`: 스크롤 위치 복원

## 🚀 시작하기

### 사전 요구사항

- Node.js 18.0 이상
- Yarn 4.4.1
- Supabase 계정 및 프로젝트

## 📁 프로젝트 구조

```
drippin/
├── app/                      # Next.js App Router 페이지
│   ├── recipe/              # 레시피 관련 페이지
│   │   ├── [recipeId]/      # 레시피 상세 페이지
│   │   │   ├── edit/        # 레시피 수정
│   │   │   ├── onboarding/  # 레시피 온보딩
│   │   │   └── timer/       # 브루잉 타이머
│   │   └── add/             # 레시피 추가
│   ├── log/                 # 브루잉 로그 페이지
│   │   ├── [logId]/         # 로그 상세
│   │   └── add/             # 로그 추가
│   ├── auth/                # 인증 관련
│   │   └── callback/        # OAuth 콜백 처리
│   ├── my/                  # 마이페이지
│   └── page.tsx             # 홈 피드
│
├── components/              # React 컴포넌트
│   ├── ui/                  # shadcn/ui 기본 컴포넌트
│   ├── share/               # 공통 컴포넌트
│   ├── recipe/              # 레시피 전용 컴포넌트
│   ├── home/                # 홈 페이지 컴포넌트
│   ├── nav/                 # 네비게이션
│   ├── icon/                # 아이콘 컴포넌트
│   └── providers/           # Context Providers
│
├── queries/                 # React Query 관련
│   ├── queryKeys.ts         # 쿼리 키 관리
│   ├── feed.ts              # 피드 데이터 페칭
│   ├── recipe.ts            # 레시피 CRUD
│   ├── log.ts               # 로그 CRUD
│   └── session.ts           # 세션 관리
│
├── types/                   # TypeScript 타입 정의
│   ├── database.types.ts    # Supabase 자동 생성 타입
│   ├── brew.ts              # 브루잉 관련 타입
│   └── TypedSupabaseClient.ts
│
├── utils/                   # 유틸리티 함수
│   ├── supabase/           # Supabase 클라이언트
│   │   ├── client.ts       # 브라우저 클라이언트
│   │   ├── server.ts       # 서버 클라이언트
│   │   └── middleware.ts   # 세션 미들웨어
│   ├── analytics.ts        # Amplitude 분석
│   └── getQueryClient.ts   # React Query 클라이언트
│
├── hooks/                   # 커스텀 React Hooks
├── public/                  # 정적 파일
└── styles/                  # 글로벌 스타일
```

## 💻 개발 가이드

### 코딩 컨벤션

1. **Import 규칙**

   - 절대 경로 사용: `@/` prefix 활용
   - 순서: React → 외부 라이브러리 → 내부 모듈

2. **컴포넌트 구조**

   - Server Components를 기본으로 사용
   - Client Components는 필요한 경우에만 `'use client'` 지시문 사용
   - 페이지 컴포넌트는 데이터 페칭에 집중
   - 비즈니스 로직은 Feature 컴포넌트에 구현

3. **Supabase 클라이언트 사용**

   ```typescript
   // Server Component에서
   import { useSupabaseServer } from "@/utils/supabase/server";
   const supabase = useSupabaseServer();

   // Client Component에서
   import useSupabaseBrowser from "@/utils/supabase/client";
   const supabase = useSupabaseBrowser();
   ```

4. **React Query 패턴**

   - 모든 서버 상태는 React Query로 관리
   - Query Keys는 `queries/queryKeys.ts`에서 중앙 관리

5. **타입 안전성**
   - 모든 Supabase 작업에 `TypedSupabaseClient` 사용
   - 데이터베이스 스키마 변경 시 타입 재생성 필수

## 🚢 배포

### Vercel 배포

1. [Vercel](https://vercel.com)에 GitHub 저장소 연결
2. 환경 변수 설정
3. 자동 배포 설정 활성화

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/drippin)

## 커밋 가이드

1. Fork 후 feature 브랜치 생성
2. 변경사항 커밋
3. Pull Request 생성

커밋 메시지 컨벤션:

- `feat:` 새로운 기능
- `fix:` 버그 수정
- `docs:` 문서 수정
- `style:` 코드 포맷팅
- `refactor:` 코드 리팩토링
- `test:` 테스트 추가
- `chore:` 빌드 작업 등

## 🔗 관련 링크

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

---

이 README 문서는 생성형 AI의 도움을 받아 작성되었습니다.
