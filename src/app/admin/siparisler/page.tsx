'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Eye, ChevronDown } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils/format'
import type { OrderStatus } from '@/types'

const ORDERS = [
  { id: 'SX26040102', customer: 'Ayşe Kaya',    email: 'ayse@mail.com',   total: 5680, status: 'shipped'   as OrderStatus, date: '2026-04-25', items: 2, payment: 'paid'    },
  { id: 'SX26040099', customer: 'Zeynep Mert',  email: 'zeynep@mail.com', total: 1290, status: 'confirmed' as OrderStatus, date: '2026-04-25', items: 1, payment: 'paid'    },
  { id: 'SX26040097', customer: 'Elif Baran',   email: 'elif@mail.com',   total: 3490, status: 'pending'   as OrderStatus, date: '2026-04-24', items: 1, payment: 'pending' },
  { id: 'SX26040094', customer: 'Selin Aydın',  email: 'selin@mail.com',  total: 2190, status: 'preparing' as OrderStatus, date: '2026-04-24', items: 1, payment: 'paid'    },
  { id: 'SX26040090', customer: 'Canan Taşkın', email: 'canan@mail.com',  total: 7890, status: 'delivered' as OrderStatus, date: '2026-04-23', items: 3, payment: 'paid'    },
  { id: 'SX26040085', customer: 'Merve Demir',  email: 'merve@mail.com',  total: 1590, status: 'cancelled' as OrderStatus, date: '2026-04-22', items: 1, payment: 'refunded'},
]

const STATUS_OPTIONS: { value: OrderStatus | ''; label: string }[] = [
  { value: '',              label: 'Tüm Durumlar'  },
  { value: 'pending',       label: 'Beklemede'     },
  { value: 'confirmed',     label: 'Onaylandı'     },
  { value: 'preparing',     label: 'Hazırlanıyor'  },
  { value: 'shipped',       label: 'Kargoda'       },
  { value: 'delivered',     label: 'Teslim Edildi' },
  { value: 'cancelled',     label: 'İptal'         },
]

const STATUS_MAP: Record<OrderStatus, { label: string; cls: string; nextSteps: OrderStatus[] }> = {
  pending:          { label: 'Beklemede',    cls: 'bg-stone/15 text-stone',       nextSteps: ['confirmed', 'cancelled'] },
  confirmed:        { label: 'Onaylandı',    cls: 'bg-gold/20 text-gold-dark',    nextSteps: ['preparing', 'cancelled'] },
  preparing:        { label: 'Hazırlanıyor', cls: 'bg-gold/20 text-gold-dark',    nextSteps: ['shipped'] },
  shipped:          { label: 'Kargoda',      cls: 'bg-charcoal/15 text-charcoal', nextSteps: ['delivered'] },
  delivered:        { label: 'Teslim Edildi',cls: 'bg-scarlet/10 text-scarlet',   nextSteps: [] },
  cancelled:        { label: 'İptal',        cls: 'bg-pebble/20 text-pebble',     nextSteps: [] },
  refund_requested: { label: 'İade Talep',   cls: 'bg-pebble/20 text-pebble',     nextSteps: ['refunded'] },
  refunded:         { label: 'İade Edildi',  cls: 'bg-pebble/20 text-pebble',     nextSteps: [] },
}

const NEXT_LABEL: Record<OrderStatus, string> = {
  pending:          'Onayla',
  confirmed:        'Hazırlamaya Başla',
  preparing:        'Kargoya Ver',
  shipped:          'Teslim Edildi',
  delivered:        '',
  cancelled:        '',
  refund_requested: 'İadeyi Onayla',
  refunded:         '',
}

export default function SiparislerPage() {
  const [orders, setOrders]     = useState(ORDERS)
  const [filter, setFilter]     = useState<OrderStatus | ''>('')
  const [search, setSearch]     = useState('')

  const updateStatus = (id: string, status: OrderStatus) =>
    setOrders(os => os.map(o => o.id === id ? { ...o, status } : o))

  const filtered = orders.filter(o => {
    if (filter && o.status !== filter) return false
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.customer.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-serif text-3xl text-charcoal">Siparişler</h1>
        <p className="text-sm font-light text-stone mt-1">{orders.length} sipariş</p>
      </div>

      {/* Filtreler */}
      <div className="bg-warm-white border border-border p-4 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Sipariş no veya müşteri ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-4 py-2 text-sm font-sans font-light border border-border bg-ivory text-charcoal placeholder:text-pebble focus:outline-none focus:border-charcoal"
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as OrderStatus | '')}
          className="px-4 py-2 text-sm font-sans font-light border border-border bg-ivory text-charcoal focus:outline-none focus:border-charcoal"
        >
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Tablo */}
      <div className="bg-warm-white border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-cream">
              {['Sipariş No', 'Müşteri', 'Tutar', 'Durum', 'Tarih', 'İşlem'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-sans font-medium tracking-widest uppercase text-stone first:pl-6 last:text-right last:pr-6">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((order) => {
              const s = STATUS_MAP[order.status]
              const next = s.nextSteps[0]
              return (
                <tr key={order.id} className="hover:bg-cream/40 transition-colors">
                  <td className="px-6 py-4 font-sans font-medium text-charcoal">{order.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-light text-charcoal">{order.customer}</p>
                    <p className="text-[11px] text-stone font-light">{order.items} ürün</p>
                  </td>
                  <td className="px-5 py-4 font-sans font-medium text-charcoal">{formatPrice(order.total)}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 text-[10px] font-sans font-medium tracking-widest uppercase ${s.cls}`}>
                      {s.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs font-light text-stone">{formatDate(order.date)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {next && (
                        <button
                          onClick={() => updateStatus(order.id, next)}
                          className="text-[11px] font-sans font-medium tracking-widest uppercase text-charcoal border border-charcoal px-3 py-1.5 hover:bg-charcoal hover:text-ivory transition-colors"
                        >
                          {NEXT_LABEL[order.status]}
                        </button>
                      )}
                      <button className="p-1.5 text-stone hover:text-charcoal transition-colors">
                        <Eye size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm font-light text-stone">Sonuç bulunamadı.</div>
        )}
      </div>
    </div>
  )
}
