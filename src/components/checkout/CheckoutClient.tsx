'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Truck, Zap, Gift, Loader2, Lock } from 'lucide-react'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/lib/utils/format'
import { gtmBeginCheckout } from '@/lib/analytics/gtm'
import { pixelInitiateCheckout } from '@/lib/analytics/meta-pixel'
import OrderSummary from './OrderSummary'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AddressFields {
  fullName:     string
  email:        string
  phone:        string
  addressLine1: string
  addressLine2: string
  city:         string
  district:     string
  postalCode:   string
}

type ShippingMethodId = 'standard' | 'express'

// ─── Constants ─────────────────────────────────────────────────────────────────

const SHIPPING_METHODS = [
  {
    id:       'standard' as ShippingMethodId,
    label:    'Standart Kargo',
    desc:     '3-5 iş günü',
    price:    149,
    freeOver: 1500,
    Icon:     Truck,
  },
  {
    id:       'express' as ShippingMethodId,
    label:    'Ekspres Kargo',
    desc:     '1-2 iş günü',
    price:    249,
    freeOver: null,
    Icon:     Zap,
  },
]

const REQUIRED_FIELDS: (keyof AddressFields)[] = [
  'fullName', 'email', 'phone', 'addressLine1', 'city', 'district', 'postalCode',
]

// ─── Sub-components ─────────────────────────────────────────────────────────────

