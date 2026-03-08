import { z } from 'zod'

/**
 * 서버 전용 환경변수 검증 스키마
 * 주의: NEXT_PUBLIC_ 접두사 변수는 절대 추가하지 않는다 (클라이언트에 노출 금지)
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  // 노션 API 키 (notion.so/my-integrations에서 발급)
  NOTION_API_KEY: z.string().min(1, 'NOTION_API_KEY가 설정되지 않았습니다'),
  // 견적서 메인 DB ID (32자리 hex)
  NOTION_INVOICES_DB_ID: z
    .string()
    .min(1, 'NOTION_INVOICES_DB_ID가 설정되지 않았습니다'),
  // 견적 항목 DB ID (32자리 hex)
  NOTION_ITEMS_DB_ID: z
    .string()
    .min(1, 'NOTION_ITEMS_DB_ID가 설정되지 않았습니다'),
})

/**
 * 환경변수 파싱 (빌드 시 유효성 검사)
 * 필수 환경변수 누락 시 명확한 에러 메시지 출력
 */
export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_INVOICES_DB_ID: process.env.NOTION_INVOICES_DB_ID,
  NOTION_ITEMS_DB_ID: process.env.NOTION_ITEMS_DB_ID,
})

export type Env = z.infer<typeof envSchema>
