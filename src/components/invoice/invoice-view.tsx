import type { InvoiceData } from '@/lib/invoice/types'
import { isExpired } from '@/lib/invoice/formatters'
import { InvoiceExpiredBanner } from '@/components/invoice/invoice-expired-banner'
import { InvoiceHeader } from '@/components/invoice/invoice-header'
import { InvoiceInfo } from '@/components/invoice/invoice-info'
import { InvoiceItems } from '@/components/invoice/invoice-items'
import { InvoiceSummarySection } from '@/components/invoice/invoice-summary'
import { InvoiceFooter } from '@/components/invoice/invoice-footer'

interface InvoiceViewProps {
  invoice: InvoiceData
}

/**
 * 견적서 메인 뷰 컴포넌트 (Server Component)
 * 데스크톱: A4 비율(794px) 카드 형태 중앙 정렬
 * 모바일: 전체 너비, 스크롤 가능한 레이아웃
 */
export function InvoiceView({ invoice }: InvoiceViewProps) {
  const expired = isExpired(invoice.expiresAt)

  return (
    <main className="bg-muted/30 min-h-screen py-8 print:bg-white print:py-0">
      <article
        className="bg-card sm:border-border mx-auto w-full max-w-2xl space-y-7 px-6 py-10 shadow-sm sm:rounded-2xl sm:border sm:px-10 sm:py-12 print:shadow-none"
        aria-label="견적서"
      >
        {/* 만료 배너 (유효기간이 지난 경우만 표시) */}
        {expired && <InvoiceExpiredBanner expiresAt={invoice.expiresAt} />}

        {/* 헤더: 제목, 번호, 상태, 날짜 */}
        <InvoiceHeader
          invoice={{
            title: invoice.title,
            invoiceNumber: invoice.invoiceNumber,
            status: invoice.status,
            issuedAt: invoice.issuedAt,
            expiresAt: invoice.expiresAt,
          }}
        />

        {/* 발행자/고객 2단 정보 섹션 */}
        <InvoiceInfo issuer={invoice.issuer} client={invoice.client} />

        {/* 항목 테이블 */}
        <InvoiceItems items={invoice.items} />

        {/* 합계 섹션 */}
        <InvoiceSummarySection summary={invoice.summary} />

        {/* 하단 안내: 결제 조건, 특이사항, PDF 다운로드 */}
        <InvoiceFooter
          invoice={{
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            expiresAt: invoice.expiresAt,
            paymentTerms: invoice.paymentTerms,
            notes: invoice.notes,
            client: invoice.client,
          }}
        />
      </article>
    </main>
  )
}
