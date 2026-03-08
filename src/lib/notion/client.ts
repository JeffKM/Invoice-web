import { Client } from '@notionhq/client'

/**
 * Notion API 클라이언트 싱글톤
 * 서버 전용 모듈 - 클라이언트 컴포넌트에서 임포트 금지
 */
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export { notion }
