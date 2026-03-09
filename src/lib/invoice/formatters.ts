/**
 * 원화 금액 포맷 유틸리티
 * 예: 1234567 → "1,234,567원"
 */
export function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(Math.round(amount)) + '원'
}

/**
 * 부가세 계산 (10%, 원 단위 반올림)
 * 예: 1000000 → 100000
 */
export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * 0.1)
}

/**
 * 한국어 날짜 포맷
 * 예: "2026-03-08" → "2026년 3월 8일"
 */
export function formatKoreanDate(isoDate: string): string {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  if (isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * 사업자번호 포맷
 * 예: "1234567890" → "123-45-67890"
 */
export function formatBusinessNumber(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '')
  if (digits.length !== 10) return raw
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`
}

/**
 * 견적서 만료 여부 확인
 * @param expiresAt ISO 8601 날짜 문자열
 */
export function isExpired(expiresAt: string): boolean {
  const expiryDate = new Date(expiresAt)
  const today = new Date()
  // 날짜만 비교 (시간 무시)
  today.setHours(0, 0, 0, 0)
  expiryDate.setHours(0, 0, 0, 0)
  return expiryDate < today
}
