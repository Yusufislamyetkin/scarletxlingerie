'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, Heart, MapPin, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const links = [
  { href: '/hesabim/siparislerim', label: 'Siparişlerim',     Icon: Package  },
  { href: '/hesabim/favorilerim',  label: 'Favorilerim',      Icon: Heart    },
  { href: '/hesabim/adreslerim',   label: 'Adreslerim',       Icon: MapPin   },
  { href: '/hesabim/ayarlar',      label: 'Hesap Bilgileri',  Icon: Settings },
]

export default function AccountSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      {/* Profil özeti */}
      <div className="bg-cream border border-border p-6 mb-4 space-y-1">
        <div className="w-12 h-12 bg-charcoal text-ivory font-serif text-xl flex items-center justify-center mb-3">
          S
        </div>
        <p className="text-sm font-sans font-medium text-charcoal">Scarlet Üye</p>
        <p className="text-xs font-light text-stone">uye@scarletx.com</p>
        <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-sans font-medium tracking-widest uppercase bg-gold/20 text-gold-dark border border-gold/30">
          Gold Üye
        </span>
      </div>

      {/* Navigasyon */}
      <nav className="bg-cream border border-border divide-y divide-border">
        {links.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-5 py-4 text-xs font-sans font-light tracking-widest uppercase transition-colors',
                active
                  ? 'text-scarlet bg-scarlet/[0.03] border-l-2 border-scarlet pl-[calc(1.25rem-2px)]'
                  : 'text-graphite hover:text-charcoal hover:bg-linen/50'
              )}
            >
              <Icon size={15} strokeWidth={1.5} />
              {label}
            </Link>
          )
        })}
        <button
          className="w-full flex items-center gap-3 px-5 py-4 text-xs font-sans font-light tracking-widest uppercase text-stone hover:text-charcoal hover:bg-linen/50 transition-colors"
        >
          <LogOut size={15} strokeWidth={1.5} />
          Çıkış Yap
        </button>
      </nav>
    </aside>
  )
}
