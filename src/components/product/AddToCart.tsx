'use client'

import { useState } from 'react'
import { ShoppingBag, Check, Minus, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { formatPrice } from '@/lib/utils/format'
import { useCartStore } from '@/stores/cart'
import { gtmAddToCart } from '@/lib/analytics/gtm'
import { pixelAddToCart } from '@/lib/analytics/meta-pixel'
import type { Product, ProductVariant } from '@/types'

interface Props { product: Product }

export default function AddToCart({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem)

  const colors = Array.from(new Map(product.variants.map((v) => [v.colorHex, v])).values())
  const [selectedColor, setSelectedColor] = useState(colors[0]?.colorHex ?? '')
  const variantsForColor = product.variants.filter((v) => v.colorHex === selectedColor)
  const [selectedSize, setSelectedSize]   = useState<string>('')
  const [quantity, setQuantity]           = useState(1)
  const [added, setAdded]                 = useState(false)

  const selectedVariant: ProductVariant | undefined = variantsForColor.find((v) => v.size === selectedSize)
  const isOutOfStock = selectedVariant ? selectedVariant.stock === 0 : false

  function handleAdd() {
    if (!selectedVariant || isOutOfStock) return
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      size: selectedVariant.size,
      color: selectedVariant.color,
      colorHex: selectedVariant.colorHex,
      price: selectedVariant.price,
      image: selectedVariant.images[0] ?? '',
      quantity,
    })
    gtmAddToCart(product, selectedVariant, quantity)
    pixelAddToCart(product, selectedVariant, quantity)
    fetch('/api/meta-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'AddToCart',
        eventId:   `atc_${selectedVariant.id}_${Date.now()}`,
        customData: {
          content_ids:  [selectedVariant.sku || selectedVariant.id],
          content_name: product.name,
          content_type: 'product',
          currency:     'TRY',
          value:        selectedVariant.price * quantity,
          num_items:    quantity,
        },
      }),
    }).catch(() => {})
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-5">
      {/* Fiyat */}
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-3xl text-charcoal">
          {formatPrice(selectedVariant?.price ?? product.variants[0]?.price ?? 0)}
        </span>
        {(selectedVariant?.compareAtPrice ?? product.variants[0]?.compareAtPrice) && (
          <span className="text-sm font-light text-pebble line-through">
            {formatPrice(selectedVariant?.compareAtPrice ?? product.variants[0]?.compareAtPrice ?? 0)}
          </span>
        )}
      </div>

      {/* Renk */}
      {colors.length > 1 && (
        <div>
          <p className="text-xs font-sans font-medium tracking-widest uppercase text-stone mb-2.5">
            Renk — <span className="text-charcoal font-normal normal-case">
              {colors.find((v) => v.colorHex === selectedColor)?.color}
            </span>
          </p>
          <div className="flex gap-2.5">
            {colors.map((v) => (
              <button
                key={v.colorHex}
                onClick={() => { setSelectedColor(v.colorHex); setSelectedSize('') }}
                className={cn(
                  'w-7 h-7 rounded-full border-2 transition-all',
                  selectedColor === v.colorHex ? 'border-charcoal scale-110' : 'border-transparent hover:border-pebble'
                )}
                style={{ backgroundColor: v.colorHex }}
                title={v.color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Beden */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-xs font-sans font-medium tracking-widest uppercase text-stone">Beden</p>
          <button className="text-[10px] font-sans text-gold underline underline-offset-2 hover:text-gold-dark transition-colors">
            Beden Rehberi
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {variantsForColor.map((v) => {
            const oos = v.stock === 0
            return (
              <button
                key={v.size}
                onClick={() => !oos && setSelectedSize(v.size)}
                disabled={oos}
                className={cn(
                  'min-w-[3rem] px-3 py-2 text-xs font-sans border transition-all',
                  selectedSize === v.size
                    ? 'border-charcoal bg-charcoal text-ivory'
                    : oos
                    ? 'border-border text-pebble cursor-not-allowed line-through'
                    : 'border-border text-graphite hover:border-charcoal'
                )}
              >
                {v.size}
              </button>
            )
          })}
        </div>
        {!selectedSize && (
          <p className="text-[11px] text-stone mt-1.5 font-light">Lütfen beden seçin</p>
        )}
      </div>

      {/* Adet */}
      <div className="flex items-center gap-3">
        <p className="text-xs font-sans font-medium tracking-widest uppercase text-stone">Adet</p>
        <div className="flex items-center border border-border">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 text-charcoal hover:bg-cream transition-colors">
            <Minus size={12} strokeWidth={2} />
          </button>
          <span className="w-10 text-center text-sm font-sans font-light">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(selectedVariant?.stock ?? 10, q + 1))}
            className="px-3 py-2 text-charcoal hover:bg-cream transition-colors"
          >
            <Plus size={12} strokeWidth={2} />
          </button>
        </div>
        {selectedVariant && selectedVariant.stock <= 3 && selectedVariant.stock > 0 && (
          <span className="text-[11px] text-scarlet font-light">Son {selectedVariant.stock} adet!</span>
        )}
      </div>

      {/* Sepete ekle */}
      <button
        onClick={handleAdd}
        disabled={!selectedSize || isOutOfStock}
        className={cn(
          'w-full py-4 text-xs font-sans font-medium tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center gap-2',
          !selectedSize || isOutOfStock
            ? 'bg-linen text-pebble cursor-not-allowed'
            : added
            ? 'bg-green-700 text-ivory'
            : 'btn-primary'
        )}
      >
        <AnimatePresence mode="wait">
          {added ? (
            <motion.span key="added" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2">
              <Check size={14} strokeWidth={2} /> Sepete Eklendi
            </motion.span>
          ) : isOutOfStock ? (
            <motion.span key="oos" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Stokta Yok</motion.span>
          ) : (
            <motion.span key="add" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2">
              <ShoppingBag size={14} strokeWidth={1.5} /> Sepete Ekle
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  )
}
