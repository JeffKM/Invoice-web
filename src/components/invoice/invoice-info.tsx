import type { Issuer, InvoiceClient } from '@/lib/invoice/types'
import { formatBusinessNumber } from '@/lib/invoice/formatters'

interface InvoiceInfoProps {
  issuer: Issuer
  client: InvoiceClient
}

/**
 * 발행자/고객 정보 섹션
 * 발행자 정보(좌측) / 고객사 정보(우측) 2단 레이아웃
 */
export function InvoiceInfo({ issuer, client }: InvoiceInfoProps) {
  return (
    <section aria-label="발행자 및 고객 정보">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* 발행자 정보 */}
        <div className="space-y-1">
          <h2 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
            발행자
          </h2>
          <p className="text-foreground font-semibold">{issuer.companyName}</p>
          <p className="text-foreground text-sm">{issuer.contactName}</p>
          <p className="text-muted-foreground text-sm">{issuer.email}</p>
          {issuer.phone && (
            <p className="text-muted-foreground text-sm">{issuer.phone}</p>
          )}
          {issuer.businessNumber && (
            <p className="text-muted-foreground text-sm">
              사업자번호: {formatBusinessNumber(issuer.businessNumber)}
            </p>
          )}
        </div>

        {/* 고객사 정보 */}
        <div className="space-y-1">
          <h2 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
            고객사
          </h2>
          <p className="text-foreground font-semibold">{client.companyName}</p>
          {client.contactName && (
            <p className="text-foreground text-sm">{client.contactName}</p>
          )}
          {client.email && (
            <p className="text-muted-foreground text-sm">{client.email}</p>
          )}
        </div>
      </div>
    </section>
  )
}
