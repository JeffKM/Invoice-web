/**
 * 구조화된 서버 사이드 로거
 * 개발: 상세 스택 트레이스 포함
 * 프로덕션: 민감 정보 제거, JSON 포맷 출력 (로그 수집 시스템 대응)
 */

type LogLevel = 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  context?: string
  error?: {
    name: string
    message: string
    stack?: string
  }
  timestamp: string
}

function formatEntry(entry: LogEntry): string {
  if (process.env.NODE_ENV === 'development') {
    const prefix = `[${entry.level.toUpperCase()}]${entry.context ? ` [${entry.context}]` : ''}`
    return `${prefix} ${entry.message}`
  }
  return JSON.stringify(entry)
}

export const logger = {
  info(message: string, context?: string) {
    const entry: LogEntry = {
      level: 'info',
      message,
      context,
      timestamp: new Date().toISOString(),
    }
    console.log(formatEntry(entry))
  },

  warn(message: string, context?: string) {
    const entry: LogEntry = {
      level: 'warn',
      message,
      context,
      timestamp: new Date().toISOString(),
    }
    console.warn(formatEntry(entry))
  },

  error(message: string, err?: unknown, context?: string) {
    const errorInfo =
      err instanceof Error
        ? {
            name: err.name,
            message: err.message,
            // 프로덕션에서는 스택 트레이스 제외
            stack:
              process.env.NODE_ENV === 'development' ? err.stack : undefined,
          }
        : undefined

    const entry: LogEntry = {
      level: 'error',
      message,
      context,
      error: errorInfo,
      timestamp: new Date().toISOString(),
    }
    console.error(formatEntry(entry))

    // 프로덕션에서 상세 에러 별도 출력 (스택 트레이스)
    if (
      process.env.NODE_ENV === 'development' &&
      err instanceof Error &&
      err.stack
    ) {
      console.error(err.stack)
    }
  },
}
