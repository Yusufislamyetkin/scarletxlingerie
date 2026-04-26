'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useCartStore } from '@/stores/cart'

const navItems = [
  { icon: Home,        label: 'Ana Sayfa', href: '/' },
  { icon: Search,      label: 'Ara',       href: '/ara' },
  { icon: ShoppingBag, label: 'Sepet',     href: '/sepet', badgeKey: 'cart' },
  { icon: Heart,       label: 'Favori',    href: '/favoriler' },
  { icon: User,        label: 'Hesabım',   href: '/hesabim' },
]

export default function MobileNav() {
  const pathname = usePathname()
  const cartCount = useCartStore((s) => s.itemCount)

  if (pathname.startsWith('/admin')) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-warm-white border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ icon: Icon, label, href, badgeKey }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          const count = badgeKey === 'cart' ? cartCount : 0

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full relative"
            >
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={1.5}
                  className={cn(
                    'transition-colors duration-200',
                    isActive ? 'text-scarlet' : 'text-stone'
                  )}
                />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-scarlet text-ivory text-[9px] font-medium rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-[10px] font-sans font-light tracking-wide',
                isActive ? 'text-scarlet' : 'text-stone'
              )}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
