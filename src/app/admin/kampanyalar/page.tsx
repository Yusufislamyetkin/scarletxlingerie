'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Bell, Image as ImageIcon, X as XIcon } from 'lucide-react'

const inputCls = "w-full px-3 py-2.5 text-sm font-sans font-light border border-border bg-ivory text-charcoal placeholder:text-pebble focus:outline-none focus:border-charcoal"

// ─── Announcement Bar ─────────────────────────────────────────────────────────

interface AnnouncementItem { id: string; text: string; active: boolean }

const INIT_ANNOUNCE: AnnouncementItem[] = [
  { id: '1', text: 'Ücretsiz Kargo — 500 TL Üzeri Siparişlerde | Güvenli Ödeme', active: true  },
  { id: '2', text: 'Yeni Koleksiyon: Scarlet Romance — Keşfet →',                 active: false },
]

// ─── Hero Banner ──────────────────────────────────────────────────────────────

interface HeroItem { id: string; title: string; subtitle: string; ctaText: string; ctaLink: string; active: boolean }

const INIT_HEROES: HeroItem[] = [
  { id: '1', title: 'Sessiz Lüks', subtitle: 'Özenle seçilmiş premium iç giyim', ctaText: 'Keşfet', ctaLink: '/koleksiyonlar', active: true },
]

