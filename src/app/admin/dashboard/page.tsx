import {
  TrendingUp, ShoppingCart, Package, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Clock,
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils/format'
import type { OrderStatus } from '@/types'

// ─── Mock veriler ─────────────────────────────────────────────────────────────

const STATS = [
  {
    label:   "Bugünkü Gelir",
    value:   formatPrice(12890),
    change:  "+12%",
    up:      true,
    sub:     "Dünden",
    Icon:    TrendingUp,
    color:   "text-scarlet",
    bg:      "bg-scarlet/10",
  },
  {
    label:   "Bekleyen Sipariş",
    value:   "8",
    change:  "3 acil",
    up:      false,
    sub:     "Onay bekliyor",
    Icon:    ShoppingCart,
    color:   "text-gold-dark",
    bg:      "bg-gold/15",
  },
  {
    label:   "Aktif Ürün",
    value:   "24",
    change:  "+2",
    up:      true,
    sub:     "Bu hafta eklendi",
    Icon:    Package,
    color:   "text-charcoal",
    bg:      "bg-charcoal/10",
  },
  {
    label:   "Stok Uyarısı",
    value:   "3",
    change:  "Kritik",
    up:      false,
    sub:     "Stok < 3 adet",
    Icon:    AlertTriangle,
    color:   "text-amber-600",
    bg:      "bg-amber-50",
  },
]

const RECENT_ORDERS = [
  { id: 'SX26040102', customer: 'Ayşe K.',    total: 5680, status: 'shipped'   as OrderStatus, date: '2026-04-25' },
  { id: 'SX26040099', customer: 'Zeynep M.',  total: 1290, status: 'confirmed' as OrderStatus, date: '2026-04-25' },
  { id: 'SX26040097', customer: 'Elif B.',    total: 3490, status: 'pending'   as OrderStatus, date: '2026-04-24' },
  { id: 'SX26040094', customer: 'Selin A.',   total: 2190, status: 'preparing' as OrderStatus, date: '2026-04-24' },
  { id: 'SX26040090', customer: 'Canan T.',   total: 7890, status: 'delivered' as OrderStatus, date: '2026-04-23' },
]

const TOP_PRODUCTS = [
  { name: 'Velvet Noir Sütyen',       sales: 42, stock: 8,  revenue: formatPrice(54180) },
  { name: 'Ivory Reverie Takım',      sales: 31, stock: 5,  revenue: formatPrice(67890) },
  { name: 'Scarlet Romance Gecelik',  sales: 28, stock: 2,  revenue: formatPrice(97720) },
  { name: 'Velvet Noir Takım',        sales: 19, stock: 12, revenue: formatPrice(47310) },
]

const STATUS_LABELS: Record<OrderStatus, { label: string; cls: string }> = {
  pending:          { label: 'Beklemede',    cls: 'bg-stone/15 text-stone' },
  confirmed:        { label: 'Onaylandı',    cls: 'bg-gold/20 text-gold-dark' },
  preparing:        { label: 'Hazırlanıyor', cls: 'bg-gold/20 text-gold-dark' },
  shipped:          { label: 'Kargoda',      cls: 'bg-charcoal/15 text-charcoal' },
  delivered:        { label: 'Teslim Edildi',cls: 'bg-scarlet/10 text-scarlet' },
  cancelled:        { label: 'İptal',        cls: 'bg-pebble/20 text-pebble' },
  refund_requested: { label: 'İade Talep',   cls: 'bg-pebble/20 text-pebble' },
  refunded:         { label: 'İade Edildi',  cls: 'bg-pebble/20 text-pebble' },
}

// ─── Sayfa ────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl">

      {/* Başlık */}
      <div>
        <h1 className="font-serif text-3xl text-charcoal">Dashboard</h1>
        <p className="text-sm font-light text-stone mt-1">26 Nisan 2026, Pazar</p>
      </div>

      {/* KPI Kartlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ label, value, change, up, sub, Icon, color, bg }) => (
          <div key={label} className="bg-warm-white border border-border p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-sans font-medium tracking-widest uppercase text-stone">{label}</p>
              <div className={`w-9 h-9 rounded-sm flex items-center justify-center ${bg}`}>
                <Icon size={16} strokeWidth={1.5} className={color} />
              </div>
            </div>
            <p className="font-serif text-3xl text-charcoal">{value}</p>
            <div className="flex items-center gap-1.5">
              {up
                ? <ArrowUpRight size={13} className="text-green-600" />
                : <ArrowDownRight size={13} className="text-amber-600" />
              }
              <span className={`text-xs font-sans font-medium ${up ? 'text-green-600' : 'text-amber-600'}`}>{change}</span>
              <span className="text-xs font-light text-stone">{sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Alt Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Son Siparişler */}
        <div className="xl:col-span-2 bg-warm-white border border-border">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-sans text-sm font-medium text-charcoal">Son Siparişler</h2>
            <a href="/admin/siparisler" className="text-[11px] font-sans font-medium tracking-widest uppercase text-scarlet hover:underline">
              Tümünü Gör
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-[11px] font-sans font-medium tracking-widest uppercase text-stone">Sipariş No</th>
                  <th className="px-6 py-3 text-left text-[11px] font-sans font-medium tracking-widest uppercase text-stone">Müşteri</th>
                  <th className="px-6 py-3 text-right text-[11px] font-sans font-medium tracking-widest uppercase text-stone">Tutar</th>
                  <th className="px-6 py-3 text-center text-[11px] font-sans font-medium tracking-widest uppercase text-stone">Durum</th>
                  <th className="px-6 py-3 text-right text-[11px] font-sans font-medium tracking-widest uppercase text-stone">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {RECENT_ORDERS.map((order) => {
                  const s = STATUS_LABELS[order.status]
                  return (
                    <tr key={order.id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-6 py-3 font-sans font-medium text-charcoal">{order.id}</td>
                      <td className="px-6 py-3 font-light text-charcoal">{order.customer}</td>
                      <td className="px-6 py-3 text-right font-sans font-medium text-charcoal">{formatPrice(order.total)}</td>
                      <td className="px-6 py-3 text-center">
                        <span className={`px-2 py-0.5 text-[10px] font-sans font-medium tracking-widest uppercase ${s.cls}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right font-light text-stone text-xs">{formatDate(order.date)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* En Çok Satanlar */}
        <div className="bg-warm-white border border-border">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-sans text-sm font-medium text-charcoal">En Çok Satanlar</h2>
            <Clock size={14} strokeWidth={1.5} className="text-stone" />
          </div>
          <div className="divide-y divide-border">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name} className="px-6 py-4 flex items-start gap-3">
                <span className="font-serif text-xl text-pebble w-6 flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-sans font-light text-charcoal truncate">{p.name}</p>
                  <p className="text-xs font-light text-stone mt-0.5">{p.sales} satış</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-sans font-medium text-charcoal">{p.revenue}</p>
                  <p className={`text-[10px] font-light mt-0.5 ${p.stock <= 3 ? 'text-amber-600' : 'text-stone'}`}>
                    {p.stock} stok
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
