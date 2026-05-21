# Drippin 문서

Drippin의 기획·기술·정신 문서 모음. 루트 [`../CLAUDE.md`](../CLAUDE.md)는 이 문서들의 요약 + 작업 규칙이다.

```
docs/
├── product/        # 기획 — 무엇을, 왜
│   ├── overview.md                  # 한 줄 정의·가치·타깃·핵심 시나리오
│   ├── positioning-roadmap.md       # 토스증권 모델·로드맵 (변함, 날짜 있음)
│   └── information-architecture.md  # 라우트 맵·내비게이션·진입 권한
├── engineering/    # 기술 — 어떻게
│   ├── tech-stack.md                # 실제 사용 스택·스크립트
│   ├── architecture.md              # RSC prefetch·React Query·네비 성능·디자인 토큰
│   └── conventions.md               # 코딩 컨벤션·브랜치/커밋/PR 플로우
└── spirit/         # 변하지 않을 정신 — 판단 기준
    ├── product-spirit.md            # 두 축 집중·코어 우선·가벼운 소셜
    └── design-spirit.md             # 모바일 우선·정보 밀도·1차 액션
```

## 어디서부터?

- **처음이라면** → [`product/overview.md`](./product/overview.md)
- **기능을 더할지 고민된다면** → [`spirit/`](./spirit/) (변하지 않는 판단 기준)
- **지금 무엇을 만드는 중인지** → [`product/positioning-roadmap.md`](./product/positioning-roadmap.md)
- **코드를 짜기 전에** → [`engineering/architecture.md`](./engineering/architecture.md) · [`engineering/conventions.md`](./engineering/conventions.md)

> UX 진단 산출물(스크린샷·리포트)은 docs와 별개로 [`../ux-audit/`](../ux-audit/)에 있다.
