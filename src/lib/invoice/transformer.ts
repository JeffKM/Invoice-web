import type {
  NotionInvoicePage,
  NotionInvoiceItemPage,
} from '@/lib/notion/types'
import type {
  InvoiceData,
  InvoiceItem,
  InvoiceStatus,
  InvoiceClient,
  InvoiceSummary,
  Issuer,
} from '@/lib/invoice/types'
import { calculateTax } from '@/lib/invoice/formatters'

/**
 * Notion Rich Text 배열에서 plain_text 추출
 */
function extractRichText(
  richText: Array<{ plain_text: string }> | undefined
): string {
  if (!richText || richText.length === 0) return ''
  return richText.map(t => t.plain_text).join('')
}

/**
 * Notion Status/Select 값을 InvoiceStatus로 변환
 * 유효하지 않은 값은 'Draft'로 폴백
 */
function toInvoiceStatus(value: string | null | undefined): InvoiceStatus {
  const validStatuses: InvoiceStatus[] = [
    'Draft',
    'Sent',
    'Approved',
    'Rejected',
  ]
  if (value && validStatuses.includes(value as InvoiceStatus)) {
    return value as InvoiceStatus
  }
  return 'Draft'
}

/**
 * 노션 견적 항목 페이지를 InvoiceItem 도메인 모델로 변환
 */
export function transformNotionItemToInvoiceItem(
  page: NotionInvoiceItemPage,
  index: number
): InvoiceItem {
  const props = page.properties

  const quantity =
    props['수량']?.type === 'number' ? (props['수량'].number ?? 1) : 1
  const unitPrice =
    props['단가']?.type === 'number' ? (props['단가'].number ?? 0) : 0

  // 노션 Formula 금액 우선, 없으면 직접 계산
  const formulaAmount =
    props['금액']?.type === 'formula' && props['금액'].formula.type === 'number'
      ? (props['금액'].formula.number ?? null)
      : null
  const amount = formulaAmount !== null ? formulaAmount : quantity * unitPrice

  // 정렬 순서 (없으면 인덱스로 폴백)
  const order =
    props['정렬 순서']?.type === 'number'
      ? (props['정렬 순서'].number ?? index)
      : index

  const titleArray =
    props['항목명']?.type === 'title' ? props['항목명'].title : []
  const noteArray =
    props['비고']?.type === 'rich_text' ? props['비고'].rich_text : []

  return {
    id: page.id,
    name: extractRichText(titleArray),
    quantity,
    unitPrice,
    amount,
    note: extractRichText(noteArray) || undefined,
    order,
  }
}

/**
 * 노션 견적서 페이지 + 항목 페이지 목록을 InvoiceData 도메인 모델로 변환
 *
 * 실제 Notion DB 속성명 매핑:
 *   - 견적서 번호 (title) → invoiceNumber + title
 *   - 상태 (status) → status
 *   - 발행일 (date) → issuedAt
 *   - 유효기간 (date) → expiresAt
 *   - 클라이언트명 (rich_text) → client.companyName
 *   - 총 금액 (number) → summary.total (subtotal/tax는 역산)
 */
export function transformNotionToInvoice(
  page: NotionInvoicePage,
  itemPages: NotionInvoiceItemPage[]
): InvoiceData {
  const props = page.properties

  // 견적서 번호 (title 타입 — Notion 페이지 제목으로 사용)
  const titleArray =
    props['견적서 번호']?.type === 'title' ? props['견적서 번호'].title : []
  const invoiceNumber = extractRichText(titleArray)
  const title = invoiceNumber // 별도 제목 없이 번호를 표시용으로 사용

  // 상태 (status 타입: name 필드로 InvoiceStatus 변환)
  const statusValue =
    props['상태']?.type === 'status' ? props['상태'].status?.name : undefined
  const status = toInvoiceStatus(statusValue)

  // 날짜 (발행일, 유효기간)
  const issuedAt =
    props['발행일']?.type === 'date' ? (props['발행일'].date?.start ?? '') : ''
  const expiresAt =
    props['유효기간']?.type === 'date'
      ? (props['유효기간'].date?.start ?? '')
      : ''

  // 발행자 정보 (선택 속성 — 미입력 시 빈 문자열/undefined)
  const issuer: Issuer = {
    companyName: extractRichText(
      props['발행자 회사명']?.type === 'rich_text'
        ? props['발행자 회사명'].rich_text
        : []
    ),
    contactName: extractRichText(
      props['발행자 담당자']?.type === 'rich_text'
        ? props['발행자 담당자'].rich_text
        : []
    ),
    email:
      props['발행자 이메일']?.type === 'email'
        ? (props['발행자 이메일'].email ?? '')
        : '',
    phone:
      props['발행자 전화번호']?.type === 'phone_number'
        ? (props['발행자 전화번호'].phone_number ?? undefined)
        : undefined,
    businessNumber:
      extractRichText(
        props['사업자번호']?.type === 'rich_text'
          ? props['사업자번호'].rich_text
          : []
      ) || undefined,
  }

  // 고객 정보 (클라이언트명은 필수, 나머지 선택)
  const client: InvoiceClient = {
    companyName: extractRichText(
      props['클라이언트명']?.type === 'rich_text'
        ? props['클라이언트명'].rich_text
        : []
    ),
    contactName:
      extractRichText(
        props['고객 담당자']?.type === 'rich_text'
          ? props['고객 담당자'].rich_text
          : []
      ) || undefined,
    email:
      props['고객 이메일']?.type === 'email'
        ? (props['고객 이메일'].email ?? undefined)
        : undefined,
  }

  // 항목 변환 및 정렬
  const items = itemPages
    .map((itemPage, index) => transformNotionItemToInvoiceItem(itemPage, index))
    .sort((a, b) => a.order - b.order)

  // 합계 계산
  // 우선순위: 항목 합산 → 노션 '총 금액' 필드로 total 보정
  const itemSubtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const notionTotal =
    props['총 금액']?.type === 'number'
      ? (props['총 금액'].number ?? null)
      : null

  let summary: InvoiceSummary
  if (notionTotal !== null && items.length === 0) {
    // 항목이 없고 총 금액만 있는 경우: 역산으로 소계/부가세 계산
    const subtotal = Math.round(notionTotal / 1.1)
    const tax = notionTotal - subtotal
    summary = { subtotal, tax, total: notionTotal }
  } else {
    // 항목 기반 계산 (일반 케이스)
    const subtotal = itemSubtotal
    const tax = calculateTax(subtotal)
    const total = notionTotal ?? subtotal + tax
    summary = { subtotal, tax, total }
  }

  // 결제 조건 및 특이사항
  const paymentTerms =
    extractRichText(
      props['결제 조건']?.type === 'rich_text'
        ? props['결제 조건'].rich_text
        : []
    ) || undefined
  const notes =
    extractRichText(
      props['특이사항']?.type === 'rich_text' ? props['특이사항'].rich_text : []
    ) || undefined

  return {
    id: page.id,
    invoiceNumber,
    title,
    status,
    issuedAt,
    expiresAt,
    issuer,
    client,
    items,
    summary,
    paymentTerms,
    notes,
  }
}
