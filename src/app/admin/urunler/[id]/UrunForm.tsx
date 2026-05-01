'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Save, Upload, X, Loader2, ImageOff, AlertCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format'
import type { Product, ProductVariant } from '@/types'
import { saveProduct } from './actions'

function FormField({ label, children, hint, required }: {
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
  const isNew = id === 'yeni'
  const router = useRouter()

  const [name, setName]           = useState(existing?.name ?? '')
  const [description, setDesc]    = useState(existing?.description ?? '')
  const [category, setCategory]   = useState(existing?.category ?? '')
  const [collectionId, setCollId] = useState(existing?.collectionId ?? '')
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

  const allExistingImages = [...new Set(existing?.variants.flatMap(v => v.images) ?? [])]
  const [images, setImages]           = useState<string[]>(allExistingImages)
  const [uploading, setUploading]     = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragOver, setDragOver]       = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // ─── Görsel yükleme ───────────────────────────────────────────────────────

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (!list.length) return

    setUploading(true)
    setUploadError(null)

    try {
      const fd = new FormData()
      for (const file of list) fd.append('files', file)

      const res  = await fetch('/api/upload', { method: 'POST', body: fd })
      const text = await res.text()

      if (!text) throw new Error('Sunucu boş yanıt döndürdü. Lütfen tekrar deneyin.')

      let data: { url?: string; results?: { url: string }[]; error?: string }
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error('Sunucu geçersiz yanıt döndürdü.')
      }

      if (!res.ok) throw new Error(data.error ?? `Sunucu hatası (${res.status})`)

      const urls = data.results
        ? data.results.map(r => r.url)
        : data.url
          ? [data.url]
          : []

      setImages(prev => [...prev, ...urls])
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Görsel yüklenemedi.')
    } finally {
      setUploading(false)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files)
    e.target.value = ''
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files)
  }, [uploadFiles])

  const removeImage = (url: string) =>
    setImages(prev => prev.filter(u => u !== url))

  // ─── Varyant işlemleri ────────────────────────────────────────────────────

  const addVariant = () =>
    setVariants(vs => [...vs, { size: '', color: '', colorHex: '#1A1A1A', price: 0, stock: 0, images: [] }])

  const removeVariant = (i: number) =>
    setVariants(vs => vs.filter((_, idx) => idx !== i))

  const updateVariant = (i: number, field: keyof ProductVariant, value: string | number) =>
    setVariants(vs => vs.map((v, idx) => idx === i ? { ...v, [field]: value } : v))

  // ─── Kaydet ───────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!name.trim()) { setSaveError('Ürün adı zorunludur.'); return }

    setSaving(true)
    setSaveError(null)
    setSaved(false)

    const result = await saveProduct(id, {
      name:              name.trim(),
      description:       description.trim(),
      category,
      collectionId,
      material:          material.trim(),
      careInstructions:  careInstr.trim(),
      modelMeasurements: modelMeas.trim(),
      isNew:             isNew_,
      isFeatured,
      seoTitle:          seoTitle.trim(),
      seoDescription:    seoDesc.trim(),
      images,
      variants,
    })

    setSaving(false)

    if (!result.ok) {
      setSaveError(result.error)
      return
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)

    if (isNew) {
      router.push('/admin/urunler')
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

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
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? 'Kaydediliyor...' : saved ? 'Kaydedildi!' : 'Kaydet'}
        </button>
      </div>

      {/* Kaydetme hatası */}
      {saveError && (
        <div className="flex items-start gap-2 px-4 py-3 bg-scarlet/5 border border-scarlet/30">
          <AlertCircle size={15} className="text-scarlet mt-0.5 flex-shrink-0" />
          <p className="text-sm font-light text-scarlet">{saveError}</p>
        </div>
      )}

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
                <select value={collectionId} onChange={e => setCollId(e.target.value)} className={inputCls}>
                  <option value="">Seçin</option>
                  {collections.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </FormField>
            </div>
          </section>

          {/* Görseller */}
          <section className="bg-warm-white border border-border p-6 space-y-4">
            <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-stone pb-3 border-b border-border">
              Görseller
            </h2>

            {/* Drag & drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-colors select-none ${
                dragOver
                  ? 'border-charcoal bg-cream'
                  : 'border-border hover:border-charcoal/50 hover:bg-cream/50'
              }`}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 size={24} className="animate-spin text-charcoal" />
                  <p className="text-sm font-sans font-light text-stone">Yükleniyor…</p>
                </div>
              ) : (
                <>
                  <Upload size={22} strokeWidth={1} className="text-pebble mx-auto mb-2" />
                  <p className="text-sm font-sans font-light text-stone">
                    Tıklayın veya görseli buraya sürükleyin
                  </p>
                  <p className="text-xs font-light text-pebble mt-1">PNG, JPG, WebP — Maks. 5 MB</p>
                </>
              )}
            </div>

            {/* Hata mesajı */}
            {uploadError && (
              <div className="flex items-start gap-2 px-3 py-2.5 bg-scarlet/5 border border-scarlet/20">
                <ImageOff size={14} className="text-scarlet mt-0.5 flex-shrink-0" />
                <p className="text-xs font-light text-scarlet">{uploadError}</p>
              </div>
            )}

            {/* Yüklenen görseller */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((url, i) => (
                  <div key={url} className="relative group aspect-square bg-cream overflow-hidden">
                    <Image
                      src={url}
                      alt={`Görsel ${i + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] font-sans font-medium tracking-widest uppercase bg-charcoal/70 text-ivory py-0.5">
                        Ana Görsel
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-1 right-1 w-5 h-5 bg-scarlet text-ivory rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                {/* Ekle butonu */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-border flex items-center justify-center text-pebble hover:border-charcoal hover:text-charcoal transition-colors"
                >
                  <Plus size={18} strokeWidth={1.5} />
                </button>
              </div>
            )}
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
          <div className="bg-warm-white border border-border p-5 space-y-4">
            <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-stone pb-3 border-b border-border">
              Yayın Durumu
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={isNew_} onChange={e => setIsNew(e.target.checked)} className="w-4 h-4 accent-charcoal" />
                <span className="text-sm font-sans font-light text-charcoal">Yeni Ürün Etiketi</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={isFeatured} onChange={e => setFeatured(e.target.checked)} className="w-4 h-4 accent-charcoal" />
                <span className="text-sm font-sans font-light text-charcoal">Öne Çıkan Ürün</span>
              </label>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`btn-primary w-full text-xs flex items-center justify-center gap-2 ${saved ? 'bg-green-700 border-green-700' : ''}`}
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
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
                <div className="flex justify-between">
                  <span className="font-light text-stone">Görsel</span>
                  <span className="font-medium text-charcoal">{images.length}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
