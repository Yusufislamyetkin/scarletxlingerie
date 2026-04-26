'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, Layers, ShoppingCart, RotateCcw,
  Users, Tag, Megaphone, Search, Settings, LogOut, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const NAV = [
  {
    group: 'Satış',
    items: [
      { href: '/admin/dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
      { href: '/admin/siparisler',   label: 'Siparişler',   Icon: ShoppingCart },
      { href: '/admin/iadeler',      label: 'İadeler',      Icon: RotateCcw },
    ],
  },
  {
    group: 'Katalog',
    items: [
      { href: '/admin/urunler',      label: 'Ürünler',      Icon: Package },
      { href: '/admin/koleksiyonlar',label: 'Koleksiyonlar',Icon: Layers },
    ],
  },
  {
    group: 'Müşteri',
    items: [
      { href: '/admin/musteriler',   label: 'Müşteriler',   Icon: Users },
      { href: '/admin/kuponlar',     label: 'Kuponlar',     Icon: Tag },
    ],
  },
  {
    group: 'İçerik',
    items: [
      { href: '/admin/kampanyalar',  label: 'Kampanyalar',  Icon: Megaphone },
      { href: '/admin/seo',          label: 'SEO',          Icon: Search },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-charcoal flex flex-col z-40 overflow-y-auto">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10 flex-shrink-0">
        <Link href="/admin/dashboard" className="font-serif text-xl text-ivory">
          Scarlet<span className="text-scarlet">X</span>
          <span className="ml-2 text-[10px] font-sans font-medium tracking-widest uppercase text-pebble">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-6">
        {NAV.map(({ group, items }) => (
          <div key={group}>
            <p className="px-3 mb-2 text-[10px] font-sans font-medium tracking-widest uppercase text-pebble">
              {group}
            </p>
            <div className="space-y-0.5">
              {items.map(({ href, label, Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/')
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 text-sm font-sans font-light rounded-sm transition-colors',
                      active
                        ? 'bg-scarlet text-ivory'
                        : 'text-ivory/70 hover:text-ivory hover:bg-white/10'
                    )}
                  >
                    <Icon size={16} strokeWidth={1.5} />
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 space-y-0.5 flex-shrink-0 border-t border-white/10 pt-4">
        <Link
          href="/admin/ayarlar"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-sans font-light text-ivory/70 hover:text-ivory hover:bg-white/10 rounded-sm transition-colors"
        >
          <Settings size={16} strokeWidth={1.5} />
          Ayarlar
        </Link>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-sans font-light text-ivory/70 hover:text-ivory hover:bg-white/10 rounded-sm transition-colors"
        >
          <ChevronRight size={16} strokeWidth={1.5} />
          Siteyi Görüntüle
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-sans font-light text-ivory/70 hover:text-ivory hover:bg-white/10 rounded-sm transition-colors">
          <LogOut size={16} strokeWidth={1.5} />
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