function InputField({
  label, name, value, onChange, error, type = 'text', placeholder, optional,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void
  error?: string; type?: string; placeholder?: string; optional?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-[11px] font-sans font-medium tracking-widest uppercase text-stone">
        {label}
        {optional && <span className="ml-1.5 font-light normal-case tracking-normal text-pebble">(opsiyonel)</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={name}
        className={`w-full px-4 py-3 text-sm font-sans font-light border bg-warm-white text-charcoal placeholder:text-pebble focus:outline-none transition-colors ${
          error ? 'border-scarlet bg-scarlet/[0.02]' : 'border-border focus:border-charcoal'
        }`}
      />
      {error && <p className="text-xs text-scarlet font-light">{error}</p>}
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function CheckoutClient() {
  const router = useRouter()
  const { items, subtotal } = useCartStore()
  const [isPending, startTransition] = useTransition()

  const [address, setAddress] = useState<AddressFields>({
    fullName: '', email: '', phone: '',
    addressLine1: '', addressLine2: '',
    city: '', district: '', postalCode: '',
  })
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>('standard')
  const [giftWrapping, setGiftWrapping]     = useState(false)
  const [giftNote, setGiftNote]             = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponCode, setCouponCode]         = useState('')
  const [errors, setErrors]                 = useState<Partial<Record<keyof AddressFields, string>>>({})

  const selectedMethod = SHIPPING_METHODS.find(m => m.id === shippingMethod)!
  const shippingCost   = selectedMethod.freeOver && subtotal >= selectedMethod.freeOver
    ? 0
    : selectedMethod.price
  const giftCost = giftWrapping ? 50 : 0

  useEffect(() => {
    if (items.length === 0) return
    gtmBeginCheckout(items, subtotal)
    pixelInitiateCheckout(items, subtotal)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setField = (field: keyof AddressFields) => (value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof AddressFields, string>> = {}
    REQUIRED_FIELDS.forEach(f => {
      if (!address[f].trim()) next[f] = 'Bu alan zorunludur.'
    })
    if (address.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
      next.email = 'Geçerli bir e-posta adresi girin.'
    }
    if (address.phone && !/^[0-9\s\-\+\(\)]{10,}$/.test(address.phone)) {
      next.phone = 'Geçerli bir telefon numarası girin.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || items.length === 0) return

    startTransition(async () => {
      const orderNum = 'SX' + Date.now().toString().slice(-8)
      // Onay sayfasının gösterebilmesi için anlık snapshot'ı sakla
      const snapshot = {
        orderNumber: orderNum,
        items,
        address,
        shippingMethod,
        shippingLabel: selectedMethod.label,
        shippingCost,
        giftCost,
        giftNote,
        giftWrapping,
        couponCode,
        couponDiscount,
        subtotal,
        total: subtotal + shippingCost + giftCost - couponDiscount,
        createdAt: new Date().toISOString(),
      }
      sessionStorage.setItem('scarletx-last-order', JSON.stringify(snapshot))
      // FAZ 3.6'da iyzico ödeme URL'sine yönlendirme buraya gelecek
      router.push(`/siparis-onay?order=${orderNum}`)
    })
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="gold-divider" />
        <p className="font-serif text-2xl text-charcoal">Sepetiniz Boş</p>
        <p className="text-sm font-light text-stone">Koleksiyonumuzu keşfederek yeni ürünler ekleyebilirsiniz.</p>
        <Link href="/koleksiyonlar" className="btn-outline text-xs mt-2">Koleksiyonları Gör</Link>
      </div>
    )
  }

  const submitButton = (
    <button
      type="submit"
      form="checkout-form"
      disabled={isPending}
      className="btn-primary w-full group"
    >
      {isPending
        ? <Loader2 size={16} className="animate-spin" />
        : <><Lock size={13} />Güvenli Ödemeye Geç</>
      }
    </button>
  )

  return (
    <div className="min-h-screen bg-ivory">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-[11px] font-sans tracking-widest uppercase text-stone" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-charcoal transition-colors">Ana Sayfa</Link>
            <ChevronRight size={11} />
            <button
              type="button"
              onClick={() => useCartStore.getState().open()}
              className="hover:text-charcoal transition-colors"
            >
              Sepet
            </button>
            <ChevronRight size={11} />
            <span className="text-charcoal font-medium">Ödeme</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-12 xl:gap-16 items-start">

          {/* ── Sol: Form ──────────────────────────────────────────────────── */}
          <div>
            <h1 className="font-serif text-3xl lg:text-4xl text-charcoal mb-10">Teslimat Bilgileri</h1>

            <form id="checkout-form" onSubmit={handleSubmit} noValidate className="space-y-10">

              {/* Adres */}
              <section>
                <SectionTitle>Teslimat Adresi</SectionTitle>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="Ad Soyad" name="fullName"   value={address.fullName}   onChange={setField('fullName')}   error={errors.fullName} />
                    <InputField label="Telefon"  name="phone"      value={address.phone}      onChange={setField('phone')}      error={errors.phone} type="tel" placeholder="+90 5xx xxx xx xx" />
                  </div>
                  <InputField label="E-posta" name="email" value={address.email} onChange={setField('email')} error={errors.email} type="email" placeholder="ornek@email.com" />
                  <InputField label="Adres"   name="addressLine1" value={address.addressLine1} onChange={setField('addressLine1')} error={errors.addressLine1} placeholder="Mahalle, cadde/sokak, bina no, daire" />
                  <InputField label="Adres Devamı" name="addressLine2" value={address.addressLine2} onChange={setField('addressLine2')} optional placeholder="Kat, blok, tarif (opsiyonel)" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <InputField label="Şehir"      name="city"       value={address.city}       onChange={setField('city')}       error={errors.city} />
                    <InputField label="İlçe"       name="district"   value={address.district}   onChange={setField('district')}   error={errors.district} />
                    <InputField label="Posta Kodu" name="postalCode" value={address.postalCode} onChange={setField('postalCode')} error={errors.postalCode} />
                  </div>
                </div>
              </section>

              {/* Kargo */}
              <section>
                <SectionTitle>Kargo Seçimi</SectionTitle>
                <div className="space-y-3">
                  {SHIPPING_METHODS.map(({ id, label, desc, price, freeOver, Icon }) => {
                    const cost   = freeOver && subtotal >= freeOver ? 0 : price
                    const isFree = cost === 0
                    const active = shippingMethod === id
                    return (
                      <label
                        key={id}
                        className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${
                          active ? 'border-charcoal bg-warm-white' : 'border-border hover:border-pebble'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={id}
                          checked={active}
                          onChange={() => setShippingMethod(id)}
                          className="sr-only"
                        />
                        {/* Radio visual */}
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${active ? 'border-charcoal' : 'border-pebble'}`}>
                          {active && <div className="w-2 h-2 rounded-full bg-charcoal" />}
                        </div>
                        <Icon size={18} strokeWidth={1.5} className={active ? 'text-charcoal' : 'text-pebble'} />
                        <div className="flex-1">
                          <p className="text-sm font-sans font-medium text-charcoal">{label}</p>
                          <p className="text-xs font-light text-stone mt-0.5">{desc}</p>
                          {freeOver && (
                            <p className="text-[11px] font-light text-gold-dark mt-0.5">
                              {formatPrice(freeOver)} üzeri ücretsiz
                            </p>
                          )}
                        </div>
                        <span className={`text-sm font-sans font-medium flex-shrink-0 ${isFree ? 'text-gold-dark' : 'text-charcoal'}`}>
                          {isFree ? 'Ücretsiz' : formatPrice(cost)}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </section>

              {/* Hediye */}
              <section>
                <SectionTitle>Hediye Seçenekleri</SectionTitle>
                <div className="space-y-4">
                  <label className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${giftWrapping ? 'border-charcoal bg-warm-white' : 'border-border hover:border-pebble'}`}>
                    <input
                      type="checkbox"
                      checked={giftWrapping}
                      onChange={e => setGiftWrapping(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 border-2 flex items-center justify-center flex-shrink-0 ${giftWrapping ? 'border-charcoal bg-charcoal' : 'border-pebble'}`}>
                      {giftWrapping && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="#FAF7F2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <Gift size={18} strokeWidth={1.5} className={giftWrapping ? 'text-charcoal' : 'text-pebble'} />
                    <div className="flex-1">
                      <p className="text-sm font-sans font-medium text-charcoal">Hediye Paketi</p>
                      <p className="text-xs font-light text-stone mt-0.5">Özel kutuda, doku kağıdı ve kurdelesiyle</p>
                    </div>
                    <span className="text-sm font-sans font-medium text-charcoal flex-shrink-0">+{formatPrice(50)}</span>
                  </label>

                  <div className="space-y-1.5">
                    <label htmlFor="giftNote" className="block text-[11px] font-sans font-medium tracking-widest uppercase text-stone">
                      Hediye Notu
                      <span className="ml-1.5 font-light normal-case tracking-normal text-pebble">(opsiyonel)</span>
                    </label>
                    <textarea
                      id="giftNote"
                      value={giftNote}
                      onChange={e => setGiftNote(e.target.value)}
                      placeholder="Sevdiklerinize özel bir mesaj bırakın..."
                      rows={3}
                      maxLength={300}
                      className="w-full px-4 py-3 text-sm font-sans font-light border border-border bg-warm-white text-charcoal placeholder:text-pebble focus:outline-none focus:border-charcoal transition-colors resize-none"
                    />
                    <p className="text-[11px] text-pebble text-right">{giftNote.length}/300</p>
                  </div>
                </div>
              </section>

              {/* Mobil: submit butonu form içinde */}
              <div className="lg:hidden">{submitButton}</div>
            </form>
          </div>

          {/* ── Sağ: Sipariş Özeti ──────────────────────────────────────────── */}
          <div className="mt-10 lg:mt-0">
            <div className="lg:sticky lg:top-28 space-y-4">
              <OrderSummary
                shippingCost={shippingCost}
                giftCost={giftCost}
                couponDiscount={couponDiscount}
                couponCode={couponCode}
                onCouponChange={(discount, code) => { setCouponDiscount(discount); setCouponCode(code) }}
                submitButton={<div className="hidden lg:block">{submitButton}</div>}
              />
              <p className="flex items-center justify-center gap-1.5 text-[11px] font-sans font-light text-stone">
                <Lock size={11} />
                256-bit SSL şifrelemesiyle güvenli ödeme
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-sans text-[11px] font-medium tracking-widest uppercase text-stone mb-5 pb-3 border-b border-border">
      {children}
    </h2>
  )
}
