/**
 * Notion API 응답 타입 정의
 * @notionhq/client의 타입을 기반으로 프로젝트에서 사용하는 필드만 정의
 */

/** Notion Rich Text 항목 */
export interface NotionRichTextItem {
  plain_text: string
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: string
  }
  type: 'text' | 'mention' | 'equation'
}

/** Notion 속성 공통 타입 */
type NotionPropertyBase = {
  id: string
}

/** Notion Title 속성 */
type NotionTitleProperty = NotionPropertyBase & {
  type: 'title'
  title: NotionRichTextItem[]
}

/** Notion Rich Text 속성 */
type NotionRichTextProperty = NotionPropertyBase & {
  type: 'rich_text'
  rich_text: NotionRichTextItem[]
}

/** Notion Select 속성 */
type NotionSelectProperty = NotionPropertyBase & {
  type: 'select'
  select: { id: string; name: string; color: string } | null
}

/** Notion Status 속성 (워크플로우 상태 - Draft/Sent/Approved/Rejected) */
type NotionStatusProperty = NotionPropertyBase & {
  type: 'status'
  status: { id: string; name: string; color: string } | null
}

/** Notion Date 속성 */
type NotionDateProperty = NotionPropertyBase & {
  type: 'date'
  date: { start: string; end: string | null; time_zone: string | null } | null
}

/** Notion Number 속성 */
type NotionNumberProperty = NotionPropertyBase & {
  type: 'number'
  number: number | null
}

/** Notion Email 속성 */
type NotionEmailProperty = NotionPropertyBase & {
  type: 'email'
  email: string | null
}

/** Notion Phone Number 속성 */
type NotionPhoneNumberProperty = NotionPropertyBase & {
  type: 'phone_number'
  phone_number: string | null
}

/** Notion Formula 속성 (숫자 결과) */
type NotionFormulaNumberProperty = NotionPropertyBase & {
  type: 'formula'
  formula:
    | { type: 'number'; number: number | null }
    | { type: 'string'; string: string | null }
    | { type: 'boolean'; boolean: boolean | null }
    | { type: 'date'; date: { start: string } | null }
}

/** Notion Relation 속성 */
type NotionRelationProperty = NotionPropertyBase & {
  type: 'relation'
  relation: Array<{ id: string }>
  has_more: boolean
}

/** Notion 속성 유니온 타입 */
type NotionProperty =
  | NotionTitleProperty
  | NotionRichTextProperty
  | NotionSelectProperty
  | NotionStatusProperty
  | NotionDateProperty
  | NotionNumberProperty
  | NotionEmailProperty
  | NotionPhoneNumberProperty
  | NotionFormulaNumberProperty
  | NotionRelationProperty

/**
 * 노션 견적서 메인 DB 페이지 타입
 * 실제 Invoices DB 속성 구조 반영
 *
 * 필수 속성 (항상 존재):
 *   - 견적서 번호: title (페이지 제목)
 *   - 발행일: date
 *   - 유효기간: date
 *   - 클라이언트명: rich_text
 *   - 상태: status
 *   - 총 금액: number
 *
 * 선택 속성 (Notion에 추가 후 채움):
 *   - 발행자/고객 정보, 결제 조건, 특이사항
 */
export interface NotionInvoicePage {
  id: string
  object: 'page'
  created_time: string
  last_edited_time: string
  properties: {
    // 필수: 견적서 번호 (title 타입 — Notion 페이지 제목)
    '견적서 번호'?: NotionTitleProperty
    // 필수: 날짜
    발행일?: NotionDateProperty
    유효기간?: NotionDateProperty
    // 필수: 클라이언트
    클라이언트명?: NotionRichTextProperty
    // 필수: 상태 (status 타입: Draft / Sent / Approved / Rejected)
    상태?: NotionStatusProperty
    // 필수: 합계
    '총 금액'?: NotionNumberProperty
    // 선택: 발행자 정보
    '발행자 회사명'?: NotionRichTextProperty
    '발행자 담당자'?: NotionRichTextProperty
    '발행자 이메일'?: NotionEmailProperty
    '발행자 전화번호'?: NotionPhoneNumberProperty
    사업자번호?: NotionRichTextProperty
    // 선택: 고객 추가 정보
    '고객 담당자'?: NotionRichTextProperty
    '고객 이메일'?: NotionEmailProperty
    // 선택: 결제 조건 / 특이사항
    '결제 조건'?: NotionRichTextProperty
    특이사항?: NotionRichTextProperty
    [key: string]: NotionProperty | undefined
  }
}

/**
 * 노션 견적 항목 DB 페이지 타입
 * 실제 Items DB 속성 구조 반영
 */
export interface NotionInvoiceItemPage {
  id: string
  object: 'page'
  created_time: string
  last_edited_time: string
  properties: {
    항목명?: NotionTitleProperty
    수량?: NotionNumberProperty
    단가?: NotionNumberProperty
    금액?: NotionFormulaNumberProperty
    비고?: NotionRichTextProperty
    '정렬 순서'?: NotionNumberProperty
    Invoices?: NotionRelationProperty
    [key: string]: NotionProperty | undefined
  }
}
