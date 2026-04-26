'use client'

import { useState } from 'react'
import { Save, Globe } from 'lucide-react'
import { mockProducts } from '@/lib/mock-data'

const inputCls = "w-full px-3 py-2.5 text-sm font-sans font-light border border-border bg-ivory text-charcoal placeholder:text-pebble focus:outline-none focus:border-charcoal"

const PAGES = [
  { key: 'home',         label: 'Ana Sayfa',        path: '/'             },
  { key: 'collections',  label: 'Koleksiyonlar',    path: '/koleksiyonlar'},
  { key: 'new',          label: 'Yeni Gelenler',    path: '/yeni-gelenler'},
]

export default function SeoPage() {
  const [activeTab, setActiveTab] = useState<'pages' | 'products'>('pages')
  const [saved, setSaved] = useState<string | null>(null)

  const [pageSeo, setPageSeo] = useState<Record<string, { title: string; desc: string }>>({
    home:        { title: 'ScarletX Lingerie — Premium İç Giyim', desc: 'Sessiz lüksün adresi. Özenle seçilmiş premium iç giyim koleksiyonu.' },
    collections: { title: 'Koleksiyonlar | ScarletX Lingerie',    desc: 'Velvet Noir, Ivory Reverie ve Scarlet Romance koleksiyonlarını keşfedin.' },
    new:         { title: 'Yeni Gelenler | ScarletX Lingerie',    desc: 'En yeni lüks iç giyim ürünleri.' },
  })

  const handleSave = (key: string) => {
    setSaved(key)
    setTimeout(() => setSaved(null), 1800)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Globe size={20} strokeWidth={1.5} className="text-gold" />
        <div>
          <h1 className="font-serif text-3xl text-charcoal">SEO Editörü</h1>
          <p className="text-sm font-light text-stone mt-0.5">Meta başlık ve açıklama yönetimi</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {(['pages', 'products'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-xs font-sans font-medium tracking-widest uppercase transition-colors border-b-2 -mb-px ${
              activeTab === tab ? 'border-charcoal text-charcoal' : 'border-transparent text-stone hover:text-charcoal'
            }`}
          >
            {tab === 'pages' ? 'Sayfalar' : 'Ürünler'}
          </button>
        ))}
      </div>

      {/* Sayfa SEO */}
      {activeTab === 'pages' && (
        <div className="space-y-4">
          {PAGES.map(page => {
            const seo = pageSeo[page.key] ?? { title: '', desc: '' }
            return (
              <div key={page.key} className="bg-warm-white border border-border p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <p className="font-sans font-medium text-sm text-charcoal">{page.label}</p>
                    <p className="text-[11px] font-light text-pebble">{page.path}</p>
                  </div>
                  <button
                    onClick={() => handleSave(page.key)}
                    className={`flex items-center gap-1.5 text-[11px] font-sans font-medium tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                      saved === page.key
                        ? 'bg-green-600 text-ivory border-green-600'
                        : 'border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory'
                    }`}
                  >
                    <Save size={12} />
                    {saved === page.key ? 'Kaydedildi!' : 'Kaydet'}
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone">Meta Başlık</p>
                      <p className="text-[11px] text-pebble">{seo.title.length}/70</p>
                    </div>
                    <input
                      type="text"
                      value={seo.title}
                      onChange={e => setPageSeo(s => ({ ...s, [page.key]: { ...s[page.key], title: e.target.value } }))}
                      className={inputCls}
                      maxLength={70}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone">Meta Açıklama</p>
                      <p className="text-[11px] text-pebble">{seo.desc.length}/160</p>
                    </div>
                    <textarea
                      value={seo.desc}
                      onChange={e => setPageSeo(s => ({ ...s, [page.key]: { ...s[page.key], desc: e.target.value } }))}
                      rows={2}
                      className={`${inputCls} resize-none`}
                      maxLength={160}
                    />
                  </div>
                </div>

                {/* Google önizleme */}
                <div className="mt-2 p-4 bg-cream border border-border rounded-sm space-y-0.5">
                  <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone mb-2">Google Önizlemesi</p>
                  <p className="text-sm text-blue-700 font-medium truncate">{seo.title || page.label}</p>
                  <p className="text-[11px] text-green-700">scarletxlingerie.com{page.path}</p>
                  <p className="text-xs text-stone font-light line-clamp-2">{seo.desc || '—'}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Ürün SEO */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {mockProducts.map(product => (
            <div key={product.id} className="bg-warm-white border border-border p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <p className="font-sans font-medium text-sm text-charcoal">{product.name}</p>
                  <p className="text-[11px] font-light text-pebble">/urun/{product.slug}</p>
                </div>
                <button
                  onClick={() => handleSave(product.id)}
                  className={`flex items-center gap-1.5 text-[11px] font-sans font-medium tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                    saved === product.id
                      ? 'bg-green-600 text-ivory border-green-600'
                      : 'border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory'
                  }`}
                >
                  <Save size={12} />
                  {saved === product.id ? 'Kaydedildi!' : 'Kaydet'}
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone">Meta Başlık</p>
                    <p className="text-[11px] text-pebble">{(product.seoTitle ?? '').length}/70</p>
                  </div>
                  <input type="text" defaultValue={product.seoTitle ?? product.name} className={inputCls} maxLength={70} />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone">Meta Açıklama</p>
                  </div>
                  <textarea defaultValue={product.seoDescription ?? product.description.slice(0, 155)} rows={2} className={`${inputCls} resize-none`} maxLength={160} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
