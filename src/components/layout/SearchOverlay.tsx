'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, X, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/lib/utils/format'
import { mockProducts } from '@/lib/mock-data'
import type { Product } from '@/types'

interface Props {
  isOpen: boolean
  onClose: () => void
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

function searchProducts(query: string): Product[] {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  return mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q)
  ).slice(0, 6)
}

const POPULAR = ['Sütyen', 'Gecelik', 'Velvet Noir', 'Scarlet', 'Dantel']

export default function SearchOverlay({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('')
  const debouncedQuery    = useDebounce(query, 280)
  const results           = searchProducts(debouncedQuery)
  const inputRef          = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80)
      setQuery('')
    }
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Kaydırma engellemesi
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleLinkClick = () => {
    onClose()
    setQuery('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-charcoal/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-[90] bg-warm-white shadow-luxury"
          >
            {/* Input */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
              <div className="relative flex items-center gap-3 border-b-2 border-charcoal pb-4">
                <Search size={20} strokeWidth={1.5} className="text-stone flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ürün, koleksiyon veya kategori ara..."
                  className="flex-1 bg-transparent text-lg font-sans font-light text-charcoal placeholder:text-pebble focus:outline-none"
                />
                <button
                  onClick={onClose}
                  className="p-1 text-stone hover:text-charcoal transition-colors"
                  aria-label="Aramayı kapat"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Sonuçlar */}
              <div className="pt-6 pb-4">
                {debouncedQuery && results.length === 0 && (
                  <p className="text-sm font-light text-stone py-4 text-center">
                    &ldquo;{debouncedQuery}&rdquo; için sonuç bulunamadı.
                  </p>
                )}

                {debouncedQuery && results.length > 0 && (
                  <div>
                    <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone mb-4">
                      Sonuçlar ({results.length})
                    </p>
                    <div className="space-y-1">
                      {results.map((product) => {
                        const variant = product.variants[0]
                        return (
                          <Link
                            key={product.id}
                            href={`/urun/${product.slug}`}
                            onClick={handleLinkClick}
                            className="flex items-center gap-4 px-3 py-2.5 hover:bg-cream rounded-sm transition-colors group"
                          >
                            <div className="relative w-10 h-12 bg-linen flex-shrink-0 overflow-hidden">
                              {variant?.images[0] && (
                                <Image src={variant.images[0]} alt={product.name} fill sizes="40px" className="object-cover" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-sans font-light text-charcoal truncate group-hover:text-scarlet transition-colors">
                                {product.name}
                              </p>
                              <p className="text-[11px] font-light text-stone capitalize">{product.category}</p>
                            </div>
                            <p className="text-sm font-sans font-medium text-charcoal flex-shrink-0">
                              {formatPrice(variant?.price ?? 0)}
                            </p>
                          </Link>
                        )
                      })}
                    </div>
                    <Link
                      href={`/koleksiyonlar?ara=${encodeURIComponent(debouncedQuery)}`}
                      onClick={handleLinkClick}
                      className="flex items-center gap-1.5 mt-4 text-xs font-sans font-medium text-scarlet hover:underline"
                    >
                      Tüm sonuçları gör <ArrowRight size={12} />
                    </Link>
                  </div>
                )}

                {!debouncedQuery && (
                  <div>
                    <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone mb-4">
                      Popüler Aramalar
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-4 py-2 border border-border text-xs font-sans font-light text-charcoal hover:border-charcoal hover:bg-cream transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
