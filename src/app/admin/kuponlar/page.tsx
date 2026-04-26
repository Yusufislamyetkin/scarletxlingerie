'use client'

import { useState } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { formatDate } from '@/lib/utils/format'

interface Coupon {
  id: string; code: string; type: 'pct' | 'fixed'; value: number
  minOrder?: number; maxUses?: number; usedCount: number
  tiers: string[]; firstOrderOnly: boolean; expiresAt?: string; active: boolean
}

const INIT: Coupon[] = [
  { id: '1', code: 'SCARLET10', type: 'pct',   value: 10,  minOrder: undefined, maxUses: undefined, usedCount: 48, tiers: [], firstOrderOnly: false, expiresAt: '2026-12-31', active: true  },
  { id: '2', code: 'ILKALIM',   type: 'fixed',  value: 150, minOrder: 500,       maxUses: 100,       usedCount: 23, tiers: [], firstOrderOnly: true,  expiresAt: '2026-06-30', active: true  },
  { id: '3', code: 'HOSGELDIN', type: 'fixed',  value: 200, minOrder: 500,       maxUses: 50,        usedCount: 50, tiers: [], firstOrderOnly: true,  expiresAt: undefined,    active: false },
]

const inputCls = "w-full px-3 py-2 text-sm font-sans font-light border border-border bg-ivory text-charcoal placeholder:text-pebble focus:outline-none focus:border-charcoal"

export default function KuponlarPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(INIT)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', type: 'pct' as 'pct' | 'fixed', value: '', minOrder: '', firstOnly: false })

  const toggle = (id: string) =>
    setCoupons(cs => cs.map(c => c.id === id ? { ...c, active: !c.active } : c))

  const remove = (id: string) =>
    setCoupons(cs => cs.filter(c => c.id !== id))

  const save = () => {
    if (!form.code || !form.value) return
    setCoupons(cs => [...cs, {
      id: String(Date.now()), code: form.code.toUpperCase(), type: form.type,
      value: Number(form.value), minOrder: form.minOrder ? Number(form.minOrder) : undefined,
      maxUses: undefined, usedCount: 0, tiers: [], firstOrderOnly: form.firstOnly,
      active: true,
    }])
    setForm({ code: '', type: 'pct', value: '', minOrder: '', firstOnly: false })
    setShowForm(false)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Kupon Kodları</h1>
          <p className="text-sm font-light text-stone mt-1">{coupons.filter(c => c.active).length} aktif kupon</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-2 btn-primary text-xs">
          <Plus size={14} />Yeni Kupon
        </button>
      </div>

      {/* Yeni kupon formu */}
      {showForm && (
        <div className="bg-warm-white border border-border p-6 space-y-4">
          <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-stone pb-3 border-b border-border">Yeni Kupon</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone mb-1.5">Kod *</p>
              <input type="text" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className={inputCls} placeholder="YENIYIL25" />
            </div>
            <div>
              <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone mb-1.5">Tür</p>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as 'pct' | 'fixed' }))} className={inputCls}>
                <option value="pct">Yüzde (%)</option>
                <option value="fixed">Sabit (₺)</option>
              </select>
            </div>
            <div>
              <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone mb-1.5">Değer *</p>
              <input type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} className={inputCls} placeholder={form.type === 'pct' ? '10' : '150'} />
            </div>
            <div>
              <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone mb-1.5">Min. Sipariş (₺)</p>
              <input type="number" value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))} className={inputCls} placeholder="500" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.firstOnly} onChange={e => setForm(f => ({ ...f, firstOnly: e.target.checked }))} className="w-4 h-4 accent-charcoal" />
            <span className="text-sm font-sans font-light text-charcoal">Sadece ilk alışverişe özel</span>
          </label>
          <div className="flex gap-3">
            <button onClick={save} className="btn-primary text-xs">Kaydet</button>
            <button onClick={() => setShowForm(false)} className="btn-outline text-xs">İptal</button>
          </div>
        </div>
      )}

      {/* Tablo */}
      <div className="bg-warm-white border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-cream">
              {['Kod', 'Tür', 'Değer', 'Min Sipariş', 'Kullanım', 'Son Kullanım', 'Durum', ''].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-sans font-medium tracking-widest uppercase text-stone first:pl-6 last:pr-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {coupons.map(c => (
              <tr key={c.id} className={`hover:bg-cream/40 transition-colors ${!c.active ? 'opacity-50' : ''}`}>
                <td className="px-6 py-4 font-sans font-medium text-charcoal tracking-wider">{c.code}</td>
                <td className="px-5 py-4 font-light text-stone text-xs">{c.type === 'pct' ? 'Yüzde' : 'Sabit'}</td>
                <td className="px-5 py-4 font-sans font-medium text-charcoal">{c.type === 'pct' ? `%${c.value}` : `₺${c.value}`}</td>
                <td className="px-5 py-4 font-light text-stone text-xs">{c.minOrder ? `₺${c.minOrder}` : '—'}</td>
                <td className="px-5 py-4 font-light text-charcoal text-xs">{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ''}</td>
                <td className="px-5 py-4 text-xs font-light text-stone">{c.expiresAt ? formatDate(c.expiresAt) : '—'}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-0.5 text-[10px] font-sans font-medium tracking-widest uppercase ${c.active ? 'bg-scarlet/10 text-scarlet' : 'bg-pebble/15 text-pebble'}`}>
                    {c.active ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => toggle(c.id)} className="p-1.5 text-stone hover:text-charcoal transition-colors" title={c.active ? 'Pasife Al' : 'Aktife Al'}>
                      {c.active ? <ToggleRight size={16} strokeWidth={1.5} /> : <ToggleLeft size={16} strokeWidth={1.5} />}
                    </button>
                    <button onClick={() => remove(c.id)} className="p-1.5 text-stone hover:text-scarlet transition-colors">
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
