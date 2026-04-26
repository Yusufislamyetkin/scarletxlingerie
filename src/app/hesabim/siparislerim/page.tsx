import Image from 'next/image'
import Link from 'next/link'
import { Package } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils/format'
import type { OrderStatus } from '@/types'

interface MockOrderItem {
  name: string; size: string; color: string; quantity: number; price: number; image: string
}
interface MockOrder {
  id: string; orderNumber: string; createdAt: string; status: OrderStatus
  items: MockOrderItem[]; total: number; shippingCost: number
}

const MOCK_ORDERS: MockOrder[] = [
  {
    id: '1', orderNumber: 'SX26030015', createdAt: '2026-03-15',
    status: 'delivered',
    items: [
      { name: 'Velvet Noir Sütyen', size: '75B', color: 'Siyah', quantity: 1, price: 1290, image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&q=80' },
    ],
    total: 1439, shippingCost: 149,
  },
  {
    id: '2', orderNumber: 'SX26040102', createdAt: '2026-04-10',
    status: 'shipped',
    items: [
      { name: 'Ivory Reverie Takım', size: 'S', color: 'Fildişi', quantity: 1, price: 2190, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80' },
      { name: 'Scarlet Romance Gecelik', size: 'XS', color: 'Kırmızı', quantity: 1, price: 3490, image: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=400&q=80' },
    ],
    total: 5680, shippingCost: 0,
  },
]

const STATUS_MAP: Record<OrderStatus, { label: string; className: string }> = {
  pending:          { label: 'Beklemede',    className: 'bg-linen text-stone' },
  confirmed:        { label: 'Onaylandı',    className: 'bg-gold/15 text-gold-dark' },
  preparing:        { label: 'Hazırlanıyor', className: 'bg-gold/20 text-gold-dark' },
  shipped:          { label: 'Kargoda',      className: 'bg-charcoal/10 text-charcoal' },
  delivered:        { label: 'Teslim Edildi',className: 'bg-scarlet/10 text-scarlet' },
  cancelled:        { label: 'İptal Edildi', className: 'bg-pebble/20 text-pebble' },
  refund_requested: { label: 'İade Talep',   className: 'bg-pebble/20 text-pebble' },
  refunded:         { label: 'İade Edildi',  className: 'bg-pebble/20 text-pebble' },
}

export default function SiparislerimPage() {
  if (MOCK_ORDERS.length === 0) {
    return (
      <EmptyState />
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone mb-6">
        {MOCK_ORDERS.length} Sipariş
      </p>

      {MOCK_ORDERS.map((order) => {
        const status = STATUS_MAP[order.status]
        return (
          <div key={order.id} className="bg-cream border border-border p-5 sm:p-6 space-y-4">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-0.5">
                <p className="font-serif text-lg text-charcoal">{order.orderNumber}</p>
                <p className="text-xs font-light text-stone">{formatDate(order.createdAt)}</p>
              </div>
              <span className={`px-3 py-1 text-[10px] font-sans font-medium tracking-widest uppercase ${status.className}`}>
                {status.label}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-3 border-t border-border pt-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="relative w-12 h-15 bg-linen flex-shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-sans font-light text-charcoal truncate">{item.name}</p>
                    <p className="text-[11px] font-light text-stone">{item.color} · {item.size} · {item.quantity} adet</p>
                  </div>
                  <p className="text-xs font-sans font-medium text-charcoal flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <span className="text-[11px] font-sans font-light text-stone">Toplam </span>
                <span className="font-serif text-xl text-charcoal">{formatPrice(order.total)}</span>
              </div>
              <button className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone hover:text-scarlet transition-colors border border-border px-4 py-2 hover:border-scarlet">
                Detay
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="bg-cream border border-border p-12 flex flex-col items-center text-center gap-4">
      <Package size={36} strokeWidth={1} className="text-linen" />
      <p className="font-serif text-xl text-charcoal">Henüz Sipariş Yok</p>
      <p className="text-sm font-light text-stone">Yeni koleksiyonlarımızı keşfetmek ister misiniz?</p>
      <Link href="/koleksiyonlar" className="btn-outline text-xs mt-2">Koleksiyonlara Git</Link>
    </div>
  )
}
