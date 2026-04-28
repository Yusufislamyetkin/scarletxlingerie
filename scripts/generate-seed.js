const XLSX = require('xlsx')
const fs   = require('fs')
const path = require('path')

const wb   = XLSX.readFile(path.join(__dirname, '../SeedData/Shopier-Urunler-20260423.xlsx'))
const ws   = wb.Sheets[wb.SheetNames[0]]
const rows = XLSX.utils.sheet_to_json(ws, { defval: '' })

function toSlug(str) {
  return str.trim()
    .toLowerCase()
    .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
    .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'')
}

function esc(s) {
  return String(s || '').replace(/'/g, "''")
}

function parseVariants(str) {
  if (!str) return []
  return str.trim().split('\n').map(line => {
    const m = line.match(/^(.+?):\s*(\d+)\s*\((\d+(?:\.\d+)?)/)
    if (!m) return null
    return { size: m[1].trim(), stock: parseInt(m[2]), price: parseFloat(m[3]) }
  }).filter(Boolean)
}

function guessCategory(name) {
  const n = name.toLowerCase()
  if (n.includes('tanga'))                        return 'cat-tanga'
  if (n.includes('korse') || n.includes('arzu'))  return 'cat-korse'
  if (n.includes('külot') || n.includes('set'))   return 'cat-kilot'
  return 'cat-takim'
}

const COLOR_MAP = {
  'lacivert': { name: 'Lacivert', hex: '#1E3A5F' },
  'siyah':    { name: 'Siyah',    hex: '#1A1A1A' },
  'mürdüm':   { name: 'Mürdüm',   hex: '#6B2C4A' },
  'pudra':    { name: 'Pudra',    hex: '#E8C4B8' },
  'ten':      { name: 'Ten',      hex: '#D4A896' },
  'mavi':     { name: 'Mavi',     hex: '#3B7FC0' },
  'zümrüt':   { name: 'Zümrüt',   hex: '#10B981' },
  'çilek':    { name: 'Çilek',    hex: '#E8325B' },
  'pembe':    { name: 'Pembe',    hex: '#EC4899' },
  'papatya':  { name: 'Krem',     hex: '#FAF7F2' },
  'kırmızı':  { name: 'Kırmızı',  hex: '#8B0000' },
  'renkli':   { name: 'Çok Renkli', hex: '#C9A96E' },
}

function guessColor(name) {
  const n = name.toLowerCase()
  for (const [k, v] of Object.entries(COLOR_MAP)) {
    if (n.includes(k)) return v
  }
  return { name: 'Siyah', hex: '#1A1A1A' }
}

const lines = []

lines.push('-- ============================================================')
lines.push('-- ScarletX Lingerie — Gerçek Ürün Seed Verisi (Shopier Export)')
lines.push('-- setup.sql çalıştıktan SONRA bu dosyayı çalıştır')
lines.push('-- ============================================================')
lines.push('')

// Admin
lines.push('-- ─── Admin Kullanıcı ────────────────────────────────────────────────────────')
lines.push(`INSERT INTO "users" ("id","email","password","name","role","createdAt","updatedAt")`)
lines.push(`VALUES (`)
lines.push(`  'admin-scarletx-001',`)
lines.push(`  'admin@scarletxlingerie.com',`)
lines.push(`  '$2b$12$pMZAWujZPOPwnWLnAY6QOOIRHLuOK187Uh62qmrw4hwt4LXVtQC8q',`)
lines.push(`  'Admin', 'ADMIN', NOW(), NOW()`)
lines.push(`)`)
lines.push(`ON CONFLICT ("email") DO UPDATE`)
lines.push(`  SET "password" = EXCLUDED."password", "role" = 'ADMIN', "updatedAt" = NOW();`)
lines.push('')

// Kategoriler
lines.push('-- ─── Kategoriler ─────────────────────────────────────────────────────────────')
lines.push(`INSERT INTO "categories" ("id","slug","name","order","isActive","createdAt","updatedAt") VALUES`)
lines.push(`  ('cat-kilot','kilot','Külot',1,TRUE,NOW(),NOW()),`)
lines.push(`  ('cat-tanga','tanga','Tanga',2,TRUE,NOW(),NOW()),`)
lines.push(`  ('cat-takim','takim','Takım',3,TRUE,NOW(),NOW()),`)
lines.push(`  ('cat-korse','korse','Korse',4,TRUE,NOW(),NOW())`)
lines.push(`ON CONFLICT ("slug") DO NOTHING;`)
lines.push('')

// Koleksiyonlar
lines.push('-- ─── Koleksiyonlar ───────────────────────────────────────────────────────────')
lines.push(`INSERT INTO "collections" ("id","slug","name","description","image","isActive","order","createdAt","updatedAt") VALUES`)
lines.push(`  ('col-gunluk','gunluk-premium','Günlük Premium','Günlük konfor, premium his. ScarletX iç giyim koleksiyonu.','https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800',TRUE,1,NOW(),NOW()),`)
lines.push(`  ('col-nokturn','nokturn','Nokturn','Gecenin ruhuyla tasarlanan set ve takım koleksiyonu.','https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800',TRUE,2,NOW(),NOW())`)
lines.push(`ON CONFLICT ("slug") DO NOTHING;`)
lines.push('')

// Ürünler
lines.push('-- ─── Ürünler ─────────────────────────────────────────────────────────────────')
const productRows = rows.map((row, i) => {
  const id   = `prod-sx-${String(i+1).padStart(2,'0')}`
  const name = row['Ürün Adı'].trim()
  const slug = toSlug(name)
  const desc = esc(row['Ürün Açıklaması'].replace(/\r/g,' ').replace(/\n/g,' ').trim())
  const cat  = guessCategory(name)
  const col  = (cat === 'cat-kilot' || cat === 'cat-tanga') ? 'col-gunluk' : 'col-nokturn'
  const isFeatured = i < 6  // ilk 6 ürün öne çıkan
  const tags = cat === 'cat-kilot'  ? `ARRAY['külot','günlük','premium']`
             : cat === 'cat-tanga'  ? `ARRAY['tanga','premium']`
             : cat === 'cat-korse'  ? `ARRAY['korse','gece','transparan']`
             : `ARRAY['takım','set','gece','dantel']`
  return `  ('${id}','${slug}','${esc(name)}','${desc}','${cat}','${col}',${isFeatured},TRUE,TRUE,${tags},NOW(),NOW())`
})

lines.push(`INSERT INTO "products" ("id","slug","name","description","categoryId","collectionId","isFeatured","isNew","isActive","tags","createdAt","updatedAt") VALUES`)
lines.push(productRows.join(',\n'))
lines.push(`ON CONFLICT ("slug") DO NOTHING;`)
lines.push('')

// Varyantlar
lines.push('-- ─── Ürün Varyantları ────────────────────────────────────────────────────────')
const variantRows = []

rows.forEach((row, i) => {
  const prodId     = `prod-sx-${String(i+1).padStart(2,'0')}`
  const name       = row['Ürün Adı'].trim()
  const origPrice  = parseFloat(String(row['Orijinal Fiyat']).replace(',','.')) || 0
  const discStr    = row['İndirimli Fiyat']
  const discPrice  = discStr ? parseFloat(String(discStr).replace(',','.')) : null
  const finalPrice = discPrice || origPrice
  const comparePr  = discPrice ? origPrice : null
  const color      = guessColor(name)
  const variants   = parseVariants(row['Varyasyonlar'])
  const totalStock = parseInt(row['Stok Adedi']) || 0
  const slugPart   = toSlug(name).slice(0,6).toUpperCase().replace(/-/g,'')

  if (variants.length > 0) {
    variants.forEach((v, vi) => {
      const varId = `${prodId}-v${vi+1}`
      const sku   = `SX-${slugPart}-${v.size.replace(/\s/g,'').toUpperCase()}-${i+1}`
      const cp    = comparePr !== null ? comparePr : 'NULL'
      variantRows.push(`  ('${varId}','${prodId}','${esc(sku)}','${esc(v.size)}','${esc(color.name)}','${color.hex}',${v.price},${cp},${v.stock},ARRAY[]::TEXT[],TRUE,NOW(),NOW())`)
    })
  } else {
    const varId = `${prodId}-v1`
    const sku   = `SX-${slugPart}-OS-${i+1}`
    const cp    = comparePr !== null ? comparePr : 'NULL'
    variantRows.push(`  ('${varId}','${prodId}','${esc(sku)}','Tek Ebat','${esc(color.name)}','${color.hex}',${finalPrice},${cp},${totalStock},ARRAY[]::TEXT[],TRUE,NOW(),NOW())`)
  }
})

lines.push(`INSERT INTO "product_variants" ("id","productId","sku","size","color","colorHex","price","compareAtPrice","stock","images","isActive","createdAt","updatedAt") VALUES`)
lines.push(variantRows.join(',\n'))
lines.push(`ON CONFLICT ("sku") DO NOTHING;`)
lines.push('')

// Kuponlar
lines.push('-- ─── Kuponlar ────────────────────────────────────────────────────────────────')
lines.push(`INSERT INTO "coupons" ("id","code","type","value","minOrderAmount","isFirstOrderOnly","isActive","createdAt","updatedAt") VALUES`)
lines.push(`  ('cpn-001','SCARLET10','PERCENTAGE',10,500,FALSE,TRUE,NOW(),NOW()),`)
lines.push(`  ('cpn-002','ILKALIM','FIXED',150,NULL,TRUE,TRUE,NOW(),NOW()),`)
lines.push(`  ('cpn-003','HOSGELDIN','FIXED',200,1000,TRUE,TRUE,NOW(),NOW())`)
lines.push(`ON CONFLICT ("code") DO NOTHING;`)
lines.push('')

// Duyuru
lines.push('-- ─── Duyuru Çubuğu ──────────────────────────────────────────────────────────')
lines.push(`INSERT INTO "announcement_bars" ("id","text","link","bgColor","textColor","isActive","order","createdAt","updatedAt") VALUES`)
lines.push(`  ('ann-001','🚚 500 TL ve üzeri alışverişlerinizde ücretsiz kargo','/koleksiyonlar','#1A1A1A','#C9A96E',TRUE,1,NOW(),NOW())`)
lines.push(`ON CONFLICT DO NOTHING;`)

fs.writeFileSync(path.join(__dirname, '../prisma/seed.sql'), lines.join('\n'), 'utf8')
console.log('✅ seed.sql oluşturuldu')
console.log('   Ürün sayısı    :', rows.length)
console.log('   Varyant sayısı :', variantRows.length)
rows.forEach((r, i) => console.log(`   ${String(i+1).padStart(2)} - ${r['Ürün Adı'].trim()}`))
