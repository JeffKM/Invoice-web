import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { InvoiceView } from '@/components/invoice/invoice-view'
import { getMockInvoiceById } from '@/lib/invoice/mock-data'

/** 데모 페이지 메타데이터 - 검색 엔진 색인 제외 */
export const metadata: Metadata = {
  title: '견적서 데모',
  robots: {
    index: false,
    follow: false,
  },
}

interface DemoPageProps {
  searchParams: Promise<{ id?: string }>
}

/**
 * 견적서 데모 페이지 (Server Component)
 * searchParams.id로 특정 mock 데이터 선택 가능 (기본값: mock-sent-001)
 * - /invoice/demo                     → Sent 상태 (기본)
 * - /invoice/demo?id=mock-draft-001   → Draft 상태
 * - /invoice/demo?id=mock-approved-001 → Approved 상태
 * - /invoice/demo?id=mock-rejected-001 → Rejected 상태
 * - /invoice/demo?id=mock-expired-001 → 만료 배너
 */
export default async function InvoiceDemoPage({ searchParams }: DemoPageProps) {
  const { id } = await searchParams
  const invoice = getMockInvoiceById(id ?? 'mock-sent-001')

  // 데이터가 없는 경우 404 처리
  if (!invoice) {
    notFound()
  }

  return <InvoiceView invoice={invoice} />
}
