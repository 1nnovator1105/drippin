# 컨벤션 & 작업 플로우 (Conventions)

---

## 코딩 컨벤션

1. **Import**: 절대 경로 `@/` prefix. 순서는 React → 외부 라이브러리 → 내부 모듈.
2. **컴포넌트 경계**: Server Component 기본. `'use client'`는 상호작용/브라우저 API가 필요할 때만. 페이지(서버)는 데이터 prefetch에 집중하고, 비즈니스 로직·상태는 feature 컴포넌트(클라)에 둔다([`architecture.md`](./architecture.md)).
3. **Supabase 클라이언트**: 서버 `getSupabaseServer()`, 클라 `useSupabaseBrowser()`.
4. **서버 상태**: 전부 React Query. 키는 `queries/queryKeys.ts`에서만 만든다.
5. **타입 안전성**: Supabase 작업엔 `TypedSupabaseClient`. DB 스키마 변경 시 `yarn supabase-gen-type`로 타입 재생성.
6. **사용자 알림**: `alert/confirm` 금지 → `sonner` 토스트. 색상은 디자인 토큰 사용.
7. **검증**: PR 전 `yarn typecheck` + `yarn lint` (0 errors/warnings 유지).

---

## 작업 플로우 (브랜치 → 커밋 → 푸시 → PR)

큰 단위 작업은 브랜치에서 진행하고, 끝나면 커밋 → 푸시 → PR 생성을 기본으로 한다.

1. **브랜치**: `main`에서 분기. 네이밍 `feat-<주제>` / `fix-<주제>` / `style-…` / `perf-…` / `docs-…`. 오타·문서 한 줄 등 작은 수정은 브랜치 없이 가능.
2. **커밋**: 한글 Conventional Commits — `feat:` `fix:` `chore:` `refactor:` `docs:` `style:` `perf:`. 푸시는 **사용자가 요청할 때만**.
3. **푸시**: `git push -u origin <branch>`.
4. **PR**: `gh pr create` 로 `main` 대상. 본문 필수 구성 — `## 변경 사항`(무엇·왜) / `## 테스트`(확인 방법) / UI 변경 시 스크린샷.
5. 생성 후 PR URL을 보고한다. **머지는 사용자 승인 후.**

### 푸터 규칙

- 커밋 메시지 끝:
  ```
  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
  ```
- PR 본문 끝:
  ```
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  ```

> 비가역적·외부 노출 작업(푸시, PR 생성, 머지)은 사용자 승인 후 진행한다.

---

## UX 진단(`/explore-ux`) 제약

- **코드를 수정하지 않는다.** 산출물은 `ux-audit/` 폴더(스크린샷·리포트)뿐.
- 데이터를 생성/삭제하지 않는다. 폼은 흐름·레이아웃만 점검하고 **제출하지 않는다.**
