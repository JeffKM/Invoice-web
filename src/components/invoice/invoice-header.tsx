import type { InvoiceData } from '@/lib/invoice/types'
import { InvoiceStatusBadge } from '@/components/invoice/invoice-status-badge'
import { formatKoreanDate } from '@/lib/invoice/formatters'

interface InvoiceHeaderProps {
  invoice: Pick<
    InvoiceData,
    'title' | 'invoiceNumber' | 'status' | 'issuedAt' | 'expiresAt'
  >
}

/**
 * 견적서 헤더 섹션
 * 견적서 제목, 번호, 상태 뱃지, 발행일/유효기간 표시
 */
export function InvoiceHeader({ invoice }: InvoiceHeaderProps) {
  const { title, invoiceNumber, status, issuedAt, expiresAt } = invoice

  return (
    <header className="border-border border-b pb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-foreground text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground text-sm">
            견적서 번호:{' '}
            <span className="text-foreground font-mono font-semibold">
              {invoiceNumber}
            </span>
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <InvoiceStatusBadge status={status} />
        </div>
      </div>
      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="text-muted-foreground">발행일</dt>
          <dd className="text-foreground font-medium">
            {formatKoreanDate(issuedAt)}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted-foreground">유효기간</dt>
          <dd className="text-foreground font-medium">
            {formatKoreanDate(expiresAt)}
          </dd>
        </div>
      </dl>
    </header>
  )
}
