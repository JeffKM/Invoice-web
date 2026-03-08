/** 견적서 상태 */
export type InvoiceStatus = 'Draft' | 'Sent' | 'Approved' | 'Rejected'

/** 견적 항목 */
export interface InvoiceItem {
  id: string // 노션 페이지 ID
  name: string // 항목명
  quantity: number // 수량
  unitPrice: number // 단가 (원)
  amount: number // 금액 = 수량 × 단가
  note?: string // 비고
  order: number // 정렬 순서
}

/** 견적서 발행자 정보 */
export interface Issuer {
  companyName: string // 회사명
  contactName: string // 담당자명
  email: string // 이메일
  phone?: string // 전화번호
  businessNumber?: string // 사업자번호 (000-00-00000 형식)
}

/** 견적서 고객 정보 */
export interface InvoiceClient {
  companyName: string // 고객사명
  contactName?: string // 담당자명
  email?: string // 이메일
}

/** 견적서 합계 */
export interface InvoiceSummary {
  subtotal: number // 소계 (부가세 제외, 원)
  tax: number // 부가세 = subtotal × 0.1
  total: number // 총액 = subtotal + tax
}

/** 견적서 전체 도메인 모델 */
export interface InvoiceData {
  id: string // 노션 페이지 ID (UUID)
  invoiceNumber: string // 견적서 번호 (예: INV-2026-001)
  title: string // 견적서 제목
  status: InvoiceStatus // 현재 상태
  issuedAt: string // 발행일 (ISO 8601 날짜 문자열)
  expiresAt: string // 유효기간 만료일 (ISO 8601 날짜 문자열)
  issuer: Issuer // 발행자 정보
  client: InvoiceClient // 고객 정보
  items: InvoiceItem[] // 견적 항목 목록 (order 오름차순 정렬)
  summary: InvoiceSummary // 합계 정보
  paymentTerms?: string // 결제 조건
  notes?: string // 특이사항
}

/** API 응답 래퍼 타입 */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; statusCode: number }
