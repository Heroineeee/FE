# 끼니콩 · 취업 포트폴리오 시연 버전

이 브랜치는 `develop`에서 분리된 **백엔드 없는 독립형 데모**입니다. 기존 서비스/운영 환경에는 영향이 없습니다.

## 지원하는 기능

- 홈 화면과 가맹점 추천 (예시 데이터)
- 가맹점 목록 검색, 카테고리 필터, 정렬
- 가맹점 상세, 예시 리뷰, 임시 좋아요 버튼
- 서버/API 키 없이 확인하는 예시 위치 개략도

회원가입·로그인·실제 위치 기반 실시간 검색·편의점/커뮤니티 쓰기는 제공하지 않으며 안내 화면이 표시됩니다. 지도 개략도는 실제 카카오 지도가 아닙니다. **표시되는 가맹점과 후기는 모두 포트폴리오 데모용 가상 데이터이며, 실제 아동급식카드 가맹점·운영 상태를 보장하지 않습니다.**

## 로컬 실행

```bash
npm ci
VITE_DEMO_MODE=true npm run dev
VITE_DEMO_MODE=true npm run build
```

Windows PowerShell에서는:

```powershell
$env:VITE_DEMO_MODE="true"
npm run dev
```

## Vercel 배포

1. GitHub의 `Heroineeee/FE`를 Vercel로 Import 합니다.
2. 프로젝트 설정에서 **Production Branch를 `portfolio-demo-20261112`**로 선택합니다. 기본 브랜치(`develop`)를 자동 배포하지 않도록 주의하세요.
3. `vercel.json`이 `VITE_DEMO_MODE=true npm run build`를 사용하므로 백엔드 주소와 DB 연결 없이 빌드됩니다.
4. Framework = Vite, Output Directory = `dist`.
5. 배포된 `*.vercel.app` 주소에서 홈 → 가맹점찾기 → 상세, 홈 → 가맹점지도 → 상세 경로를 확인합니다.
6. 옛 도메인 `kkinicong.co.kr`이나 기존 AWS 서버를 연결할 필요가 없습니다.

**주의:** 데모는 원본 서비스에 재연결되지 않습니다. 실제 데이터를 취급하거나 결제를 검증하는 용도가 아닙니다. 예시 가맹점·후기·위치·상태를 실제 데이터처럼 표현하면 안 됩니다. 배포 후 새 도메인 주소를 이력서에 넣어도 됩니다.

## 구성

- `src/mocks/stores.ts`: 현행 프론트 `Store` 타입에 맞춘 예시 레코드
- `src/mocks/demoApi.ts`: Axios adapter 기반 읽기 전용 HTTP 응답 (네트워크 없음)
- `src/pages/demo/`: 시연용 위치 개략도, 제한 기능 안내
- `src/api/axiosInstance.ts`: `VITE_DEMO_MODE` 환경변수에 따라 데모 응답 사용

`develop`에서는 데모 모드가 자동으로 켜지지 않으며 원래 API 연동 코드를 유지합니다.
