'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/lib/utils/format'

export default function CartDrawer() {
  const { items, isOpen, close, removeItem, updateQuantity, subtotal } = useCartStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-charcoal/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-md bg-warm-white flex flex-col shadow-luxury"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={18} strokeWidth={1.5} className="text-charcoal" />
                <h2 className="font-serif text-lg text-charcoal">Sepetim</h2>
                {items.length > 0 && (
                  <span className="w-5 h-5 bg-scarlet text-ivory text-[10px] font-medium rounded-full flex items-center justify-center">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button onClick={close} className="p-1.5 text-stone hover:text-charcoal transition-colors" aria-label="Kapat">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
                  <ShoppingBag size={40} strokeWidth={1} className="text-linen" />
                  <p className="font-serif text-xl text-charcoal">Sepetiniz Boş</p>
                  <p className="text-sm font-light text-stone">
                    Yeni koleksiyonumuzu keşfetmeye ne dersiniz?
                  </p>
                  <button onClick={close} className="btn-outline text-xs mt-2">
                    Alışverişe Başla
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {items.map((item) => (
                    <motion.li
                      key={item.variantId}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      className="flex gap-4 p-5"
                    >
                      {/* Görsel */}
                      <Link href={`/urun/${item.productId}`} onClick={close} className="flex-shrink-0">
                        <div className="relative w-20 h-24 bg-cream overflow-hidden">
                          {item.image && (
                            <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                          )}
                        </div>
                      </Link>

                      {/* Bilgi */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/urun/${item.productId}`} onClick={close}>
                          <h3 className="text-sm font-sans font-light text-charcoal hover:text-scarlet transition-colors truncate">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-xs font-light text-stone mt-0.5">
                          {item.color} · {item.size}
                        </p>
                        <p className="text-sm font-sans font-medium text-charcoal mt-1">
                          {formatPrice(item.price)}
                        </p>

                        {/* Adet + Sil */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-border">
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              className="px-2.5 py-1.5 text-charcoal hover:bg-cream transition-colors"
                            >
                              <Minus size={11} strokeWidth={2} />
                            </button>
                            <span className="w-8 text-center text-xs font-sans">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              className="px-2.5 py-1.5 text-charcoal hover:bg-cream transition-colors"
                            >
                              <Plus size={11} strokeWidth={2} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="p-1.5 text-pebble hover:text-scarlet transition-colors"
                            aria-label="Kaldır"
                          >
                            <Trash2 size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-5 space-y-4 bg-warm-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans font-medium tracking-widest uppercase text-stone">Ara Toplam</span>
                  <span className="font-serif text-xl text-charcoal">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-[11px] font-light text-stone">
                  Kargo ve vergi ödeme adımında hesaplanır.
                </p>
                <Link
                  href="/odeme"
                  onClick={close}
                  className="btn-primary w-full group"
                >
                  Ödemeye Geç
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <button onClick={close} className="w-full text-xs font-sans font-light tracking-widest uppercase text-stone hover:text-charcoal transition-colors py-1">
                  Alışverişe Devam Et
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
