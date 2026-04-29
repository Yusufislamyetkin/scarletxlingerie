'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Save, Upload } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format'
import type { Product, ProductVariant } from '@/types'

function FormField({
  label, children, hint, required,
}: {
  label: string; children: React.ReactNode; hint?: string; required?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-sans font-medium tracking-widest uppercase text-stone">
        {label}{required && <span className="text-scarlet ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] font-light text-pebble">{hint}</p>}
    </div>
  )
}

const inputCls = "w-full px-4 py-2.5 text-sm font-sans font-light border border-border bg-ivory text-charcoal placeholder:text-pebble focus:outline-none focus:border-charcoal transition-colors"

interface Props {
  id: string
  existing: Product | null
  collections: { id: string; name: string }[]
}

export default function UrunForm({ id, existing, collections }: Props) {
  const router  = useRouter()
  const isNew   = id === 'yeni'

  const [name, setName]           = useState(existing?.name ?? '')
  const [description, setDesc]    = useState(existing?.description ?? '')
  const [category, setCategory]   = useState(existing?.category ?? '')
  const [material, setMaterial]   = useState(existing?.material ?? '')
  const [careInstr, setCare]      = useState(existing?.careInstructions ?? '')
  const [modelMeas, setModel]     = useState(existing?.modelMeasurements ?? '')
  const [isNew_, setIsNew]        = useState(existing?.isNew ?? false)
  const [isFeatured, setFeatured] = useState(existing?.isFeatured ?? false)
  const [seoTitle, setSeoTitle]   = useState(existing?.seoTitle ?? '')
  const [seoDesc, setSeoDesc]     = useState(existing?.seoDescription ?? '')
  const [variants, setVariants]   = useState<Partial<ProductVariant>[]>(
    existing?.variants.length
      ? existing.variants
      : [{ size: '', color: '', colorHex: '#1A1A1A', price: 0, compareAtPrice: undefined, stock: 0, images: [] }]
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  const addVariant = () =>
    setVariants(vs => [...vs, { size: '', color: '', colorHex: '#1A1A1A', price: 0, stock: 0, images: [] }])

  const removeVariant = (i: number) =>
    setVariants(vs => vs.filter((_, idx) => idx !== i))

  const updateVariant = (i: number, field: keyof ProductVariant, value: string | number) =>
    setVariants(vs => vs.map((v, idx) => idx === i ? { ...v, [field]: value } : v))

  const handleSave = async () => {
    setSaving(true)
    // TODO: wire up to /api/admin/products server action
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/urunler" className="p-2 text-stone hover:text-charcoal transition-colors">
            <ArrowLeft size={18} strokeWidth={1.5} />
          </Link>
          <div>
            <h1 className="font-serif text-2xl text-charcoal">
              {isNew ? 'Yeni Ürün' : name || 'Ürün Düzenle'}
            </h1>
            <p className="text-xs font-light text-stone mt-0.5">
              {isNew ? 'Yeni bir ürün ekleyin' : `ID: ${id}`}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 btn-primary text-xs ${saved ? 'bg-green-700 border-green-700' : ''}`}
        >
          <Save size={14} />
          {saving ? 'Kaydediliyor...' : saved ? 'Kaydedildi!' : 'Kaydet'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ana bilgiler */}
        <div className="lg:col-span-2 space-y-5">

          {/* Temel Bilgiler */}
          <section className="bg-warm-white border border-border p-6 space-y-4">
            <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-stone pb-3 border-b border-border">
              Temel Bilgiler
            </h2>
            <FormField label="Ürün Adı" required>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="Örn: Velvet Noir Sütyen" />
            </FormField>
            <FormField label="Açıklama" required>
              <textarea
                value={description}
                onChange={e => setDesc(e.target.value)}
                rows={4}
                className={`${inputCls} resize-none`}
                placeholder="Ürün açıklamasını girin..."
              />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Kategori" required>
                <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>
                  <option value="">Seçin</option>
                  <option value="Külot">Külot</option>
                  <option value="Tanga">Tanga</option>
                  <option value="Takım">Takım</option>
                  <option value="Korse">Korse</option>
                </select>
              </FormField>
              <FormField label="Koleksiyon">
                <select className={inputCls}>
                  <option value="">Seçin</option>
                  {collections.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </FormField>
            </div>
          </section>

          {/* Varyantlar */}
          <section className="bg-warm-white border border-border p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-stone">
                Varyantlar & Stok
              </h2>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1.5 text-[11px] font-sans font-medium tracking-widest uppercase text-charcoal hover:text-scarlet transition-colors"
              >
                <Plus size={13} /> Varyant Ekle
              </button>
            </div>

            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-cream border border-border items-end">
                <div>
                  <p className="text-[10px] font-sans font-medium tracking-widest uppercase text-stone mb-1.5">Beden</p>
                  <input
                    type="text"
                    value={v.size ?? ''}
                    onChange={e => updateVariant(i, 'size', e.target.value)}
                    className={inputCls}
                    placeholder="S / 75B"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-sans font-medium tracking-widest uppercase text-stone mb-1.5">Renk</p>
                  <input
                    type="text"
                    value={v.color ?? ''}
                    onChange={e => updateVariant(i, 'color', e.target.value)}
                    className={inputCls}
                    placeholder="Siyah"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-sans font-medium tracking-widest uppercase text-stone mb-1.5">Fiyat (₺)</p>
                  <input
                    type="number"
                    value={v.price ?? ''}
                    onChange={e => updateVariant(i, 'price', Number(e.target.value))}
                    className={inputCls}
                    placeholder="0"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-sans font-medium tracking-widest uppercase text-stone mb-1.5">Stok</p>
                  <input
                    type="number"
                    value={v.stock ?? ''}
                    onChange={e => updateVariant(i, 'stock', Number(e.target.value))}
                    className={inputCls}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    disabled={variants.length === 1}
                    className="p-2.5 text-pebble hover:text-scarlet transition-colors disabled:opacity-30"
                  >
                    <Trash2 size={15} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* Görseller */}
          <section className="bg-warm-white border border-border p-6 space-y-4">
            <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-stone pb-3 border-b border-border">
              Görseller
            </h2>
            <div className="border-2 border-dashed border-border rounded-sm p-10 text-center space-y-2">
              <Upload size={24} strokeWidth={1} className="text-pebble mx-auto" />
              <p className="text-sm font-sans font-light text-stone">Görsel yüklemek için tıklayın veya sürükleyin</p>
              <p className="text-xs font-light text-pebble">PNG, JPG, WebP — Maks. 5 MB</p>
              <button type="button" className="btn-outline text-[11px] mt-2">
                Görsel Seç
              </button>
            </div>
          </section>

          {/* Lüks Detaylar */}
          <section className="bg-warm-white border border-border p-6 space-y-4">
            <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-stone pb-3 border-b border-border">
              Lüks Detaylar
            </h2>
            <FormField label="Materyal">
              <input type="text" value={material} onChange={e => setMaterial(e.target.value)} className={inputCls} placeholder="Örn: %65 Naylon, %25 Polyester, %10 Elastan" />
            </FormField>
            <FormField label="Bakım Talimatları">
              <input type="text" value={careInstr} onChange={e => setCare(e.target.value)} className={inputCls} placeholder="Örn: 30°C'de hassas yıkama" />
            </FormField>
            <FormField label="Model Ölçüleri" hint="Ürünü giyen modelin ölçü bilgileri">
              <input type="text" value={modelMeas} onChange={e => setModel(e.target.value)} className={inputCls} placeholder="Örn: Model 90cm göğüs, 70B kullanmaktadır" />
            </FormField>
          </section>

          {/* SEO */}
          <section className="bg-warm-white border border-border p-6 space-y-4">
            <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-stone pb-3 border-b border-border">
              SEO Bilgileri
            </h2>
            <FormField label="Meta Başlık" hint="Boş bırakılırsa ürün adı kullanılır">
              <input type="text" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} className={inputCls} placeholder={name || 'Ürün Adı'} maxLength={70} />
              <p className="text-[11px] text-pebble text-right">{seoTitle.length}/70</p>
            </FormField>
            <FormField label="Meta Açıklama">
              <textarea
                value={seoDesc}
                onChange={e => setSeoDesc(e.target.value)}
                rows={2}
                className={`${inputCls} resize-none`}
                placeholder="Ürünün kısa SEO açıklaması"
                maxLength={160}
              />
              <p className="text-[11px] text-pebble text-right">{seoDesc.length}/160</p>
            </FormField>
          </section>
        </div>

        {/* Sağ Panel */}
        <div className="space-y-5">

          {/* Yayın Durumu */}
          <div className="bg-warm-white border border-border p-5 space-y-4">
            <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-stone pb-3 border-b border-border">
              Yayın Durumu
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNew_}
                  onChange={e => setIsNew(e.target.checked)}
                  className="w-4 h-4 accent-charcoal"
                />
                <span className="text-sm font-sans font-light text-charcoal">Yeni Ürün Etiketi</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={e => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-charcoal"
                />
                <span className="text-sm font-sans font-light text-charcoal">Öne Çıkan Ürün</span>
              </label>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`btn-primary w-full text-xs ${saved ? 'bg-green-700 border-green-700' : ''}`}
            >
              <Save size={13} />
              {saving ? 'Kaydediliyor...' : saved ? 'Kaydedildi!' : 'Yayınla'}
            </button>
            {!isNew && (
              <button className="w-full text-[11px] font-sans font-light tracking-widest uppercase text-pebble hover:text-scarlet transition-colors border border-border px-4 py-2.5 hover:border-scarlet">
                Sil
              </button>
            )}
          </div>

          {/* Özet */}
          {!isNew && existing && (
            <div className="bg-warm-white border border-border p-5 space-y-3">
              <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-stone pb-3 border-b border-border">
                Özet
              </h2>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-light text-stone">Varyant</span>
                  <span className="font-medium text-charcoal">{existing.variants.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-light text-stone">Toplam Stok</span>
                  <span className="font-medium text-charcoal">{existing.variants.reduce((s, v) => s + v.stock, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-light text-stone">Min Fiyat</span>
                  <span className="font-medium text-charcoal">
                    {existing.variants.length > 0
                      ? formatPrice(Math.min(...existing.variants.map(v => v.price)))
                      : '—'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
