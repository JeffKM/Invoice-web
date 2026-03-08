import type { InvoiceItem } from '@/lib/invoice/types'
import { formatKRW } from '@/lib/invoice/formatters'

interface InvoiceItemsProps {
  items: InvoiceItem[]
}

/**
 * 견적 항목 테이블 섹션
 * 번호, 항목명, 수량, 단가, 금액, 비고 컬럼
 */
export function InvoiceItems({ items }: InvoiceItemsProps) {
  return (
    <section aria-label="견적 항목 목록">
      <h2 className="text-muted-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
        견적 항목
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border border-b">
              <th className="text-muted-foreground py-3 text-left font-semibold">
                No.
              </th>
              <th className="text-muted-foreground py-3 text-left font-semibold">
                항목명
              </th>
              <th className="text-muted-foreground py-3 text-right font-semibold">
                수량
              </th>
              <th className="text-muted-foreground py-3 text-right font-semibold">
                단가
              </th>
              <th className="text-muted-foreground py-3 text-right font-semibold">
                금액
              </th>
              <th className="text-muted-foreground py-3 text-left font-semibold">
                비고
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.id}
                className="border-border/50 border-b last:border-0"
              >
                <td className="text-muted-foreground py-3">{index + 1}</td>
                <td className="text-foreground py-3 font-medium">
                  {item.name}
                </td>
                <td className="text-foreground py-3 text-right tabular-nums">
                  {item.quantity.toLocaleString('ko-KR')}
                </td>
                <td className="text-foreground py-3 text-right tabular-nums">
                  {formatKRW(item.unitPrice)}
                </td>
                <td className="text-foreground py-3 text-right font-semibold tabular-nums">
                  {formatKRW(item.amount)}
                </td>
                <td className="text-muted-foreground py-3">
                  {item.note ?? '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
