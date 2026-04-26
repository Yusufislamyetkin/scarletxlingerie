'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Props {
  images: string[]
  productName: string
}

export default function ProductGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  const prev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1))

  if (images.length === 0) return (
    <div className="aspect-[3/4] bg-cream flex items-center justify-center text-pebble text-sm">
      Görsel yok
    </div>
  )

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-3">
      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px]">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'relative flex-shrink-0 w-16 h-20 lg:w-20 lg:h-24 overflow-hidden border-2 transition-all',
                active === i ? 'border-charcoal' : 'border-transparent hover:border-pebble'
              )}
            >
              <Image src={img} alt={`${productName} ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Ana görsel */}
      <div className="relative flex-1 aspect-[3/4] bg-cream overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[active]}
              alt={`${productName} — Görsel ${active + 1}`}
              fill
              priority={active === 0}
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom btn */}
        <button
          onClick={() => setZoomed(true)}
          className="absolute top-3 right-3 p-2 bg-warm-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Büyüt"
        >
          <ZoomIn size={16} strokeWidth={1.5} />
        </button>

        {/* Prev/Next */}
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-warm-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-warm-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={cn('w-1.5 h-1.5 rounded-full transition-all', active === i ? 'bg-charcoal w-4' : 'bg-pebble')}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
            className="fixed inset-0 z-[80] bg-charcoal/90 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <div className="relative w-full max-w-2xl aspect-[3/4]">
              <Image src={images[active]} alt={productName} fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
