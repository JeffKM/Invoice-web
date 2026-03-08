import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getInvoiceById } from '@/lib/notion/invoice'
import { InvoiceView } from '@/components/invoice/invoice-view'

/** ISR: 60초마다 백그라운드 재검증 (노션 API rate limit 대응) */
export const revalidate = 60

/** 빌드 시 알 수 없는 ID를 런타임에 처리 */
export const dynamicParams = true

interface InvoicePageProps {
  params: Promise<{ id: string }>
}

/**
 * 견적서 페이지 메타데이터 생성
 * 검색엔진 인덱싱 차단 (robots: noindex)
 */
export async function generateMetadata({
  params,
}: InvoicePageProps): Promise<Metadata> {
  const { id } = await params

  try {
    const invoice = await getInvoiceById(id)
    return {
      title: `${invoice.invoiceNumber} - ${invoice.title}`,
      description: `${invoice.client.companyName} 견적서`,
      robots: {
        index: false,
        follow: false,
      },
    }
  } catch {
    return {
      title: '견적서를 찾을 수 없습니다',
      robots: {
        index: false,
        follow: false,
      },
    }
  }
}

/**
 * 견적서 웹 뷰어 페이지 (Server Component, ISR revalidate=60)
 * URL: /invoice/[id] (노션 페이지 UUID 기반)
 */
export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params

  try {
    const invoice = await getInvoiceById(id)
    return <InvoiceView invoice={invoice} />
  } catch (error) {
    // 노션에서 해당 페이지가 없거나 접근 불가능한 경우 404 처리
    const isNotFound =
      error instanceof Error &&
      (error.message.includes('Could not find page') ||
        error.message.includes('object_not_found') ||
        error.message.includes('unauthorized'))

    if (isNotFound) {
      notFound()
    }

    // 그 외 에러는 error.tsx에서 처리
    throw error
  }
}
