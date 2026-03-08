'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface InvoiceErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * 견적서 에러 바운더리 (Client Component)
 * 노션 API 오류 등 예기치 않은 에러 발생 시 표시
 */
export default function InvoiceError({ error, reset }: InvoiceErrorProps) {
  useEffect(() => {
    // 에러 로깅 (운영 환경에서 에러 추적 서비스로 전송)
    console.error('견적서 페이지 오류:', error)
  }, [error])

  return (
    <main className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <AlertCircle
          className="text-destructive h-16 w-16"
          aria-hidden="true"
        />
        <div className="space-y-2">
          <h1 className="text-foreground text-2xl font-bold">
            오류가 발생했습니다
          </h1>
          <p className="text-muted-foreground">
            견적서를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해
            주세요.
          </p>
          {error.digest && (
            <p className="text-muted-foreground/70 text-xs">
              오류 코드: {error.digest}
            </p>
          )}
        </div>
        <Button onClick={reset} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          다시 시도
        </Button>
      </div>
    </main>
  )
}
