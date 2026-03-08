import { type NextRequest, NextResponse } from 'next/server'
import { getInvoiceById } from '@/lib/notion/invoice'

/**
 * PDF 생성 API Route
 * GET /api/invoice/[id]/pdf
 *
 * TODO Phase 3: puppeteer + @sparticuz/chromium으로 실제 PDF 생성 구현
 * - Vercel 서버리스 환경에서 @sparticuz/chromium 필요
 * - Vercel 이슈 발생 시 @react-pdf/renderer로 대체 검토
 *
 * 현재: 플레이스홀더 구현 (견적서 데이터 조회까지만)
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    // 견적서 데이터 조회 (데이터 유효성 검증 겸)
    const invoice = await getInvoiceById(id)

    // TODO: puppeteer로 PDF 생성
    // const pdf = await generatePdfWithPuppeteer(id);
    // return new NextResponse(pdf, {
    //   headers: {
    //     'Content-Type': 'application/pdf',
    //     'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(`견적서_${invoice.invoiceNumber}_${invoice.client.companyName}.pdf`)}`,
    //   },
    // });

    // Phase 3 구현 전 임시 응답
    return NextResponse.json(
      {
        success: false,
        error: 'PDF 생성 기능은 Phase 3에서 구현 예정입니다.',
        invoiceNumber: invoice.invoiceNumber,
      },
      { status: 501 }
    )
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
