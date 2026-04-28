export const dynamic = 'force-dynamic'

import { RotateCcw } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils/format'

const RETURNS = [
  { id: 'SX26040050', customer: 'Deniz Y.', product: 'Velvet Noir Sütyen 75B', reason: 'Beden uyumsuzluğu', total: 1290, date: '2026-04-20', status: 'pending' as const },
  { id: 'SX26040031', customer: 'Hande K.', product: 'Ivory Reverie Takım S',   reason: 'Hasar',             total: 2190, date: '2026-04-18', status: 'approved'as const },
]

const S: Record<string, { label: string; cls: string }> = {
  pending:  { label: 'İnceleniyor', cls: 'bg-gold/20 text-gold-dark' },
  approved: { label: 'Onaylandı',   cls: 'bg-scarlet/10 text-scarlet' },
  rejected: { label: 'Reddedildi',  cls: 'bg-pebble/20 text-pebble' },
  refunded: { label: 'İade Edildi', cls: 'bg-green-50 text-green-700' },
}

export default function IadelerPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-serif text-3xl text-charcoal">İadeler & Değişimler</h1>
        <p className="text-sm font-light text-stone mt-1">{RETURNS.length} aktif talep</p>
      </div>

      {RETURNS.length === 0 ? (
        <div className="bg-warm-white border border-border p-16 text-center space-y-3">
          <RotateCcw size={32} strokeWidth={1} className="text-linen mx-auto" />
          <p className="font-serif text-xl text-charcoal">İade Talebi Yok</p>
        </div>
      ) : (
        <div className="bg-warm-white border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-cream">
                {['Sipariş No', 'Müşteri', 'Ürün', 'Neden', 'Tutar', 'Durum', 'Tarih', 'İşlem'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-sans font-medium tracking-widest uppercase text-stone first:pl-6 last:text-right last:pr-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {RETURNS.map(r => {
                const s = S[r.status]
                return (
                  <tr key={r.id} className="hover:bg-cream/40 transition-colors">
                    <td className="px-6 py-4 font-sans font-medium text-charcoal">{r.id}</td>
                    <td className="px-5 py-4 font-light text-charcoal">{r.customer}</td>
                    <td className="px-5 py-4 font-light text-charcoal text-xs">{r.product}</td>
                    <td className="px-5 py-4 font-light text-stone text-xs">{r.reason}</td>
                    <td className="px-5 py-4 font-sans font-medium text-charcoal">{formatPrice(r.total)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 text-[10px] font-sans font-medium tracking-widest uppercase ${s.cls}`}>{s.label}</span>
                    </td>
                    <td className="px-5 py-4 text-xs font-light text-stone">{formatDate(r.date)}</td>
                    <td className="px-6 py-4 text-right">
                      {r.status === 'pending' && (
                        <div className="flex gap-2 justify-end">
                          <button className="text-[11px] font-sans font-medium tracking-widest uppercase text-charcoal border border-charcoal px-3 py-1.5 hover:bg-charcoal hover:text-ivory transition-colors">Onayla</button>
                          <button className="text-[11px] font-sans font-medium tracking-widest uppercase text-pebble border border-pebble px-3 py-1.5 hover:bg-pebble hover:text-ivory transition-colors">Reddet</button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* FAZ 4.12 — Hediye notu görünümü */}
      <div className="bg-warm-white border border-border p-6 space-y-3">
        <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-stone pb-3 border-b border-border">
          Bekleyen Hediye Paketleme Talepleri
        </h2>
        <div className="text-center py-6 text-sm font-light text-stone">
          Bekleyen hediye paketleme talebi yok.
        </div>
      </div>
    </div>
  )
}
