# ux-audit — 에이전트 UX 탐방·진단

Claude Code + Playwright MCP가 실제로 사이트를 돌아다니며 **보고 → 진단하고 → 개선안을 제안**하는 워크플로우의 산출물 폴더다.

현재 단계는 **진단 + 제안까지만** 한다. 코드는 사람이 리포트를 검토한 뒤 별도로 수정한다.

## 실행 방법

```bash
# 1. dev 서버 기동 (백그라운드)
yarn dev   # http://localhost:3000

# 2. Claude Code 에서
/explore-ux                      # 기본 목표로 진단
/explore-ux 일지 작성 플로우 개선   # 특정 목표를 줄 수도 있음
```

`/explore-ux`는 주요 페이지를 순회하며 스크린샷·콘솔 에러를 수집하고,
성공 기준 체크리스트로 진단한 뒤 우선순위별 개선안을 리포트로 남긴다.

## 최초 로그인 1회 (세션 재사용)

이 앱은 **Kakao/Google OAuth 전용**이라 에이전트가 자동 로그인할 수 없다.
대신 Playwright **영구 프로필**(`.playwright-profile/`, git 제외)에 한 번만 수동 로그인해두면 이후 세션이 재사용된다.

1. `/explore-ux` 실행 시 헤드풀(headed) 브라우저 창이 뜬다.
2. 공개 페이지(`/`, `/recipe/[id]`, `/log/[id]`)는 자동으로 진행된다.
3. 로그인이 필요한 페이지(`/recipe`, `/log`, `/my`, `*/add`)에 도달하면 **그 브라우저 창에서 직접 Kakao/Google 로그인**을 1회 수행한다.
4. 세션이 `.playwright-profile/`에 저장되어, 다음 실행부터는 로그인 없이 바로 탐방된다.

> 로그인 콜백이 실패하면 Supabase 대시보드에서 `http://localhost:3000` 리다이렉트 URL이 허용돼 있는지 확인한다. (dev 환경에서 보통 설정됨)

## 폴더 구조

```
ux-audit/
├── README.md
├── screenshots/
│   ├── before/   # 진단 시점 캡처 (이미지는 git 제외)
│   └── after/    # 개선 검증용 (추후 루프 확장 시 사용)
└── findings/     # 날짜별 진단 리포트 (.md)
```

## 다음 단계 (확장)

리포트의 개선안을 사람이 검토·반영한 뒤, "after 스크린샷 + 코드 수정 + 재검증" 루프를 `/explore-ux`에 확장할 수 있다.
