import { notion } from '@/lib/notion/client'
import type {
  NotionInvoicePage,
  NotionInvoiceItemPage,
} from '@/lib/notion/types'
import { transformNotionToInvoice } from '@/lib/invoice/transformer'
import type { InvoiceData } from '@/lib/invoice/types'

/**
 * 노션 페이지 ID로 견적서 메인 데이터 조회
 * @param pageId 노션 페이지 UUID
 * @throws 페이지가 없거나 접근 불가능한 경우 에러
 */
export async function getInvoicePage(
  pageId: string
): Promise<NotionInvoicePage> {
  const page = await notion.pages.retrieve({ page_id: pageId })
  return page as unknown as NotionInvoicePage
}

/**
 * 특정 견적서에 연결된 항목 목록 조회
 * @notionhq/client v5에서 databases.query가 제거되어 fetch로 직접 호출
 *
 * @param invoicePageId 견적서 노션 페이지 ID
 */
export async function getInvoiceItems(
  invoicePageId: string
): Promise<NotionInvoiceItemPage[]> {
  const dbId = process.env.NOTION_ITEMS_DB_ID!
  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: {
        property: 'Invoices',
        relation: { contains: invoicePageId },
      },
    }),
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message ?? 'Items DB 조회 실패')
  }

  const data = await res.json()
  return data.results as NotionInvoiceItemPage[]
}

/**
 * 견적서 ID로 전체 견적서 데이터 조회 및 도메인 모델 반환
 * 노션 페이지 + 항목 목록을 병렬로 조회 후 변환
 * @param id 노션 페이지 UUID (URL 파라미터)
 * @returns InvoiceData 도메인 모델
 * @throws 페이지 없음, API 오류 등
 */
export async function getInvoiceById(id: string): Promise<InvoiceData> {
  // 견적서 메인 페이지와 항목 목록을 병렬 조회
  const [page, items] = await Promise.all([
    getInvoicePage(id),
    getInvoiceItems(id),
  ])

  // 도메인 모델로 변환
  return transformNotionToInvoice(page, items)
}