export default function KampanyalarPage() {
  const [announces, setAnnounces] = useState<AnnouncementItem[]>(INIT_ANNOUNCE)
  const [heroes, setHeroes]       = useState<HeroItem[]>(INIT_HEROES)
  const [editAnn, setEditAnn]     = useState<string | null>(null)
  const [newAnnText, setNewAnnText] = useState('')
  const [showAnnForm, setShowAnnForm] = useState(false)

  // Popup state
  const [popupTitle, setPopupTitle] = useState('İlk Alışverişinizde %10 İndirim')
  const [popupDesc, setPopupDesc]   = useState('Bültene üye olun, özel fırsatlardan ilk siz haberdar olun.')
  const [popupActive, setPopupActive] = useState(true)

  return (
    <div className="space-y-8 max-w-5xl">
      <h1 className="font-serif text-3xl text-charcoal">Kampanya Yönetimi</h1>

      {/* ── Duyuru Çubuğu ──────────────────────────────────────────────────── */}
      <section className="bg-warm-white border border-border p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell size={15} strokeWidth={1.5} className="text-gold" />
            <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-stone">Duyuru Çubuğu</h2>
          </div>
          <button
            onClick={() => setShowAnnForm(v => !v)}
            className="flex items-center gap-1.5 text-[11px] font-sans font-medium tracking-widest uppercase text-charcoal hover:text-scarlet transition-colors"
          >
            <Plus size={13} /> Ekle
          </button>
        </div>

        {showAnnForm && (
          <div className="flex gap-3">
            <input
              type="text"
              value={newAnnText}
              onChange={e => setNewAnnText(e.target.value)}
              placeholder="Duyuru metni..."
              className={inputCls}
            />
            <button
              onClick={() => {
                if (!newAnnText.trim()) return
                setAnnounces(as => [...as, { id: String(Date.now()), text: newAnnText, active: true }])
                setNewAnnText(''); setShowAnnForm(false)
              }}
              className="px-4 bg-charcoal text-ivory text-[11px] font-sans font-medium tracking-widest uppercase hover:bg-scarlet transition-colors flex-shrink-0"
            >
              Kaydet
            </button>
            <button onClick={() => setShowAnnForm(false)} className="p-2 text-stone hover:text-charcoal">
              <XIcon size={16} />
            </button>
          </div>
        )}

        <div className="space-y-2">
          {announces.map(a => (
            <div key={a.id} className={`flex items-center gap-4 p-4 border ${a.active ? 'border-charcoal bg-charcoal' : 'border-border'}`}>
              {editAnn === a.id ? (
                <input
                  autoFocus
                  defaultValue={a.text}
                  onBlur={e => {
                    setAnnounces(as => as.map(x => x.id === a.id ? { ...x, text: e.target.value } : x))
                    setEditAnn(null)
                  }}
                  className="flex-1 px-2 py-1 text-sm bg-transparent border-b border-white/50 text-ivory focus:outline-none"
                />
              ) : (
                <p className={`flex-1 text-sm font-sans font-light ${a.active ? 'text-ivory' : 'text-charcoal'}`}>{a.text}</p>
              )}
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => setEditAnn(a.id)} className={`p-1.5 ${a.active ? 'text-ivory/70 hover:text-ivory' : 'text-stone hover:text-charcoal'} transition-colors`}>
                  <Pencil size={13} strokeWidth={1.5} />
                </button>
                <button onClick={() => setAnnounces(as => as.map(x => x.id === a.id ? { ...x, active: !x.active } : x))} className={`p-1.5 ${a.active ? 'text-ivory/70 hover:text-ivory' : 'text-stone hover:text-charcoal'} transition-colors`}>
                  {a.active ? <ToggleRight size={16} strokeWidth={1.5} /> : <ToggleLeft size={16} strokeWidth={1.5} />}
                </button>
                <button onClick={() => setAnnounces(as => as.filter(x => x.id !== a.id))} className={`p-1.5 ${a.active ? 'text-ivory/70 hover:text-scarlet-light' : 'text-stone hover:text-scarlet'} transition-colors`}>
                  <Trash2 size={13} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <section className="bg-warm-white border border-border p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <ImageIcon size={15} strokeWidth={1.5} className="text-gold" />
            <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-stone">Hero Banner</h2>
          </div>
        </div>
        {heroes.map(h => (
          <div key={h.id} className="p-5 border border-border bg-cream space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone mb-1.5">Başlık</p>
                <input type="text" defaultValue={h.title} className={inputCls} />
              </div>
              <div>
                <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone mb-1.5">Alt Başlık</p>
                <input type="text" defaultValue={h.subtitle} className={inputCls} />
              </div>
              <div>
                <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone mb-1.5">Buton Metni</p>
                <input type="text" defaultValue={h.ctaText} className={inputCls} />
              </div>
              <div>
                <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone mb-1.5">Buton Linki</p>
                <input type="text" defaultValue={h.ctaLink} className={inputCls} />
              </div>
            </div>
            <div className="border-2 border-dashed border-border p-6 text-center space-y-1">
              <ImageIcon size={20} strokeWidth={1} className="text-pebble mx-auto" />
              <p className="text-xs font-light text-stone">Hero görseli yükleyin (1920×1080 önerilir)</p>
              <button type="button" className="btn-outline text-[11px] mt-1">Görsel Seç</button>
            </div>
            <div className="flex gap-3">
              <button className="btn-primary text-xs">Kaydet</button>
              <label className="flex items-center gap-2 cursor-pointer ml-2">
                <input type="checkbox" defaultChecked={h.active} className="w-4 h-4 accent-charcoal" />
                <span className="text-sm font-sans font-light text-charcoal">Aktif</span>
              </label>
            </div>
          </div>
        ))}
      </section>

      {/* ── Popup ────────────────────────────────────────────────────────────── */}
      <section className="bg-warm-white border border-border p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-stone">E-posta Popup</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-light text-stone">{popupActive ? 'Aktif' : 'Pasif'}</span>
            <button
              onClick={() => setPopupActive(v => !v)}
              className={`transition-colors ${popupActive ? 'text-scarlet' : 'text-pebble'}`}
            >
              {popupActive ? <ToggleRight size={20} strokeWidth={1.5} /> : <ToggleLeft size={20} strokeWidth={1.5} />}
            </button>
          </label>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone mb-1.5">Başlık</p>
            <input type="text" value={popupTitle} onChange={e => setPopupTitle(e.target.value)} className={inputCls} />
          </div>
          <div>
            <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone mb-1.5">Açıklama</p>
            <textarea value={popupDesc} onChange={e => setPopupDesc(e.target.value)} rows={2} className={`${inputCls} resize-none`} />
          </div>
        </div>
        <button className="btn-primary text-xs">Kaydet</button>
      </section>
    </div>
  )
}
