import type { InvoiceStatus } from '@/lib/invoice/types'

/** 상태별 한국어 표시 및 색상 클래스 매핑 */
const STATUS_MAP: Record<InvoiceStatus, { label: string; className: string }> =
  {
    Draft: {
      label: '초안',
      className:
        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    },
    Sent: {
      label: '발송됨',
      className:
        'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    },
    Approved: {
      label: '승인',
      className:
        'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    },
    Rejected: {
      label: '거절',
      className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
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
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${className}`}
      aria-label={`견적서 상태: ${label}`}
    >
      {label}
    </span>
  )
}
