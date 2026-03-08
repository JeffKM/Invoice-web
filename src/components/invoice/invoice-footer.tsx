import type { InvoiceData } from '@/lib/invoice/types'
import { formatKoreanDate } from '@/lib/invoice/formatters'
import { PdfDownloadButton } from '@/components/invoice/pdf-download-button'

interface InvoiceFooterProps {
  invoice: Pick<
    InvoiceData,
    'id' | 'invoiceNumber' | 'expiresAt' | 'paymentTerms' | 'notes' | 'client'
  >
}

/**
 * 견적서 하단 안내 섹션
 * 결제 조건, 유효기간 안내, 특이사항, PDF 다운로드 버튼
 */
export function InvoiceFooter({ invoice }: InvoiceFooterProps) {
  const { id, invoiceNumber, expiresAt, paymentTerms, notes, client } = invoice

  return (
    <footer className="border-border space-y-4 border-t pt-6">
      {/* 안내 사항 */}
      <div className="space-y-3 text-sm">
        {paymentTerms && (
          <div>
            <p className="text-foreground font-semibold">결제 조건</p>
            <p className="text-muted-foreground mt-1 whitespace-pre-wrap">
              {paymentTerms}
            </p>
          </div>
        )}
        <div>
          <p className="text-foreground font-semibold">유효기간 안내</p>
          <p className="text-muted-foreground mt-1">
            본 견적서는 {formatKoreanDate(expiresAt)}까지 유효합니다. 이후에는
            별도 문의 부탁드립니다.
          </p>
        </div>
        {notes && (
          <div>
            <p className="text-foreground font-semibold">특이사항</p>
            <p className="text-muted-foreground mt-1 whitespace-pre-wrap">
              {notes}
            </p>
          </div>
        )}
      </div>

      {/* PDF 다운로드 버튼 - 인쇄 시 숨김 처리 */}
      <div className="flex justify-end print:hidden">
        <PdfDownloadButton
          invoiceId={id}
          invoiceNumber={invoiceNumber}
          clientName={client.companyName}
        />
      </div>
    </footer>
  )
}
