# Invoice Web Viewer 개발 로드맵

노션에서 입력한 견적서 데이터를 클라이언트가 고유 URL로 웹에서 확인하고 PDF로 다운로드하는 서비스

## 개요

Invoice Web Viewer는 1인 사업자 및 프리랜서를 위한 견적서 웹 뷰어로 다음 기능을 제공합니다:

- **노션 데이터 연동**: 노션 데이터베이스에 입력한 견적서 정보를 자동으로 웹 페이지에 반영 (ISR 60초)
- **견적서 웹 뷰어**: 고유 URL(`/invoice/[id]`)로 별도 로그인 없이 브라우저에서 즉시 열람
- **PDF 다운로드**: 웹 렌더링과 동일한 레이아웃의 PDF 파일 생성 및 다운로드
- **상태 관리**: 초안/발송/승인/거절 상태를 색상 뱃지로 시각화

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-setup.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)
   - 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조. 초기 상태의 샘플로 `000-sample.md` 참조.

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - **각 구현 단계는 다음 사이클을 반복:**
     1. 코드 구현
     2. Playwright MCP로 테스트 수행 (API 응답 검증, 에러 시나리오, 경계값)
     3. 테스트 결과 검증 및 확인
     4. 실패 시 → 재구현 후 재테스트 (통과할 때까지 반복)
     5. 통과 시 → 다음 단계로 진행
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 완료 표시로 갱신

## 개발 단계

### Phase 1: 애플리케이션 골격 구축 -- 완료

- **Task 001: 프로젝트 구조 및 라우팅 설정** -- 완료
  - See: `/tasks/001-project-structure.md`
  - 완료: Next.js App Router 기반 전체 라우트 구조 생성 (`/invoice/[id]`, `/api/invoice/[id]/pdf`)
  - 완료: 루트 레이아웃 (`layout.tsx`) - ThemeProvider, Toaster, Geist 폰트 설정
  - 완료: 루트 페이지 (`page.tsx`) - 플레이스홀더 안내 페이지
  - 완료: 견적서 페이지 구조 (`page.tsx`, `not-found.tsx`, `error.tsx`)
  - 완료: PDF API Route 플레이스홀더 (`route.ts` - 501 응답)

- **Task 002: 타입 정의 및 인터페이스 설계** -- 완료
  - See: `/tasks/002-type-definitions.md`
  - 완료: 도메인 모델 타입 정의 (`src/lib/invoice/types.ts`) - InvoiceData, InvoiceItem, Issuer, InvoiceClient, InvoiceSummary, InvoiceStatus, ApiResponse
  - 완료: 노션 API 응답 타입 정의 (`src/lib/notion/types.ts`) - NotionInvoicePage, NotionInvoiceItemPage, 모든 Notion 속성 타입
  - 완료: 환경변수 검증 스키마 (`src/lib/env.ts`) - Zod를 사용한 NOTION_API_KEY, NOTION_INVOICES_DB_ID, NOTION_ITEMS_DB_ID 검증

### Phase 2: UI/UX 완성 -- 완료

- **Task 003: 견적서 UI 컴포넌트 라이브러리 구현** -- 완료
  - See: `/tasks/003-invoice-ui-components.md`
  - 완료: `invoice-view.tsx` - 메인 뷰 컴포넌트 (데스크톱 A4 794px 카드, 모바일 전체 너비)
  - 완료: `invoice-header.tsx` - 제목, 번호, 상태 뱃지, 발행일/유효기간
  - 완료: `invoice-info.tsx` - 발행자/고객 정보 2단 레이아웃
  - 완료: `invoice-items.tsx` - 항목 테이블 (번호, 항목명, 수량, 단가, 금액, 비고)
  - 완료: `invoice-summary.tsx` - 소계, 부가세(10%), 총액 우측 정렬
  - 완료: `invoice-footer.tsx` - 결제 조건, 유효기간 안내, 특이사항, PDF 다운로드 버튼
  - 완료: `invoice-status-badge.tsx` - 상태별 색상 뱃지 (Draft=회색, Sent=파랑, Approved=초록, Rejected=빨강)
  - 완료: `invoice-expired-banner.tsx` - 만료 안내 배너 (amber 색상, AlertTriangle 아이콘)
  - 완료: `pdf-download-button.tsx` - Client Component, 로딩 상태, sonner 토스트 오류 처리

- **Task 004: 견적서 페이지 통합 및 반응형 디자인** -- 완료
  - See: `/tasks/004-page-integration.md`
  - 완료: 견적서 페이지 (`/invoice/[id]`) Server Component로 모든 UI 컴포넌트 통합
  - 완료: ISR 설정 (revalidate=60)
  - 완료: 메타데이터 생성 (robots: noindex)
  - 완료: 에러 처리 - notFound() 호출 및 error.tsx 에러 바운더리
  - 완료: 커스텀 404 페이지 (FileSearch 아이콘, 안내 메시지)
  - 완료: 반응형 디자인 - 데스크톱 A4 카드 / 모바일 전체 너비
  - 완료: 인쇄 스타일 최적화 (print:bg-white, print:shadow-none, print:hidden)

### Phase 3: 핵심 기능 구현

- **Task 005: 노션 데이터 연동 및 변환 로직** -- 완료
  - See: `/tasks/005-notion-integration.md`
  - 완료: Notion API 클라이언트 싱글톤 (`src/lib/notion/client.ts`)
  - 완료: 견적서 데이터 조회 함수 (`src/lib/notion/invoice.ts`) - getInvoicePage, getInvoiceItems, getInvoiceById (Promise.all 병렬 조회)
  - 완료: 데이터 변환 로직 (`src/lib/invoice/transformer.ts`) - 노션 속성 추출, InvoiceStatus 변환, 항목 변환 및 정렬, 합계 계산 (노션 Formula 우선, 폴백 직접 계산)
  - 완료: 포맷 유틸리티 (`src/lib/invoice/formatters.ts`) - formatKRW, calculateTax, formatKoreanDate, formatBusinessNumber, isExpired

