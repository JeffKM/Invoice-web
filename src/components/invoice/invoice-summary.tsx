import type { InvoiceSummary } from '@/lib/invoice/types'
import { formatKRW } from '@/lib/invoice/formatters'

interface InvoiceSummaryProps {
  summary: InvoiceSummary
}

/**
 * 견적서 합계 섹션
 * 소계, 부가세(10%), 총액을 우측 정렬로 표시
 */
export function InvoiceSummarySection({ summary }: InvoiceSummaryProps) {
  const { subtotal, tax, total } = summary

  return (
    <section aria-label="견적서 합계">
      <div className="flex justify-end">
        <dl className="w-full max-w-xs space-y-2">
          <div className="flex justify-between text-sm">
            <dt className="text-muted-foreground">소계</dt>
            <dd className="text-foreground font-medium tabular-nums">
              {formatKRW(subtotal)}
            </dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-muted-foreground">부가세 (10%)</dt>
            <dd className="text-foreground font-medium tabular-nums">
              {formatKRW(tax)}
            </dd>
          </div>
          <div className="border-border flex justify-between border-t pt-2 text-base font-bold">
            <dt className="text-foreground">총액</dt>
            <dd className="text-foreground tabular-nums">{formatKRW(total)}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
