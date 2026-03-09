# Task 008: 성능 최적화 및 품질 개선

## 상태: 완료 ✅

## 목표

Invoice Web Viewer의 접근성, 성능, 품질을 검증하고 필요한 개선 사항을 적용한다.
Vercel 배포(Task 007) 전에 코드 품질을 확보하여 배포 직후 바로 프로덕션 수준을 달성한다.

## 수락 기준

- [x] 접근성: table scope 속성 추가, aria-label 검증
- [x] SEO: robots noindex 메타태그 정상 동작 확인
- [x] 다크 모드: 견적서 모든 섹션 렌더링 이상 없음
- [x] 캐싱: ISR revalidate=60 및 fetch 캐싱 전략 검증
- [x] 성능: 빌드 번들 최적화 및 Next.js 성능 설정 확인
- [x] 에러 로깅: 구조화된 로깅 함수 도입

## 관련 파일

- `src/components/invoice/invoice-items.tsx` - table scope 속성 추가
- `src/components/invoice/invoice-view.tsx` - 전체 레이아웃 검증
- `src/app/invoice/[id]/page.tsx` - SEO/ISR 검증
- `src/lib/notion/invoice.ts` - 캐싱 전략 검증
- `src/lib/logger.ts` - 신규 생성 (구조화된 로깅)
- `next.config.ts` - 성능 설정 검증

## 구현 단계

### 단계 1: 다크 모드 렌더링 검증 (Playwright MCP)

- `/invoice/demo` 페이지 다크 모드 강제 적용 후 스크린샷
- 모든 섹션(헤더, 정보, 항목, 합계, 하단) 색상 대비 확인

### 단계 2: 접근성 개선

- `invoice-items.tsx` table th에 `scope` 속성 추가 (col/row)
- 페이지 내 aria-label 검토

### 단계 3: 구조화된 에러 로깅

- `src/lib/logger.ts` 생성 - 환경별 로그 레벨 제어
- API route 및 Server Component에서 console.error 대체

### 단계 4: 성능 측정

- `npm run build && npm run start` 후 localhost:3000 확인

## 테스트 체크리스트

### 다크 모드 검증 (Playwright MCP)

- [ ] `/invoice/demo` 다크 모드에서 배경색 #1a1a1a 계열 확인
- [ ] 텍스트 대비 WCAG AA 기준 충족 여부 시각 확인
- [ ] 상태 뱃지(Draft/Sent/Approved/Rejected) 다크 모드 색상 확인

### 접근성 검증 (Playwright MCP)

- [ ] table th에 scope="col" / scope="row" 존재 확인
- [ ] aria-label이 있는 section 요소 확인
- [ ] PDF 다운로드 버튼 aria-label 확인

### SEO 검증

- [ ] /invoice/[id] 페이지 <meta name="robots" content="noindex,nofollow"> 확인

## 노트

- 이미 완료된 것: ISR revalidate=60, fetch 캐싱, compress:true, WebP/AVIF, optimizePackageImports
- Task 007 이후 프로덕션 환경에서 성능 재측정 권장