- **Task 006: PDF 생성 API 구현** -- 완료
  - 완료: puppeteer-core + @sparticuz/chromium 설치 및 next.config.ts serverExternalPackages 설정
  - 완료: `src/lib/pdf/generator.ts` - 로컬(시스템 Chrome)/Vercel(@sparticuz/chromium) 환경 분기
  - 완료: `/api/invoice/[id]/pdf` 실제 PDF 생성 구현 (200/404/500 에러 처리)
  - 완료: 파일명 RFC 5987 인코딩 (`견적서_[번호]_[고객사명].pdf`)
  - 완료: @notionhq/client v5 dataSources.query → fetch 직접 호출로 호환성 수정
  - 완료: formatKoreanDate null-safety 수정

- **Task 006-1: 노션 연동 통합 테스트**
  - Playwright MCP를 사용한 견적서 전체 플로우 E2E 테스트
  - 정상 시나리오: 정상 견적서 페이지 로드 → 모든 섹션 표시 → PDF 다운로드 완주 검증
  - 에러 시나리오: 존재하지 않는 ID(404), 노션 API 오류(에러 바운더리), PDF 생성 실패 UI 반응 검증
  - 엣지 케이스: 만료된 견적서 배너 표시, 상태별 뱃지 색상(Draft/Sent/Approved/Rejected), 모바일/데스크톱 반응형 레이아웃 검증
  - 테스트 실패 항목 재구현 후 재테스트 완료 확인

### Phase 4: 배포 및 최적화

- **Task 007: 환경변수 설정 및 Vercel 배포**
  - `.env.local` 환경변수 가이드 문서화 (NOTION_API_KEY, NOTION_INVOICES_DB_ID, NOTION_ITEMS_DB_ID)
  - Vercel 프로젝트 환경변수 설정
  - Vercel 배포 설정 및 최초 배포
  - 배포 환경에서 노션 API 연동 동작 확인
  - ISR 재검증 동작 확인 (60초 이내 데이터 반영)
  - PDF 생성 기능 Vercel 서버리스 환경 동작 확인

- **Task 008: 성능 최적화 및 품질 개선**
  - 페이지 로드 성능 최적화 (3초 이내 목표)
  - 노션 API 응답 캐싱 전략 검토 및 적용
  - 접근성(a11y) 검증 및 개선
  - SEO 메타태그 최종 점검 (robots: noindex 확인)
  - 다크 모드 견적서 렌더링 검증
  - 에러 모니터링 체계 구축 (console.error 대신 에러 추적 서비스 연동 검토)

## 기술 스택 요약

| 영역        | 기술                                                  |
| ----------- | ----------------------------------------------------- |
| Framework   | Next.js 15.5.3 (App Router + Turbopack), React 19.1.0 |
| Language    | TypeScript 5 (strict)                                 |
| Styling     | TailwindCSS v4, shadcn/ui (new-york), Lucide React    |
| Data Source | @notionhq/client, ISR (revalidate=60)                 |
| PDF         | puppeteer + @sparticuz/chromium                       |
| Validation  | Zod                                                   |
| Toast       | sonner                                                |
| Theme       | next-themes                                           |
| Deploy      | Vercel                                                |

## 파일 구조

```
src/
├── app/
│   ├── invoice/[id]/
│   │   ├── page.tsx              # 견적서 웹 뷰어 (Server Component, ISR revalidate=60)
│   │   ├── not-found.tsx         # 커스텀 404 페이지
│   │   └── error.tsx             # 에러 바운더리
│   ├── api/invoice/[id]/pdf/
│   │   └── route.ts              # PDF 생성 API Route
│   ├── layout.tsx                # 루트 레이아웃 (ThemeProvider + Toaster)
│   └── page.tsx                  # 루트 페이지 (플레이스홀더)
├── components/invoice/
│   ├── invoice-view.tsx          # 메인 뷰 컴포넌트 (Server Component)
│   ├── invoice-header.tsx        # 헤더: 제목, 번호, 상태, 날짜
│   ├── invoice-info.tsx          # 발행자/고객 정보 2단 레이아웃
│   ├── invoice-items.tsx         # 항목 테이블
│   ├── invoice-summary.tsx       # 합계 섹션 (소계/부가세/총액)
│   ├── invoice-footer.tsx        # 하단 안내 (결제조건/특이사항/PDF)
│   ├── invoice-status-badge.tsx  # 상태별 색상 뱃지
│   ├── invoice-expired-banner.tsx # 만료 안내 배너
│   └── pdf-download-button.tsx   # PDF 다운로드 버튼 ("use client")
└── lib/
    ├── notion/
    │   ├── client.ts             # Notion API 클라이언트 싱글톤
    │   ├── invoice.ts            # 견적서 데이터 조회 함수
    │   └── types.ts              # Notion API 응답 타입 정의
    ├── invoice/
    │   ├── types.ts              # 도메인 모델 타입 (InvoiceData 등)
    │   ├── transformer.ts        # Notion → 도메인 모델 변환
    │   └── formatters.ts         # 포맷 유틸리티 (KRW, 날짜, 사업자번호)
    └── env.ts                    # 환경변수 검증 (Zod)
```
