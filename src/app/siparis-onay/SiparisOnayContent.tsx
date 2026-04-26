'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Package, Truck, MapPin, Gift, ArrowRight, Tag } from 'lucide-react'
import { useCartStore } from '@/stores/cart'
import { formatPrice, formatDate } from '@/lib/utils/format'
import { gtmPurchase } from '@/lib/analytics/gtm'
import { pixelPurchase } from '@/lib/analytics/meta-pixel'
import type { CartItem } from '@/types'

interface OrderSnapshot {
  orderNumber: string
  items: CartItem[]
  address: { fullName: string; addressLine1: string; addressLine2?: string; city: string; district: string; postalCode: string; phone: string; email: string }
  shippingMethod: string
  shippingLabel: string
  shippingCost: number
  giftCost: number
  giftNote: string
  giftWrapping: boolean
  couponCode: string
  couponDiscount: number
  subtotal: number
  total: number
  createdAt: string
}

const STATUS_STEPS = ['Sipariş Alındı', 'Hazırlanıyor', 'Kargoya Verildi', 'Teslim Edildi']

export default function SiparisOnayContent() {
  const searchParams = useSearchParams()
  const orderNum     = searchParams.get('order') ?? ''
  const clearCart    = useCartStore((s) => s.clearCart)

  const [snapshot, setSnapshot] = useState<OrderSnapshot | null>(null)

  useEffect(() => {
    clearCart()
    const raw = sessionStorage.getItem('scarletx-last-order')
    if (raw) {
      try {
        const data: OrderSnapshot = JSON.parse(raw)
        if (!orderNum || data.orderNumber === orderNum) {
          setSnapshot(data)
          // Fire purchase analytics once, deduped by orderId via eventId
          const eventId = `purchase_${data.orderNumber}`
          gtmPurchase(data.orderNumber, data.items, data.total, data.shippingCost, data.couponCode || undefined)
          pixelPurchase(data.items, data.total, data.orderNumber)
          fetch('/api/meta-capi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              eventName: 'Purchase',
              eventId,
              customData: {
                content_ids:  data.items.map((i) => i.variantId),
                content_type: 'product',
                currency:     'TRY',
                value:        data.total,
                order_id:     data.orderNumber,
              },
            }),
          }).catch(() => {})
        }
        sessionStorage.removeItem('scarletx-last-order')
      } catch {
        // invalid JSON — ignore
      }
    }
  }, [clearCart, orderNum])

  return (
    <div className="min-h-screen bg-ivory py-12 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Başlık */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-scarlet/10 flex items-center justify-center">
              <CheckCircle size={36} strokeWidth={1.5} className="text-scarlet" />
            </div>
          </div>
          <h1 className="font-serif text-3xl lg:text-4xl text-charcoal">Siparişiniz Alındı</h1>
          <span className="gold-divider" />
          <p className="text-sm font-sans font-light text-stone max-w-sm mx-auto">
            Siparişiniz onaylandı. Kargo sürecini e-posta ile takip edebileceksiniz.
          </p>
        </div>

        {/* Sipariş no */}
        <div className="bg-cream border border-border px-6 py-5 text-center space-y-1">
          <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone">Sipariş Numarası</p>
          <p className="font-serif text-3xl text-charcoal">{orderNum || snapshot?.orderNumber || '—'}</p>
          {snapshot?.createdAt && (
            <p className="text-xs font-light text-stone mt-1">
              {formatDate(snapshot.createdAt)}
            </p>
          )}
        </div>

        {/* İlerleme adımları */}
        <div className="relative">
          <div className="absolute top-4 left-0 right-0 h-px bg-border mx-10" />
          <div className="relative flex justify-between">
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-2 w-1/4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 text-xs font-sans font-medium ${
                  i === 0 ? 'bg-scarlet text-ivory' : 'bg-linen text-pebble border border-border'
                }`}>
                  {i === 0 ? <CheckCircle size={14} /> : i + 1}
                </div>
                <p className={`text-[10px] font-sans text-center leading-tight ${i === 0 ? 'text-charcoal font-medium' : 'text-pebble'}`}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {snapshot ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Ürünler */}
            <div className="bg-cream border border-border p-6 space-y-4">
              <h2 className="font-sans text-[11px] font-medium tracking-widest uppercase text-stone pb-3 border-b border-border">
                Sipariş İçeriği
              </h2>
              <div className="space-y-3">
                {snapshot.items.map((item) => (
                  <div key={item.variantId} className="flex gap-3">
                    <div className="relative w-14 h-18 bg-linen flex-shrink-0 overflow-hidden">
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                      )}
                      <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-charcoal text-ivory text-[9px] font-medium rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-sans font-light text-charcoal truncate">{item.name}</p>
                      <p className="text-[11px] font-light text-stone mt-0.5">{item.color} · {item.size}</p>
                      <p className="text-xs font-sans font-medium text-charcoal mt-1">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fiyat dökümü */}
              <div className="border-t border-border pt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-light text-stone">Ara Toplam</span>
                  <span className="font-light text-charcoal">{formatPrice(snapshot.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-light text-stone">Kargo ({snapshot.shippingLabel})</span>
                  <span className="font-light text-charcoal">
                    {snapshot.shippingCost === 0 ? 'Ücretsiz' : formatPrice(snapshot.shippingCost)}
                  </span>
                </div>
                {snapshot.giftCost > 0 && (
                  <div className="flex justify-between">
                    <span className="font-light text-stone">Hediye Paketi</span>
                    <span className="font-light text-charcoal">+{formatPrice(snapshot.giftCost)}</span>
                  </div>
                )}
                {snapshot.couponDiscount > 0 && (
                  <div className="flex justify-between text-scarlet">
                    <span className="font-light flex items-center gap-1"><Tag size={11} />{snapshot.couponCode}</span>
                    <span className="font-light">-{formatPrice(snapshot.couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="font-medium text-charcoal">Toplam</span>
                  <span className="font-serif text-lg text-charcoal">{formatPrice(snapshot.total)}</span>
                </div>
              </div>
            </div>

            {/* Teslimat & Hediye */}
            <div className="space-y-4">
              <div className="bg-cream border border-border p-6 space-y-3">
                <h2 className="font-sans text-[11px] font-medium tracking-widest uppercase text-stone pb-3 border-b border-border">
                  Teslimat Adresi
                </h2>
                <div className="flex gap-3">
                  <MapPin size={15} strokeWidth={1.5} className="text-gold flex-shrink-0 mt-0.5" />
                  <div className="text-xs font-sans font-light text-charcoal space-y-0.5">
                    <p className="font-medium">{snapshot.address.fullName}</p>
                    <p>{snapshot.address.addressLine1}</p>
                    {snapshot.address.addressLine2 && <p>{snapshot.address.addressLine2}</p>}
                    <p>{snapshot.address.district} / {snapshot.address.city}</p>
                    <p className="text-stone mt-1">{snapshot.address.phone}</p>
                  </div>
                </div>
              </div>

              {snapshot.giftNote && (
                <div className="bg-cream border border-border p-6 space-y-3">
                  <h2 className="font-sans text-[11px] font-medium tracking-widest uppercase text-stone pb-3 border-b border-border flex items-center gap-2">
                    <Gift size={13} />
                    Hediye Notu
                  </h2>
                  <p className="text-xs font-sans font-light text-charcoal italic leading-relaxed">
                    &ldquo;{snapshot.giftNote}&rdquo;
                  </p>
                </div>
              )}

              <div className="bg-cream border border-border p-6 space-y-2">
                <div className="flex items-center gap-3">
                  <Truck size={15} strokeWidth={1.5} className="text-gold" />
                  <div>
                    <p className="text-xs font-sans font-medium text-charcoal">{snapshot.shippingLabel}</p>
                    <p className="text-[11px] font-light text-stone">
                      {snapshot.shippingMethod === 'express' ? '1-2 iş günü içinde' : '3-5 iş günü içinde'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Snapshot yoksa (direkt URL ile gelinmişse) sadece genel bilgi */
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cream border border-border p-5 space-y-2">
              <Package size={18} strokeWidth={1.5} className="text-gold" />
              <p className="text-xs font-sans font-medium text-charcoal">Kargoya Verilme</p>
              <p className="text-[11px] font-light text-stone">1-2 iş günü içinde</p>
            </div>
            <div className="bg-cream border border-border p-5 space-y-2">
              <Truck size={18} strokeWidth={1.5} className="text-gold" />
              <p className="text-xs font-sans font-medium text-charcoal">Takip</p>
              <p className="text-[11px] font-light text-stone">E-posta ile bildirim</p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/koleksiyonlar" className="btn-outline flex-1 text-xs">
            Alışverişe Devam
          </Link>
          <Link href="/hesabim/siparislerim" className="btn-primary flex-1 text-xs group">
            Siparişlerimi Gör
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
