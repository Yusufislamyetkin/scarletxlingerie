'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Tag, X, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/lib/utils/format'

const COUPONS: Record<string, { type: 'pct' | 'fixed'; value: number }> = {
  SCARLET10: { type: 'pct',   value: 10  },
  ILKALIM:   { type: 'fixed', value: 150 },
  HOSGELDIN: { type: 'fixed', value: 200 },
}

interface Props {
  shippingCost: number
  giftCost: number
  couponDiscount: number
  couponCode: string
  onCouponChange: (discount: number, code: string) => void
  submitButton?: React.ReactNode
}

export default function OrderSummary({
  shippingCost, giftCost, couponDiscount, couponCode, onCouponChange, submitButton,
}: Props) {
  const { items, subtotal } = useCartStore()
  const [inputCode, setInputCode] = useState(couponCode)
  const [error, setError]         = useState('')
  const [itemsOpen, setItemsOpen] = useState(false)

  const handleApply = () => {
    const code = inputCode.trim().toUpperCase()
    if (!code) return
    const coupon = COUPONS[code]
    if (!coupon) {
      setError('Geçersiz kupon kodu.')
      onCouponChange(0, '')
      return
    }
    setError('')
    const discount =
      coupon.type === 'pct'
        ? Math.round(subtotal * coupon.value / 100)
        : coupon.value
    onCouponChange(discount, code)
  }

  const handleRemove = () => {
    setInputCode('')
    setError('')
    onCouponChange(0, '')
  }

  const total = subtotal + shippingCost + giftCost - couponDiscount

  return (
    <div className="bg-cream border border-border p-6 lg:p-8 space-y-6">
      {/* Header — mobile'da items toggle */}
      <button
        type="button"
        className="w-full flex items-center justify-between"
        onClick={() => setItemsOpen(v => !v)}
      >
        <h2 className="font-serif text-xl text-charcoal">Sipariş Özeti</h2>
        <span className="lg:hidden text-stone">
          {itemsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {/* Items */}
      <div className={`space-y-4 ${itemsOpen ? 'block' : 'hidden lg:block'}`}>
        {items.map(item => (
          <div key={item.variantId} className="flex gap-3">
            <div className="relative w-16 h-20 bg-linen flex-shrink-0 overflow-hidden">
              {item.image && (
                <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
              )}
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-charcoal text-ivory text-[10px] font-medium rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-sans font-light text-charcoal truncate">{item.name}</p>
              <p className="text-xs font-light text-stone mt-0.5">{item.color} · {item.size}</p>
              <p className="text-sm font-sans font-medium text-charcoal mt-1">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border" />

      {/* Kupon */}
      <div className="space-y-2">
        {couponDiscount > 0 ? (
          <div className="flex items-center justify-between bg-scarlet/5 border border-scarlet/20 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Check size={13} className="text-scarlet" />
              <span className="text-xs font-sans font-medium text-scarlet tracking-wide">{couponCode}</span>
            </div>
            <button type="button" onClick={handleRemove} className="text-stone hover:text-charcoal transition-colors">
              <X size={13} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-pebble pointer-events-none" />
                <input
                  type="text"
                  value={inputCode}
                  onChange={e => { setInputCode(e.target.value.toUpperCase()); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleApply())}
                  placeholder="Kupon kodu"
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-sans border border-border bg-warm-white text-charcoal placeholder:text-pebble focus:outline-none focus:border-charcoal transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={handleApply}
                className="px-4 py-2.5 bg-charcoal text-ivory text-[11px] font-sans font-medium tracking-widest uppercase hover:bg-scarlet transition-colors"
              >
                Uygula
              </button>
            </div>
            {error && <p className="text-xs text-scarlet font-light">{error}</p>}
          </>
        )}
      </div>

      {/* Fiyat dökümü */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="font-sans font-light text-stone">Ara Toplam</span>
          <span className="font-sans font-light text-charcoal">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-sans font-light text-stone">Kargo</span>
          <span className="font-sans font-light text-charcoal">
            {shippingCost === 0 ? 'Ücretsiz' : formatPrice(shippingCost)}
          </span>
        </div>
        {giftCost > 0 && (
          <div className="flex justify-between">
            <span className="font-sans font-light text-stone">Hediye Paketi</span>
            <span className="font-sans font-light text-charcoal">+{formatPrice(giftCost)}</span>
          </div>
        )}
        {couponDiscount > 0 && (
          <div className="flex justify-between">
            <span className="font-sans font-light text-scarlet">İndirim</span>
            <span className="font-sans font-light text-scarlet">-{formatPrice(couponDiscount)}</span>
          </div>
        )}
        <div className="border-t border-border pt-3 flex justify-between items-baseline">
          <span className="font-sans font-medium text-[11px] tracking-widest uppercase text-stone">Toplam</span>
          <span className="font-serif text-2xl text-charcoal">{formatPrice(total)}</span>
        </div>
      </div>

      {submitButton}
    </div>
  )
}
