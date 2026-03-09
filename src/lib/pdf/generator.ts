import type { Browser } from 'puppeteer-core'

/**
 * 주어진 URL의 웹 페이지를 A4 PDF로 변환합니다.
 * - Vercel 서버리스 환경: VERCEL 환경변수 감지 → @sparticuz/chromium 사용
 * - 로컬 개발 환경: 시스템 Chrome/Chromium 사용 (CHROMIUM_EXECUTABLE_PATH로 오버라이드 가능)
 */
export async function generatePdf(url: string): Promise<ArrayBuffer> {
  let browser: Browser | null = null

  try {
    const puppeteer = await import('puppeteer-core')

    let launchOptions: Parameters<typeof puppeteer.default.launch>[0]

    if (process.env.VERCEL) {
      // Vercel 서버리스 환경: 바이너리를 원격에서 다운로드 후 /tmp에 캐시
      // (chromium.br이 59MB로 Hobby 플랜 50MB 번들 제한 초과 → 번들 포함 불가)
      const chromium = await import('@sparticuz/chromium')
      const chromiumPackUrl =
        process.env.CHROMIUM_PACK_URL ??
        'https://github.com/Sparticuz/chromium/releases/download/v143.0.4/chromium-v143.0.4-pack.x64.tar'
      launchOptions = {
        args: chromium.default.args,
        executablePath: await chromium.default.executablePath(chromiumPackUrl),
        headless: true,
      }
    } else {
      // 로컬 개발 환경
      launchOptions = {
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
        executablePath: getLocalChromePath(),
        headless: true,
      }
    }

    browser = await puppeteer.default.launch(launchOptions)
    const page = await browser.newPage()

    // A4 너비(794px)에 맞게 뷰포트 설정
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 })

    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    })

    // 폰트가 완전히 로드·적용될 때까지 대기
    await page.evaluate(() => document.fonts.ready)

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
    })

    // 새 ArrayBuffer에 복사하여 반환 (SharedArrayBuffer 타입 충돌 방지)
    const arrayBuffer = new ArrayBuffer(pdf.byteLength)
    new Uint8Array(arrayBuffer).set(pdf)
    return arrayBuffer
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

/**
 * 로컬 환경의 Chrome/Chromium 실행 경로를 반환합니다.
 * CHROMIUM_EXECUTABLE_PATH 환경변수로 오버라이드 가능합니다.
 */
function getLocalChromePath(): string {
  if (process.env.CHROMIUM_EXECUTABLE_PATH) {
    return process.env.CHROMIUM_EXECUTABLE_PATH
  }

  const { platform } = process

  if (platform === 'darwin') {
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  }

  if (platform === 'win32') {
    return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  }

  // Linux (CI, Docker 등)
  return '/usr/bin/google-chrome'
}
