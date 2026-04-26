'use client'

import { useState } from 'react'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from './ProductCard'
import { cn } from '@/lib/utils/cn'
import type { Product } from '@/types'

interface Props {
  products: Product[]
  title?: string
}

const SORT_OPTIONS = [
  { label: 'Önerilen',          value: 'featured' },
  { label: 'Yeni Gelenler',     value: 'newest' },
  { label: 'Fiyat: Düşük→Yüksek', value: 'price-asc' },
  { label: 'Fiyat: Yüksek→Düşük', value: 'price-desc' },
]

const SIZES  = ['XS', 'S', 'M', 'L', 'XL', '70B', '75B', '75C', '80B', '80C', '85C']
const CATEGORIES = ['Sütyen', 'Takım', 'Gecelik', 'Slip', 'Korset']

export default function ProductGrid({ products, title }: Props) {
  const [sortBy, setSortBy]       = useState('featured')
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [sortOpen, setSortOpen]   = useState(false)

  function toggleSize(size: string) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  const sorted = [...products].sort((a, b) => {
    const aPrice = a.variants[0]?.price ?? 0
    const bPrice = b.variants[0]?.price ?? 0
    if (sortBy === 'price-asc')  return aPrice - bPrice
    if (sortBy === 'price-desc') return bPrice - aPrice
    if (sortBy === 'newest')     return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    return 0
  })

  const filtered = selectedSizes.length === 0
    ? sorted
    : sorted.filter((p) => p.variants.some((v) => selectedSizes.includes(v.size)))

  return (
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Üst bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={cn(
              'flex items-center gap-2 text-xs font-sans font-medium tracking-widest uppercase transition-colors',
              filterOpen ? 'text-scarlet' : 'text-charcoal hover:text-scarlet'
            )}
          >
            <SlidersHorizontal size={15} strokeWidth={1.5} />
            Filtre
            {selectedSizes.length > 0 && (
              <span className="w-4 h-4 bg-scarlet text-ivory text-[9px] rounded-full flex items-center justify-center">
                {selectedSizes.length}
              </span>
            )}
          </button>
          {selectedSizes.length > 0 && (
            <button
              onClick={() => setSelectedSizes([])}
              className="flex items-center gap-1 text-[10px] text-stone hover:text-scarlet transition-colors"
            >
              <X size={11} /> Temizle
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-light text-stone hidden sm:block">
            {filtered.length} ürün
          </span>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-1.5 text-xs font-sans font-medium tracking-wide text-charcoal hover:text-scarlet transition-colors"
            >
              {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
              <ChevronDown size={13} className={cn('transition-transform', sortOpen && 'rotate-180')} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-7 z-20 w-48 bg-warm-white border border-border shadow-card"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setSortOpen(false) }}
                      className={cn(
                        'w-full text-left px-4 py-2.5 text-xs font-sans font-light transition-colors',
                        sortBy === opt.value ? 'text-scarlet bg-cream' : 'text-graphite hover:bg-cream'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filter panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="flex-shrink-0 overflow-hidden"
            >
              <div className="w-[220px] space-y-6 pr-6">
                <div>
                  <h4 className="text-[10px] font-sans font-medium tracking-widest uppercase text-stone mb-3">
                    Beden
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={cn(
                          'px-2.5 py-1 text-[11px] font-sans border transition-all',
                          selectedSizes.includes(size)
                            ? 'border-charcoal bg-charcoal text-ivory'
                            : 'border-border text-graphite hover:border-charcoal'
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-stone text-sm font-light">
              Seçili filtrelere uygun ürün bulunamadı.
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 4} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
