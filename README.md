# QuickMemo (빠른 메모장)

이 프로젝트는 빠르고 안전하게 동기화되는 프로그레시브 웹 앱(PWA) 메모장 화면입니다. Google 로그인을 통해 인증된 사용자만 자신의 메모를 관리할 수 있습니다.

## 🚀 기술 스택 (Tech Stack)

### 프론트엔드 (Frontend)
- **프레임워크**: [React 19](https://react.dev/)
- **빌드 툴**: [Vite](https://vitejs.dev/)
- **언어**: TypeScript
- **스타일링**: [Tailwind CSS](https://tailwindcss.com/)
- **아이콘**: [Lucide React](https://lucide.dev/)
- **PWA**: `vite-plugin-pwa`를 이용한 프로그레시브 웹 앱 설정 지원

### 백엔드 및 데이터베이스 (Backend / DB & Auth)
- **BaaS (Backend as a Service)**: [Convex](https://www.convex.dev/) - 서크버리스(serverless) 프레임워크로, 백엔드 로직과 데이터베이스 관리를 동시에 처리
- **인증 (Authentication)**: `@convex-dev/auth` - 구글 OAuth(Google 로그인을 통한 인증) 지원

### 배포 (Deployment)
- **프론트엔드 호스팅**: GitHub Pages (`gh-pages` 패키지 사용)
- **백엔드 호스팅**: Convex Cloud

---

## 🎯 주요 기능 및 요구사항 (Key Features & Requirements)

1. **사용자 인증 (Authentication)**
   - Convex Auth를 연동하여 안전한 Google 계정 로그인을 지원합니다.
   - 비로그인 사용자는 로그인 페이지(환영 화면)만 볼 수 있습니다.

2. **메모 관리 (Memo Management) - CRUD 기능**
   - **조회**: 해당 로그인 사용자의 메모 목록만 시간의 역순(최신순)으로 가져와서 화면에 보여줍니다.
   - **생성**: 제목과 내용을 입력하여 새로운 메모를 추가할 수 있습니다.
   - **수정**: 본인 소유의 메모 내용을 열람하고 수정(업데이트)할 수 있습니다.
   - **삭제**: 더 이상 필요 없는 메모를 제거할 수 있습니다.
   - *보안*: Convex 서버 함수에서 항상 현재 사용자의 Auth(토큰 기반 인증) 여부 및 메모 소유권을 검사합니다.

3. **PWA (Progressive Web App)**
   - 앱처럼 설치하여 오프라인 캐싱 및 모바일 경험 향상 (`vite-plugin-pwa` 설정 포함).

---

## 🏗 프로젝트 구조 (Project Structure)

```text
quickmemo/
├── convex/                # Convex 백엔드 로직 및 설정 폴더
│   ├── auth.config.ts     # 인증 프로바이더(구글 등) 설정
│   ├── auth.ts            # Convex Auth 인스턴스
│   ├── memos.ts           # 메모와 관련된 CRUD 서버 함수(Query, Mutation)
│   ├── schema.ts          # 데이터베이스 스키마 정의 (users, memos)
│   └── users.ts           # 사용자 정보 관리 (current 사용자 쿼리 등)
├── src/                   # React 프론트엔드 애플리케이션
│   ├── assets/            # 정적 파일
│   ├── components/        # UI 컴포넌트 폴더 (MemoApp.tsx 등)
│   ├── App.tsx            # 메인 앱 파일 (인증 상태에 따른 화면 분기 처리)
│   ├── main.tsx           # React 엔트리포인트 및 ConvexProvider 설정
│   └── index.css          # 전역 스타일 및 Tailwind CSS 진입점
├── package.json           # 의존성 패키지 및 스크립트 모음
├── vite.config.ts         # Vite 및 PWA 플러그인 설정
└── tailwind.config.js     # Tailwind CSS 설정
```

---

## 💻 로컬에서 실행하기 (Getting Started)

1. **패키지 설치**:
   ```bash
   npm install
   ```

2. **환경 변수 파일 설정 (`.env.local`)**:
   Convex 및 Google OAuth 연동에 필요한 환경 변수 설정
   - `VITE_CONVEX_URL`: Convex 프로젝트의 퍼블릭 URL
   - OAuth 관련 시크릿 (Convex 대시보드 참고)

3. **개발 서버 및 Convex 실행 (동시에 2개 터미널 권장)**:
   ```bash
   # 터미널 1: Convex 로컬 환경 실행
   npx convex dev

   # 터미널 2: React Vite 개발 서버 실행
   npm run dev
   ```

## 📦 빌드 및 배포 (Build and Deploy)

이 프로젝트는 Github Pages에 배포되도록 설정되어 있습니다.

```bash
# 전체 빌드 및 배포 명령 (predeploy에서 convex backend가 먼저 배포됨)
npm run deploy
```

- `npm run build`: TypeScript 컴파일 및 Vite 프로덕션 빌드 
- `npm run deploy`: 빌드된 결과물을 `gh-pages` 브랜치에 푸시하여 실 서비스 호스팅
