import { type NextRequest, NextResponse } from 'next/server'
import { getInvoiceById } from '@/lib/notion/invoice'
import { generatePdf } from '@/lib/pdf/generator'

/**
 * PDF 생성 API Route
 * GET /api/invoice/[id]/pdf
 *
 * 견적서 페이지를 puppeteer로 렌더링하여 A4 PDF를 생성합니다.
 * 파일명 형식: 견적서_[견적서번호]_[고객사명].pdf
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    // 견적서 데이터 조회 (존재 여부 검증 및 파일명 생성용)
    const invoice = await getInvoiceById(id)

    // 견적서 페이지 URL 구성 (현재 요청의 origin 기준)
    const invoiceUrl = `${request.nextUrl.origin}/invoice/${id}`

    // PDF 생성
    const pdfBuffer = await generatePdf(invoiceUrl)

    // 파일명 인코딩: RFC 5987 형식 (한글 포함)
    const fileName = `견적서_${invoice.invoiceNumber}_${invoice.client.companyName}.pdf`
    const encodedFileName = encodeURIComponent(fileName)

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodedFileName}`,
        'Content-Length': String(pdfBuffer.byteLength),
      },
    })
  } catch (error) {
    const isNotFound =
      error instanceof Error &&
      (error.message.includes('Could not find page') ||
        error.message.includes('object_not_found'))

    if (isNotFound) {
      return NextResponse.json(
        { success: false, error: '견적서를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    console.error('PDF 생성 API 오류:', error)
    return NextResponse.json(
      { success: false, error: 'PDF 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
