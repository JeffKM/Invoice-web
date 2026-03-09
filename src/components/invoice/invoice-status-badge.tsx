import type { InvoiceStatus } from '@/lib/invoice/types'
import { Badge } from '@/components/ui/badge'

/** 상태별 한국어 표시 및 색상 클래스 매핑 */
const STATUS_MAP: Record<InvoiceStatus, { label: string; className: string }> =
  {
    Draft: {
      label: '초안',
      className:
        'border-transparent bg-secondary text-secondary-foreground px-3 py-1 text-sm rounded-full',
    },
    Sent: {
      label: '발송됨',
      className:
        'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 px-3 py-1 text-sm rounded-full',
    },
    Approved: {
      label: '승인',
      className:
        'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300 px-3 py-1 text-sm rounded-full',
    },
    Rejected: {
      label: '거절',
      className:
        'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300 px-3 py-1 text-sm rounded-full',
    },
  }

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus
}

/**
 * 견적서 상태를 색상 뱃지로 표시하는 컴포넌트
 * 초안(회색) / 발송됨(파란색) / 승인(초록색) / 거절(빨간색)
 */
export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const { label, className } = STATUS_MAP[status]

  return (
    <Badge
      variant="outline"
      className={className}
      aria-label={`견적서 상태: ${label}`}
    >
      {label}
    </Badge>
  )
}
