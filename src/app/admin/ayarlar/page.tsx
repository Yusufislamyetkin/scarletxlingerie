export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Ayarlar' }

export default function AyarlarPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-serif text-charcoal mb-1">Ayarlar</h1>
      <p className="text-sm text-stone mb-8">Site genel ayarları</p>

      <div className="space-y-6">
        <Section title="Site Bilgileri">
          <Field label="Site Adı"       value="ScarletX Lingerie" />
          <Field label="İletişim E-posta" value="destek@scarletxlingerie.com" />
          <Field label="Telefon"        value="+90 212 000 00 00" />
        </Section>

        <Section title="Para Birimi & Bölge">
          <Field label="Para Birimi"    value="TRY (₺)" />
          <Field label="Dil"            value="Türkçe" />
          <Field label="Zaman Dilimi"   value="Europe/Istanbul" />
        </Section>

        <Section title="Sipariş Ayarları">
          <Field label="Min. Kargo Ücretsiz" value="1.500 ₺" />
          <Field label="Standart Kargo"      value="149 ₺" />
          <Field label="Ekspres Kargo"       value="249 ₺" />
          <Field label="Hediye Paketi"       value="50 ₺" />
        </Section>
      </div>

      <p className="mt-8 text-xs text-pebble">
        Bu ayarlar şu an statik gösterim modundadır. DB entegrasyonu sonrası düzenlenebilir olacak.
      </p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-border p-6">
      <h2 className="text-xs font-sans font-medium tracking-widest uppercase text-stone mb-4 pb-3 border-b border-border">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="font-light text-stone">{label}</span>
      <span className="font-sans text-charcoal">{value}</span>
    </div>
  )
}
