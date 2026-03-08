import { AlertTriangle } from 'lucide-react'
import { formatKoreanDate } from '@/lib/invoice/formatters'

interface InvoiceExpiredBannerProps {
  expiresAt: string
}

/**
 * 유효기간이 만료된 견적서에 표시하는 안내 배너
 * 견적서 내용 열람은 허용하되 만료 사실을 상단에 고지
 */
export function InvoiceExpiredBanner({ expiresAt }: InvoiceExpiredBannerProps) {
  return (
    <div
      className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
      role="alert"
      aria-label="견적서 만료 안내"
    >
      <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="text-sm font-medium">
        이 견적서는 {formatKoreanDate(expiresAt)}에 만료되었습니다. 최신 견적서
        발급을 요청해 주세요.
      </p>
    </div>
  )
}
