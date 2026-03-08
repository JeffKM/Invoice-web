import Link from 'next/link'
import { FileSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * 견적서 404 페이지
 * 존재하지 않는 견적서 ID 접근 시 표시
 */
export default function InvoiceNotFound() {
  return (
    <main className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <FileSearch
          className="text-muted-foreground h-16 w-16"
          aria-hidden="true"
        />
        <div className="space-y-2">
          <h1 className="text-foreground text-2xl font-bold">
            견적서를 찾을 수 없습니다
          </h1>
          <p className="text-muted-foreground">
            요청하신 견적서가 존재하지 않거나 접근 권한이 없습니다. URL을 다시
            확인하거나 견적서 발행자에게 문의해 주세요.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </main>
  )
}
