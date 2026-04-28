'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { mockCollections } from '@/lib/mock-data'

export default function KoleksiyonlarPage() {
  const [cols, setCols]       = useState(mockCollections)
  const [editing, setEditing] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')

  const inputCls = "w-full px-3 py-2 text-sm font-sans font-light border border-border bg-ivory text-charcoal placeholder:text-pebble focus:outline-none focus:border-charcoal"

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Koleksiyonlar</h1>
          <p className="text-sm font-light text-stone mt-1">{cols.length} koleksiyon</p>
        </div>
        <button
          onClick={() => setShowNew(v => !v)}
          className="flex items-center gap-2 btn-primary text-xs"
        >
          <Plus size={14} />
          Yeni Koleksiyon
        </button>
      </div>

      {/* Yeni koleksiyon formu */}
      {showNew && (
        <div className="bg-warm-white border border-border p-6 space-y-4">
          <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-stone pb-3 border-b border-border">
            Yeni Koleksiyon
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone mb-1.5">Ad *</p>
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className={inputCls} placeholder="Koleksiyon adı" />
            </div>
            <div>
              <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone mb-1.5">Açıklama</p>
              <input type="text" value={newDesc} onChange={e => setNewDesc(e.target.value)} className={inputCls} placeholder="Kısa açıklama" />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (!newName.trim()) return
                setCols(cs => [...cs, { id: String(Date.now()), slug: newName.toLowerCase().replace(/\s+/g, '-'), name: newName, description: newDesc, image: '' }])
                setNewName(''); setNewDesc(''); setShowNew(false)
              }}
              className="btn-primary text-xs"
            >
              Kaydet
            </button>
            <button onClick={() => setShowNew(false)} className="btn-outline text-xs">İptal</button>
          </div>
        </div>
      )}

      {/* Liste */}
      <div className="bg-warm-white border border-border divide-y divide-border">
        {cols.map(col => (
          <div key={col.id} className="flex items-center justify-between px-6 py-4">
            {editing === col.id ? (
              <input
                autoFocus
                defaultValue={col.name}
                onBlur={e => {
                  setCols(cs => cs.map(c => c.id === col.id ? { ...c, name: e.target.value } : c))
                  setEditing(null)
                }}
                className="flex-1 mr-4 px-3 py-1.5 text-sm font-sans font-light border border-charcoal bg-ivory text-charcoal focus:outline-none"
              />
            ) : (
              <div>
                <p className="font-sans font-medium text-charcoal">{col.name}</p>
                {col.description && <p className="text-xs font-light text-stone mt-0.5">{col.description}</p>}
              </div>
            )}
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              <button
                onClick={() => setEditing(col.id)}
                className="p-1.5 text-stone hover:text-charcoal transition-colors"
              >
                <Pencil size={14} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setCols(cs => cs.filter(c => c.id !== col.id))}
                className="p-1.5 text-stone hover:text-scarlet transition-colors"
              >
                <Trash2 size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
