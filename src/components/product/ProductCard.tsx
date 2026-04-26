'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { formatPrice } from '@/lib/utils/format'
import { useWishlistStore } from '@/stores/wishlist'
import type { Product } from '@/types'

interface Props {
  product: Product
  priority?: boolean
}

export default function ProductCard({ product, priority = false }: Props) {
  const [imageIndex, setImageIndex] = useState(0)
  const wishlistItems = useWishlistStore((s) => s.items)
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const isWishlisted = wishlistItems.some((p) => p.id === product.id)

  const firstVariant = product.variants[0]
  const price = firstVariant?.price ?? 0
  const compareAt = firstVariant?.compareAtPrice
  const images = firstVariant?.images ?? []
  const secondImage = images[1] ?? images[0]
  const discount = compareAt ? Math.round((1 - price / compareAt) * 100) : null
  const isOutOfStock = product.variants.every((v) => v.stock === 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group relative"
    >
      {/* Görsel */}
      <Link href={`/urun/${product.slug}`} className="block relative overflow-hidden bg-cream aspect-[3/4]">
        {images[0] && (
          <Image
            src={imageIndex === 0 ? images[0] : secondImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
            priority={priority}
            onMouseEnter={() => images.length > 1 && setImageIndex(1)}
            onMouseLeave={() => setImageIndex(0)}
          />
        )}

        {/* Badge'ler */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="px-2 py-0.5 bg-charcoal text-ivory text-[10px] font-sans font-medium tracking-widest uppercase">
              Yeni
            </span>
          )}
          {discount && (
            <span className="px-2 py-0.5 bg-scarlet text-ivory text-[10px] font-sans font-medium tracking-widest uppercase">
              -{discount}%
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 bg-pebble text-ivory text-[10px] font-sans font-medium tracking-widest uppercase">
              Tükendi
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product) }}
          className="absolute top-3 right-3 p-2 bg-warm-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-label="Favorilere ekle"
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            className={cn('transition-colors', isWishlisted ? 'fill-scarlet text-scarlet' : 'text-charcoal')}
          />
        </button>
      </Link>

      {/* Bilgi */}
      <div className="pt-3 space-y-1">
        <Link href={`/urun/${product.slug}`}>
          <h3 className="text-sm font-sans font-light text-charcoal hover:text-scarlet transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Renk seçenekleri */}
        {product.variants.length > 1 && (
          <div className="flex gap-1.5 items-center">
            {Array.from(new Map(product.variants.map((v) => [v.colorHex, v])).values()).map((v) => (
              <span
                key={v.colorHex}
                className="w-3 h-3 rounded-full border border-border shadow-sm"
                style={{ backgroundColor: v.colorHex }}
                title={v.color}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-sm font-sans font-medium text-charcoal">
            {formatPrice(price)}
          </span>
          {compareAt && (
            <span className="text-xs font-sans font-light text-pebble line-through">
              {formatPrice(compareAt)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
