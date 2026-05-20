---
description: Playwright MCP로 사이트를 직접 탐방하며 UX/IA를 진단하고 개선안을 제안 (코드 수정 안 함)
argument-hint: [목표 — 비우면 기본 목표 사용]
---

너는 drippin(Next.js + Supabase 드립커피 커뮤니티, 모바일 우선 max 768px) 앱을 **Playwright MCP 브라우저로 직접 탐방하며 UX를 진단**하는 에이전트다.

## 목표

$ARGUMENTS

위 목표가 비어 있으면 기본 목표를 사용한다:
> 처음 온 사용자가 5초 안에 서비스(드립커피 레시피·일지 공유)의 가치를 이해하고, 2클릭 이내로 핵심 기능(레시피 보기 / 일지 작성)에 자연스럽게 도달한다.

## 매우 중요한 제약

- **코드를 절대 수정하지 않는다.** 이번 작업은 진단 + 제안까지만이다.
- 쓰기 행위는 `ux-audit/` 폴더 안의 산출물(스크린샷, 리포트) 생성뿐이다.
- 데이터를 실제로 생성/삭제하지 않는다. 폼(`/recipe/add`, `/log/add`)은 흐름·레이아웃만 점검하고 **제출하지 않는다.**

## 프로세스

1. **dev 서버 확인**: `http://localhost:3000`이 응답하는지 확인. 안 떠 있으면 사용자에게 `yarn dev`를 백그라운드로 실행해달라고 요청하고 멈춘다.

2. **페이지 순회 탐방** (Playwright MCP `browser_navigate`):
   - 공개: `/` (피드), `/recipe/[id]` (레시피 상세 — 피드에서 실제 id 하나 클릭해 진입), `/log/[id]` (일지 상세 — 동일)
   - 로그인 필요: `/recipe`, `/log`, `/recipe/add`, `/log/add`, `/my`
   - 로그인이 필요한 페이지에서 비로그인 상태면, 헤드풀 브라우저 창에서 **사용자가 직접 Kakao/Google 로그인**하도록 안내하고 완료를 기다린다. (세션은 `.playwright-profile/`에 저장되어 재사용됨)

3. **각 페이지에서 수집**:
   - `browser_take_screenshot` → `ux-audit/screenshots/before/<route-slug>.png` (예: `home.png`, `recipe-detail.png`, `log-add.png`)
   - `browser_console_messages` → 콘솔 에러/경고 수집
   - `browser_network_requests` → 4xx·5xx 응답, 깨진 이미지 확인
   - 화면을 `browser_snapshot`으로 보고 레이아웃·카피·정보구조를 직접 판단

4. **뷰포트**: 기본 390px(모바일)로 보고, 의심되는 곳은 `browser_resize`로 768px(태블릿)도 점검.

5. **성공 기준 체크리스트**로 페이지별 진단:
   - [ ] 첫 화면(피드)에서 서비스가 무엇인지 5초 안에 이해 가능 / CTA가 명확한가
   - [ ] 비로그인 사용자에게 가치·다음 행동(LoginNudge)이 자연스럽게 안내되는가
   - [ ] 핵심 기능(레시피 보기, 일지 작성)까지 2클릭 이내인가
   - [ ] 모바일 390px에서 레이아웃 깨짐 없음 (max-w 컨테이너, 하단 탭 88px 패딩 고려)
   - [ ] 콘솔 에러 / 깨진 이미지 / 네트워크 4xx·5xx 없음
   - [ ] 폼(레시피 add 4단계, 일지 add 2단계) 흐름이 막힘없이 진행되는가

6. **문제 분류**: 발견한 문제를 우선순위(High / Medium / Low)로 나누고, 각각 작은 단위 개선안으로 쪼갠다. 가능하면 관련 소스 파일 경로를 짚는다 (`app/page.tsx`, `app/recipe/add/`, `app/log/add/`, `components/share/Wrapper.tsx`, `components/nav/` 등).

7. **리포트 작성**: `ux-audit/findings/<오늘 날짜 YYYY-MM-DD>.md`에 저장:
   - 탐방한 목표 / 페이지 목록
   - 페이지별 진단 (체크리스트 결과 + before 스크린샷 경로 + 콘솔/네트워크 에러)
   - 우선순위별 개선 제안 (문제 → 제안 → 관련 파일)
   - 마지막에 **"다음에 적용할 개선 Top 1~3"** 요약

8. 작업을 마치면 리포트 경로와 핵심 발견 3가지를 사용자에게 간단히 보고한다. **코드는 건드리지 않았음을 확인해준다.**
