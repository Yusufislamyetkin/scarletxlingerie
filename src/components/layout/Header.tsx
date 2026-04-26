'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Search, ShoppingBag, User, Menu, X, Heart } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useCartStore } from '@/stores/cart'
import SearchOverlay from './SearchOverlay'

const navLinks = [
  { label: 'Koleksiyonlar', href: '/koleksiyonlar' },
  { label: 'Yeni Gelenler', href: '/yeni-gelenler' },
  { label: 'Sütyen', href: '/kategori/sutyen' },
  { label: 'Takım', href: '/kategori/takim' },
  { label: 'Gecelik', href: '/kategori/gecelik' },
  { label: 'Sale', href: '/sale' },
]

export default function Header() {
  const [isScrolled, setIsScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [searchOpen, setSearchOpen]   = useState(false)
  const cartCount = useCartStore((s) => s.itemCount)
  const openCart  = useCartStore((s) => s.open)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Announcement Bar */}
      <div className="w-full bg-charcoal text-ivory text-center py-2.5 px-4">
        <p className="text-xs tracking-widest uppercase font-sans font-light">
          Ücretsiz Kargo — 500 TL Üzeri Siparişlerde &nbsp;|&nbsp; Güvenli Ödeme
        </p>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          isScrolled
            ? 'bg-warm-white/95 backdrop-blur-md shadow-card'
            : 'bg-warm-white'
        )}
      >
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between gap-4">

            {/* Mobile: Hamburger */}
            <button
              className="lg:hidden p-2 -ml-2 text-charcoal"
              onClick={() => setMobileOpen(true)}
              aria-label="Menüyü aç"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="font-serif text-2xl lg:text-3xl tracking-wide text-charcoal">
                Scarlet<span className="text-scarlet">X</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-sans font-light tracking-widest uppercase text-graphite hover:text-scarlet transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-charcoal hover:text-scarlet transition-colors"
                aria-label="Ara"
              >
                <Search size={19} strokeWidth={1.5} />
              </button>
              <Link href="/hesabim/favorilerim" className="p-2 text-charcoal hover:text-scarlet transition-colors" aria-label="Favoriler">
                <Heart size={19} strokeWidth={1.5} />
              </Link>
              <Link href="/hesabim" className="hidden sm:block p-2 text-charcoal hover:text-scarlet transition-colors" aria-label="Hesabım">
                <User size={19} strokeWidth={1.5} />
              </Link>
              <button onClick={openCart} className="relative p-2 text-charcoal hover:text-scarlet transition-colors" aria-label="Sepet">
                <ShoppingBag size={19} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-scarlet text-ivory text-[10px] font-sans font-medium rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-warm-white flex flex-col shadow-luxury">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <span className="font-serif text-xl text-charcoal">
                Scarlet<span className="text-scarlet">X</span>
              </span>
              <button onClick={() => setMobileOpen(false)} className="p-1 text-stone" aria-label="Kapat">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex flex-col flex-1 p-6 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-sm font-sans font-light tracking-widest uppercase text-graphite hover:text-scarlet border-b border-border/50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/hesabim"
                onClick={() => setMobileOpen(false)}
                className="mt-4 py-3 text-sm font-sans font-light tracking-widest uppercase text-graphite hover:text-scarlet border-b border-border/50 transition-colors"
              >
                Hesabım
              </Link>
            </nav>
            <div className="p-6 border-t border-border">
              <p className="text-xs text-stone tracking-wide font-light">
                &copy; {new Date().getFullYear()} ScarletX Lingerie
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
