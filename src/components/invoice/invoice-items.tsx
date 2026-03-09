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
      <h2 className="text-muted-foreground mb-5 text-sm font-semibold tracking-wider uppercase">
        견적 항목
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-sm">
          <thead>
            <tr className="border-border border-b">
              <th className="text-muted-foreground px-2 py-3.5 text-left font-semibold whitespace-nowrap first:px-0 last:px-0">
                No.
              </th>
              <th className="text-muted-foreground px-2 py-3.5 text-left font-semibold first:px-0 last:px-0">
                항목명
              </th>
              <th className="text-muted-foreground px-2 py-3.5 text-right font-semibold whitespace-nowrap first:px-0 last:px-0">
                수량
              </th>
              <th className="text-muted-foreground px-2 py-3.5 text-right font-semibold whitespace-nowrap first:px-0 last:px-0">
                단가
              </th>
              <th className="text-muted-foreground px-2 py-3.5 text-right font-semibold whitespace-nowrap first:px-0 last:px-0">
                금액
              </th>
              <th className="text-muted-foreground px-2 py-3.5 text-left font-semibold first:px-0 last:px-0">
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
                <td className="text-muted-foreground px-2 py-4 whitespace-nowrap first:px-0 last:px-0">
                  {index + 1}
                </td>
                <td className="text-foreground px-2 py-4 font-medium first:px-0 last:px-0">
                  {item.name}
                </td>
                <td className="text-foreground px-2 py-4 text-right whitespace-nowrap tabular-nums first:px-0 last:px-0">
                  {item.quantity.toLocaleString('ko-KR')}
                </td>
                <td className="text-foreground px-2 py-4 text-right whitespace-nowrap tabular-nums first:px-0 last:px-0">
                  {formatKRW(item.unitPrice)}
                </td>
                <td className="text-foreground px-2 py-4 text-right font-semibold whitespace-nowrap tabular-nums first:px-0 last:px-0">
                  {formatKRW(item.amount)}
                </td>
                <td className="text-muted-foreground px-2 py-4 first:px-0 last:px-0">
                  {item.note ?? ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
