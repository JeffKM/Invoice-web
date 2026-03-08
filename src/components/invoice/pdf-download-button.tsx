'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface PdfDownloadButtonProps {
  invoiceId: string
  invoiceNumber: string
  clientName: string
}

/**
 * PDF 다운로드 버튼 (Client Component)
 * /api/invoice/[id]/pdf API Route 호출
 * 로딩 상태 표시 및 오류 시 sonner 토스트 알림
 */
export function PdfDownloadButton({
  invoiceId,
  invoiceNumber,
  clientName,
}: PdfDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/invoice/${invoiceId}/pdf`)

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as {
          error?: string
        } | null
        throw new Error(errorData?.error ?? 'PDF 생성에 실패했습니다.')
      }

      // Blob으로 변환 후 다운로드
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const fileName = `견적서_${invoiceNumber}_${clientName}.pdf`

      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = fileName
      anchor.click()

      URL.revokeObjectURL(url)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'PDF 다운로드 중 오류가 발생했습니다.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      aria-label="PDF 파일 다운로드"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          PDF 생성 중...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" aria-hidden="true" />
          PDF 다운로드
        </>
      )}
    </Button>
  )
}
