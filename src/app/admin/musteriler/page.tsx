import { Users } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils/format'
import type { CustomerTier } from '@/types'

const CUSTOMERS = [
  { id: '1', name: 'Ayşe Kaya',    email: 'ayse@mail.com',   tier: 'scarlet_elite' as CustomerTier, totalSpent: 38900, orders: 12, lastOrder: '2026-04-25' },
  { id: '2', name: 'Zeynep Mert',  email: 'zeynep@mail.com', tier: 'platinum'      as CustomerTier, totalSpent: 18200, orders: 6,  lastOrder: '2026-04-24' },
  { id: '3', name: 'Elif Baran',   email: 'elif@mail.com',   tier: 'gold'          as CustomerTier, totalSpent: 8900,  orders: 3,  lastOrder: '2026-04-22' },
  { id: '4', name: 'Selin Aydın',  email: 'selin@mail.com',  tier: 'standard'      as CustomerTier, totalSpent: 2190,  orders: 1,  lastOrder: '2026-04-20' },
  { id: '5', name: 'Canan Taşkın', email: 'canan@mail.com',  tier: 'gold'          as CustomerTier, totalSpent: 7890,  orders: 2,  lastOrder: '2026-04-23' },
]

const TIER_MAP: Record<CustomerTier, { label: string; cls: string }> = {
  standard:      { label: 'Standard',       cls: 'bg-stone/15 text-stone' },
  gold:          { label: 'Gold',           cls: 'bg-gold/25 text-gold-dark' },
  platinum:      { label: 'Platinum',       cls: 'bg-charcoal/15 text-charcoal' },
  scarlet_elite: { label: 'Scarlet Elite',  cls: 'bg-scarlet/15 text-scarlet' },
}

export default function MusterilerPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-serif text-3xl text-charcoal">Müşteriler</h1>
        <p className="text-sm font-light text-stone mt-1">{CUSTOMERS.length} müşteri</p>
      </div>

      {/* Tier özeti */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(Object.entries(TIER_MAP) as [CustomerTier, typeof TIER_MAP[CustomerTier]][]).map(([tier, { label, cls }]) => {
          const count = CUSTOMERS.filter(c => c.tier === tier).length
          return (
            <div key={tier} className="bg-warm-white border border-border p-4 space-y-1">
              <span className={`inline-block px-2 py-0.5 text-[10px] font-sans font-medium tracking-widest uppercase ${cls}`}>{label}</span>
              <p className="font-serif text-3xl text-charcoal">{count}</p>
            </div>
          )
        })}
      </div>

      {/* Tablo */}
      <div className="bg-warm-white border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-cream">
              {['Müşteri', 'E-posta', 'VIP Tier', 'Toplam Harcama', 'Sipariş', 'Son Sipariş'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-sans font-medium tracking-widest uppercase text-stone first:pl-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {CUSTOMERS.map(c => {
              const t = TIER_MAP[c.tier]
              return (
                <tr key={c.id} className="hover:bg-cream/40 transition-colors">
                  <td className="px-6 py-4 font-sans font-medium text-charcoal">{c.name}</td>
                  <td className="px-5 py-4 font-light text-stone text-xs">{c.email}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 text-[10px] font-sans font-medium tracking-widest uppercase ${t.cls}`}>{t.label}</span>
                  </td>
                  <td className="px-5 py-4 font-sans font-medium text-charcoal">{formatPrice(c.totalSpent)}</td>
                  <td className="px-5 py-4 font-light text-charcoal">{c.orders}</td>
                  <td className="px-5 py-4 text-xs font-light text-stone">{formatDate(c.lastOrder)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
