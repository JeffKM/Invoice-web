import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Users, Activity, ArrowRight, Clock } from 'lucide-react'
import { getAllInvoices } from '@/lib/notion/invoice'
import { logger } from '@/lib/logger'
import type { InvoiceListItem, InvoiceStatus } from '@/lib/invoice/types'

export const metadata: Metadata = {
  title: '대시보드',
}

export const revalidate = 60

/** 상태별 한국어 라벨 */
const STATUS_LABEL: Record<InvoiceStatus, string> = {
  Draft: '초안',
  Sent: '발송',
  Approved: '승인',
  Rejected: '반려',
}

/** 상태별 뱃지 색상 */
const STATUS_COLOR: Record<InvoiceStatus, string> = {
  Draft: 'bg-muted text-muted-foreground',
  Sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  Approved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  Rejected: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

/** 금액 포맷 */
function formatAmount(amount: number) {
  return amount.toLocaleString('ko-KR') + '원'
}

/** 날짜 포맷 */
function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * 관리자 대시보드 페이지 (Server Component)
 * 견적서 관리 / 클라이언트 관리 / 최근 활동 3개 섹션으로 구성
 */
export default async function AdminDashboardPage() {
  let invoices: InvoiceListItem[] = []

  try {
    invoices = await getAllInvoices()
  } catch (error) {
    logger.error('대시보드 데이터 조회 오류', error, 'admin/dashboard')
  }

  // ── 견적서 통계 ─────────────────────────────────────
  const statusCounts = invoices.reduce(
    (acc, inv) => {
      acc[inv.status] = (acc[inv.status] ?? 0) + 1
      return acc
    },
    {} as Record<InvoiceStatus, number>
  )
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0)

  // ── 클라이언트 통계 ──────────────────────────────────
  const clientMap = invoices.reduce(
    (acc, inv) => {
      if (!inv.clientName) return acc
      if (!acc[inv.clientName]) {
        acc[inv.clientName] = { count: 0, total: 0, latest: '' }
      }
      acc[inv.clientName].count += 1
      acc[inv.clientName].total += inv.total
      if (
        !acc[inv.clientName].latest ||
        inv.issuedAt > acc[inv.clientName].latest
      ) {
        acc[inv.clientName].latest = inv.issuedAt
      }
      return acc
    },
    {} as Record<string, { count: number; total: number; latest: string }>
  )
  const clients = Object.entries(clientMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)

  // ── 최근 활동 (최신 5건) ─────────────────────────────
  const recentInvoices = invoices.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Invoice 관리자 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* ── 섹션 1: 견적서 관리 ──────────────────────────── */}
      <section aria-labelledby="invoice-section-title">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="text-primary h-5 w-5" aria-hidden="true" />
            <h2 id="invoice-section-title" className="text-lg font-semibold">
              견적서 관리
            </h2>
          </div>
          <Link
            href="/admin/invoices"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
          >
            전체 보기
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <p className="text-muted-foreground mb-4 text-sm">
          발행한 모든 견적서를 확인하고 관리할 수 있습니다.
        </p>

        {/* 통계 카드 그리드 */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {/* 전체 */}
          <div className="bg-card border-border rounded-xl border p-4">
            <p className="text-muted-foreground text-xs font-medium">전체</p>
            <p className="mt-1 text-2xl font-bold">{invoices.length}건</p>
            <p className="text-muted-foreground mt-1 text-xs">
              {formatAmount(totalAmount)}
            </p>
          </div>

          {/* 상태별 */}
          {(['Draft', 'Sent', 'Approved', 'Rejected'] as InvoiceStatus[]).map(
            status => (
              <div
                key={status}
                className="bg-card border-border rounded-xl border p-4"
              >
                <p className="text-muted-foreground text-xs font-medium">
                  {STATUS_LABEL[status]}
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {statusCounts[status] ?? 0}건
                </p>
                <p className="mt-2">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[status]}`}
                  >
                    {STATUS_LABEL[status]}
                  </span>
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* ── 섹션 2: 클라이언트 관리 ─────────────────────── */}
      <section aria-labelledby="client-section-title">
        <div className="mb-4 flex items-center gap-2">
          <Users className="text-primary h-5 w-5" aria-hidden="true" />
          <h2 id="client-section-title" className="text-lg font-semibold">
            클라이언트 관리
          </h2>
        </div>

        <p className="text-muted-foreground mb-4 text-sm">
          클라이언트 정보를 확인하고 관리할 수 있습니다.
        </p>

        <div className="bg-card border-border rounded-xl border">
          {clients.length === 0 ? (
            <div className="text-muted-foreground p-8 text-center text-sm">
              등록된 클라이언트가 없습니다.
            </div>
          ) : (
            <ul className="divide-border divide-y">
              {clients.map(([name, info]) => (
                <li
                  key={name}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div>
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      견적서 {info.count}건 · 마지막 발행{' '}
                      {formatDate(info.latest)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {formatAmount(info.total)}
                    </p>
                    <p className="text-muted-foreground text-xs">누적 금액</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {clients.length > 0 && (
            <div className="border-border border-t px-5 py-3 text-right">
              <span className="text-muted-foreground text-xs">
                총 {Object.keys(clientMap).length}개 클라이언트
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ── 섹션 3: 최근 활동 ──────────────────────────── */}
      <section aria-labelledby="activity-section-title">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="text-primary h-5 w-5" aria-hidden="true" />
            <h2 id="activity-section-title" className="text-lg font-semibold">
              최근 활동
            </h2>
          </div>
          <Link
            href="/admin/invoices"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
          >
            전체 보기
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <p className="text-muted-foreground mb-4 text-sm">
          최근 견적서 발행 및 승인 현황을 확인할 수 있습니다.
        </p>

        <div className="bg-card border-border rounded-xl border">
          {recentInvoices.length === 0 ? (
            <div className="text-muted-foreground p-8 text-center text-sm">
              최근 활동이 없습니다.
            </div>
          ) : (
            <ul className="divide-border divide-y">
              {recentInvoices.map(inv => (
                <li
                  key={inv.id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <Clock
                      className="text-muted-foreground h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-medium">{inv.invoiceNumber}</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {inv.clientName} · {formatDate(inv.issuedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOR[inv.status]}`}
                    >
                      {STATUS_LABEL[inv.status]}
                    </span>
                    <p className="text-sm font-semibold">
                      {formatAmount(inv.total)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
