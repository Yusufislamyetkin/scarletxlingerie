-- ============================================================
-- ScarletX Lingerie — Seed Data
-- Supabase SQL Editor'de çalıştır
-- setup.sql çalıştırıldıktan SONRA bu dosyayı çalıştır
-- ============================================================

-- ─── Admin Kullanıcı ──────────────────────────────────────────────────────────
-- Şifre: Admin1234!  (bcrypt, 12 rounds)
INSERT INTO "users" ("id","email","password","name","role","createdAt","updatedAt")
VALUES (
  'admin-scarletx-001',
  'admin@scarletxlingerie.com',
  '$2b$12$pMZAWujZPOPwnWLnAY6QOOIRHLuOK187Uh62qmrw4hwt4LXVtQC8q',
  'Admin',
  'ADMIN',
  NOW(), NOW()
)
ON CONFLICT ("email") DO UPDATE
  SET "password"  = EXCLUDED."password",
      "role"      = 'ADMIN',
      "updatedAt" = NOW();

-- ─── Kategoriler ──────────────────────────────────────────────────────────────
INSERT INTO "categories" ("id","slug","name","description","order","isActive","createdAt","updatedAt") VALUES
  ('cat-sutyen',   'sutyen',   'Sütyen',   'Tüm sütyen modelleri',   1, TRUE, NOW(), NOW()),
  ('cat-takim',    'takim',    'Takım',    'İç çamaşır takımları',   2, TRUE, NOW(), NOW()),
  ('cat-kilot',    'kilot',    'Kilot',    'Kilot ve string modeller',3, TRUE, NOW(), NOW()),
  ('cat-gecelik',  'gecelik',  'Gecelik',  'Gecelik ve sabahlık',    4, TRUE, NOW(), NOW()),
  ('cat-korse',    'korse',    'Korse',    'Korse ve bustiyeler',     5, TRUE, NOW(), NOW()),
  ('cat-corap',    'corap',    'Çorap',    'Çorap ve jartiyer',       6, TRUE, NOW(), NOW())
ON CONFLICT ("slug") DO NOTHING;

-- ─── Koleksiyonlar ────────────────────────────────────────────────────────────
INSERT INTO "collections" ("id","slug","name","description","image","seoTitle","seoDescription","isActive","order","createdAt","updatedAt") VALUES
  (
    'col-rouge-noir',
    'rouge-noir',
    'Rouge Noir',
    'Koyu kırmızı ve siyah tonlarında tutkuyla tasarlanmış koleksiyon.',
    'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800',
    'Rouge Noir Koleksiyonu | ScarletX',
    'Kırmızı ve siyah tonlarda lüks iç giyim koleksiyonu.',
    TRUE, 1, NOW(), NOW()
  ),
  (
    'col-blanc-ivoire',
    'blanc-ivoire',
    'Blanc Ivoire',
    'Fildişi ve beyaz tonlarda saf zarafet.',
    'https://images.unsplash.com/photo-1616170580895-95af91f4abe2?w=800',
    'Blanc Ivoire Koleksiyonu | ScarletX',
    'Fildişi ve beyaz tonlarda saf ve zarif iç giyim.',
    TRUE, 2, NOW(), NOW()
  ),
  (
    'col-velvet-noir',
    'velvet-noir',
    'Velvet Noir',
    'Kadife dokular ve derin siyah tonlarında gece cazibesi.',
    'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800',
    'Velvet Noir Koleksiyonu | ScarletX',
    'Kadife dokularla hazırlanmış premium gece koleksiyonu.',
    TRUE, 3, NOW(), NOW()
  ),
  (
    'col-bridal',
    'bridal',
    'Bridal',
    'Özel günler için tasarlanmış gelin koleksiyonu.',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
    'Bridal Koleksiyonu | ScarletX',
    'Gelinler için özel tasarım premium iç giyim koleksiyonu.',
    TRUE, 4, NOW(), NOW()
  )
ON CONFLICT ("slug") DO NOTHING;

-- ─── Ürünler ──────────────────────────────────────────────────────────────────
INSERT INTO "products" (
  "id","slug","name","description",
  "categoryId","collectionId",
  "material","careInstructions","modelMeasurements",
  "isFeatured","isNew","isActive","tags",
  "seoTitle","seoDescription",
  "createdAt","updatedAt"
) VALUES
  -- 1. Dantel Balkonnet Sütyen
  (
    'prod-001', 'dantel-balkonnet-sutyen',
    'Dantel Balkonnet Sütyen',
    'İnce dantel işlemeleri ve balkonnet kesimli tasarımı ile feminen duruşu ön plana çıkaran bu sütyen, her gün rahatlıkla kullanılabilir.',
    'cat-sutyen', 'col-rouge-noir',
    '%80 Polyamid, %20 Elastan',
    '30°C''de hassas yıkama, makinede yıkamayın.',
    '174 cm / 90C',
    TRUE, TRUE, TRUE,
    ARRAY['dantel','sutyen','balkonnet','kırmızı'],
    'Dantel Balkonnet Sütyen | ScarletX',
    'Premium dantel balkonnet sütyen. Feminen kesim ve lüks malzeme.',
    NOW(), NOW()
  ),
  -- 2. Silk Touch Gecelik
  (
    'prod-002', 'silk-touch-gecelik',
    'Silk Touch Gecelik',
    'İpek dokulu saten kumaşı ile vücuda nazikçe sarılan bu gecelik, her ölçüde mükemmel bir düşüş sunar.',
    'cat-gecelik', 'col-blanc-ivoire',
    '%100 Saten (Polyester bazlı)',
    '30°C''de hassas yıkama, tersine çevirerek yıkayın.',
    '174 cm / S',
    TRUE, TRUE, TRUE,
    ARRAY['gecelik','saten','beyaz','minimalist'],
    'Silk Touch Gecelik | ScarletX',
    'İpek dokulu saten gecelik. Zarif kesim ve premium konfor.',
    NOW(), NOW()
  ),
  -- 3. Velvet Korse
  (
    'prod-003', 'velvet-korse',
    'Velvet Korse',
    'Kadife dokusu ve iskelet yapısıyla silueti mükemmel şekillendiren bu korse, gece davetleri için ideal.',
    'cat-korse', 'col-velvet-noir',
    '%70 Polyester Kadife, %30 Elastan',
    'Kuru temizleme önerilir.',
    '174 cm / M',
    TRUE, FALSE, TRUE,
    ARRAY['korse','kadife','siyah','gece'],
    'Velvet Korse | ScarletX',
    'Kadife korse, mükemmel siluet ve lüks dokunuş.',
    NOW(), NOW()
  ),
  -- 4. Bridal Dantel Takım
  (
    'prod-004', 'bridal-dantel-takim',
    'Bridal Dantel Takım',
    'Fransız danteli ve ipek kurdelesi ile süslenmiş bu özel gün takımı, en özel anınız için tasarlandı.',
    'cat-takim', 'col-bridal',
    '%90 Fransız Danteli, %10 Elastan',
    '30°C''de hassas yıkama, özel çamaşır torbası kullanın.',
    '174 cm / S-M',
    TRUE, TRUE, TRUE,
    ARRAY['takım','bridal','dantel','gelin','beyaz'],
    'Bridal Dantel Takım | ScarletX',
    'Özel gün için Fransız dantelinden hazırlanmış gelin takımı.',
    NOW(), NOW()
  ),
  -- 5. Micro Fiber Kilot
  (
    'prod-005', 'micro-fiber-kilot',
    'Micro Fiber Kilot',
    'Ultra ince mikro fiber dokusu ile neredeyse hissedilmez konfor. Dar kıyafetler altında görünmez çizgi garantisi.',
    'cat-kilot', 'col-rouge-noir',
    '%95 Mikro Polyamid, %5 Elastan',
    '30°C''de makinede yıkayın.',
    NULL,
    FALSE, TRUE, TRUE,
    ARRAY['kilot','micro','seamless','günlük'],
    'Micro Fiber Kilot | ScarletX',
    'Görünmez ve ultra ince micro fiber kilot.',
    NOW(), NOW()
  ),
  -- 6. Jartiyer Çorap Seti
  (
    'prod-006', 'jartiyer-corap-seti',
    'Jartiyer & Çorap Seti',
    'Dantel kenar detaylı bu çorap seti, eşleşen jartiyer kemeriyle birlikte gelir. Velvet Noir koleksiyonunun vazgeçilmezi.',
    'cat-corap', 'col-velvet-noir',
    'Çorap: %85 Naylon, %15 Elastan | Jartiyer: %90 Polyamid, %10 Elastan',
    '30°C''de hassas yıkama.',
    NULL,
    FALSE, TRUE, TRUE,
    ARRAY['çorap','jartiyer','dantel','siyah','set'],
    'Jartiyer & Çorap Seti | ScarletX',
    'Dantel çorap ve jartiyer kemer seti, Velvet Noir koleksiyonu.',
    NOW(), NOW()
  ),
  -- 7. Push-Up Sütyen
  (
    'prod-007', 'push-up-sutyen',
    'Push-Up Sütyen',
    'Özel dolgulu tasarımı ile doğal görünümlü dolgunluk sağlayan bu push-up sütyen, tüm gün konforunu korur.',
    'cat-sutyen', 'col-blanc-ivoire',
    '%75 Polyamid, %25 Elastan',
    '30°C''de hassas yıkama.',
    '174 cm / 75B',
    FALSE, FALSE, TRUE,
    ARRAY['sutyen','push-up','fildişi','günlük'],
    'Push-Up Sütyen | ScarletX',
    'Doğal görünümlü dolgunluk için premium push-up sütyen.',
    NOW(), NOW()
  ),
  -- 8. Saten Kimono
  (
    'prod-008', 'saten-kimono',
    'Saten Kimono',
    'Uzun kesimi ve bel kuşağıyla mükemmel bir ev giyimi deneyimi sunan bu kimono, gecelik koleksiyonumuzun başyapıtı.',
    'cat-gecelik', 'col-velvet-noir',
    '%100 Saten',
    '30°C''de hassas yıkama.',
    '174 cm / S-M',
    TRUE, FALSE, TRUE,
    ARRAY['kimono','saten','ev giyimi','lüks'],
    'Saten Kimono | ScarletX',
    'Zarif saten kimono, premium ev giyimi deneyimi.',
    NOW(), NOW()
  )
ON CONFLICT ("slug") DO NOTHING;

-- ─── Ürün Varyantları ─────────────────────────────────────────────────────────

-- prod-001: Dantel Balkonnet Sütyen
INSERT INTO "product_variants" ("id","productId","sku","size","color","colorHex","price","compareAtPrice","stock","images","isActive","createdAt","updatedAt") VALUES
  ('var-001-1','prod-001','SX-DBR-70B-KRM','70B','Kırmızı','#8B0000', 1290, 1590, 8,
   ARRAY['https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600'], TRUE, NOW(), NOW()),
  ('var-001-2','prod-001','SX-DBR-75B-KRM','75B','Kırmızı','#8B0000', 1290, 1590, 12,
   ARRAY['https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600'], TRUE, NOW(), NOW()),
  ('var-001-3','prod-001','SX-DBR-80B-KRM','80B','Kırmızı','#8B0000', 1290, 1590, 6,
   ARRAY['https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600'], TRUE, NOW(), NOW()),
  ('var-001-4','prod-001','SX-DBR-75B-SYH','75B','Siyah','#1A1A1A', 1290, 1590, 10,
   ARRAY['https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600'], TRUE, NOW(), NOW()),
  ('var-001-5','prod-001','SX-DBR-80B-SYH','80B','Siyah','#1A1A1A', 1290, 1590, 7,
   ARRAY['https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600'], TRUE, NOW(), NOW())
ON CONFLICT ("sku") DO NOTHING;

-- prod-002: Silk Touch Gecelik
INSERT INTO "product_variants" ("id","productId","sku","size","color","colorHex","price","compareAtPrice","stock","images","isActive","createdAt","updatedAt") VALUES
  ('var-002-1','prod-002','SX-STG-S-FLD','S','Fildişi','#FAF7F2', 2490, 2990, 5,
   ARRAY['https://images.unsplash.com/photo-1616170580895-95af91f4abe2?w=600'], TRUE, NOW(), NOW()),
  ('var-002-2','prod-002','SX-STG-M-FLD','M','Fildişi','#FAF7F2', 2490, 2990, 8,
   ARRAY['https://images.unsplash.com/photo-1616170580895-95af91f4abe2?w=600'], TRUE, NOW(), NOW()),
  ('var-002-3','prod-002','SX-STG-L-FLD','L','Fildişi','#FAF7F2', 2490, 2990, 6,
   ARRAY['https://images.unsplash.com/photo-1616170580895-95af91f4abe2?w=600'], TRUE, NOW(), NOW()),
  ('var-002-4','prod-002','SX-STG-S-GRI','S','Gri','#9C9490', 2490, 2990, 4,
   ARRAY['https://images.unsplash.com/photo-1616170580895-95af91f4abe2?w=600'], TRUE, NOW(), NOW()),
  ('var-002-5','prod-002','SX-STG-M-GRI','M','Gri','#9C9490', 2490, 2990, 7,
   ARRAY['https://images.unsplash.com/photo-1616170580895-95af91f4abe2?w=600'], TRUE, NOW(), NOW())
ON CONFLICT ("sku") DO NOTHING;

-- prod-003: Velvet Korse
INSERT INTO "product_variants" ("id","productId","sku","size","color","colorHex","price","compareAtPrice","stock","images","isActive","createdAt","updatedAt") VALUES
  ('var-003-1','prod-003','SX-VLK-XS-SYH','XS','Siyah','#1A1A1A', 3290, NULL, 4,
   ARRAY['https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600'], TRUE, NOW(), NOW()),
  ('var-003-2','prod-003','SX-VLK-S-SYH','S','Siyah','#1A1A1A', 3290, NULL, 7,
   ARRAY['https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600'], TRUE, NOW(), NOW()),
  ('var-003-3','prod-003','SX-VLK-M-SYH','M','Siyah','#1A1A1A', 3290, NULL, 5,
   ARRAY['https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600'], TRUE, NOW(), NOW()),
  ('var-003-4','prod-003','SX-VLK-L-SYH','L','Siyah','#1A1A1A', 3290, NULL, 3,
   ARRAY['https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600'], TRUE, NOW(), NOW())
ON CONFLICT ("sku") DO NOTHING;

-- prod-004: Bridal Dantel Takım
INSERT INTO "product_variants" ("id","productId","sku","size","color","colorHex","price","compareAtPrice","stock","images","isActive","createdAt","updatedAt") VALUES
  ('var-004-1','prod-004','SX-BDT-XS-BYZ','XS','Beyaz','#FFFFFF', 4290, 4990, 3,
   ARRAY['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600'], TRUE, NOW(), NOW()),
  ('var-004-2','prod-004','SX-BDT-S-BYZ','S','Beyaz','#FFFFFF', 4290, 4990, 6,
   ARRAY['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600'], TRUE, NOW(), NOW()),
  ('var-004-3','prod-004','SX-BDT-M-BYZ','M','Beyaz','#FFFFFF', 4290, 4990, 5,
   ARRAY['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600'], TRUE, NOW(), NOW()),
  ('var-004-4','prod-004','SX-BDT-S-FLD','S','Fildişi','#FAF7F2', 4290, 4990, 4,
   ARRAY['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600'], TRUE, NOW(), NOW())
ON CONFLICT ("sku") DO NOTHING;

-- prod-005: Micro Fiber Kilot
INSERT INTO "product_variants" ("id","productId","sku","size","color","colorHex","price","compareAtPrice","stock","images","isActive","createdAt","updatedAt") VALUES
  ('var-005-1','prod-005','SX-MFK-XS-SYH','XS','Siyah','#1A1A1A', 390, 490, 25,
   ARRAY['https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?w=600'], TRUE, NOW(), NOW()),
  ('var-005-2','prod-005','SX-MFK-S-SYH','S','Siyah','#1A1A1A', 390, 490, 30,
   ARRAY['https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?w=600'], TRUE, NOW(), NOW()),
  ('var-005-3','prod-005','SX-MFK-M-SYH','M','Siyah','#1A1A1A', 390, 490, 28,
   ARRAY['https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?w=600'], TRUE, NOW(), NOW()),
  ('var-005-4','prod-005','SX-MFK-S-KRM','S','Kırmızı','#8B0000', 390, 490, 20,
   ARRAY['https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?w=600'], TRUE, NOW(), NOW()),
  ('var-005-5','prod-005','SX-MFK-M-KRM','M','Kırmızı','#8B0000', 390, 490, 18,
   ARRAY['https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?w=600'], TRUE, NOW(), NOW()),
  ('var-005-6','prod-005','SX-MFK-S-FLD','S','Fildişi','#FAF7F2', 390, 490, 22,
   ARRAY['https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?w=600'], TRUE, NOW(), NOW())
ON CONFLICT ("sku") DO NOTHING;

-- prod-006: Jartiyer & Çorap Seti
INSERT INTO "product_variants" ("id","productId","sku","size","color","colorHex","price","compareAtPrice","stock","images","isActive","createdAt","updatedAt") VALUES
  ('var-006-1','prod-006','SX-JCS-OS-SYH','Tek Ebat','Siyah','#1A1A1A', 890, 1090, 15,
   ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600'], TRUE, NOW(), NOW()),
  ('var-006-2','prod-006','SX-JCS-OS-KRM','Tek Ebat','Kırmızı','#8B0000', 890, 1090, 10,
   ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600'], TRUE, NOW(), NOW())
ON CONFLICT ("sku") DO NOTHING;

-- prod-007: Push-Up Sütyen
INSERT INTO "product_variants" ("id","productId","sku","size","color","colorHex","price","compareAtPrice","stock","images","isActive","createdAt","updatedAt") VALUES
  ('var-007-1','prod-007','SX-PUS-70B-FLD','70B','Fildişi','#FAF7F2', 990, 1290, 9,
   ARRAY['https://images.unsplash.com/photo-1616170580895-95af91f4abe2?w=600'], TRUE, NOW(), NOW()),
  ('var-007-2','prod-007','SX-PUS-75B-FLD','75B','Fildişi','#FAF7F2', 990, 1290, 12,
   ARRAY['https://images.unsplash.com/photo-1616170580895-95af91f4abe2?w=600'], TRUE, NOW(), NOW()),
  ('var-007-3','prod-007','SX-PUS-80B-FLD','80B','Fildişi','#FAF7F2', 990, 1290, 8,
   ARRAY['https://images.unsplash.com/photo-1616170580895-95af91f4abe2?w=600'], TRUE, NOW(), NOW()),
  ('var-007-4','prod-007','SX-PUS-75B-BEJ','75B','Bej','#C9A96E', 990, 1290, 10,
   ARRAY['https://images.unsplash.com/photo-1616170580895-95af91f4abe2?w=600'], TRUE, NOW(), NOW())
ON CONFLICT ("sku") DO NOTHING;

-- prod-008: Saten Kimono
INSERT INTO "product_variants" ("id","productId","sku","size","color","colorHex","price","compareAtPrice","stock","images","isActive","createdAt","updatedAt") VALUES
  ('var-008-1','prod-008','SX-STK-S-SYH','S','Siyah','#1A1A1A', 2890, 3490, 6,
   ARRAY['https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600'], TRUE, NOW(), NOW()),
  ('var-008-2','prod-008','SX-STK-M-SYH','M','Siyah','#1A1A1A', 2890, 3490, 8,
   ARRAY['https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600'], TRUE, NOW(), NOW()),
  ('var-008-3','prod-008','SX-STK-L-SYH','L','Siyah','#1A1A1A', 2890, 3490, 5,
   ARRAY['https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600'], TRUE, NOW(), NOW()),
  ('var-008-4','prod-008','SX-STK-M-KRM','M','Kırmızı','#8B0000', 2890, 3490, 4,
   ARRAY['https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600'], TRUE, NOW(), NOW())
ON CONFLICT ("sku") DO NOTHING;

-- ─── Kuponlar ─────────────────────────────────────────────────────────────────
INSERT INTO "coupons" ("id","code","type","value","minOrderAmount","isFirstOrderOnly","isActive","createdAt","updatedAt") VALUES
  ('cpn-001', 'SCARLET10',  'PERCENTAGE', 10,  500,  FALSE, TRUE, NOW(), NOW()),
  ('cpn-002', 'ILKALIM',    'FIXED',      150, NULL, TRUE,  TRUE, NOW(), NOW()),
  ('cpn-003', 'HOSGELDIN',  'FIXED',      200, 1000, TRUE,  TRUE, NOW(), NOW()),
  ('cpn-004', 'VIP20',      'PERCENTAGE', 20,  2000, FALSE, TRUE, NOW(), NOW())
ON CONFLICT ("code") DO NOTHING;

-- ─── Duyuru Çubuğu ────────────────────────────────────────────────────────────
INSERT INTO "announcement_bars" ("id","text","link","bgColor","textColor","isActive","order","createdAt","updatedAt") VALUES
  ('ann-001', '🚚 500 TL ve üzeri alışverişlerinizde ücretsiz kargo', '/kargo', '#1A1A1A', '#C9A96E', TRUE,  1, NOW(), NOW()),
  ('ann-002', '✨ Yeni koleksiyon: Rouge Noir — Keşfet', '/koleksiyonlar/rouge-noir', '#8B0000', '#FAF7F2', FALSE, 2, NOW(), NOW()),
  ('ann-003', 'İlk alışverişinizde %10 indirim — Kod: SCARLET10', '/koleksiyonlar', '#2D2D2D', '#C9A96E', FALSE, 3, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ─── Hero Banner ──────────────────────────────────────────────────────────────
INSERT INTO "hero_banners" ("id","title","subtitle","ctaText","ctaLink","image","isActive","order","createdAt","updatedAt") VALUES
  (
    'hero-001',
    'Sessiz Lüksün Adresi',
    'Her dokunuşta kaliteyi hissettiren premium iç giyim koleksiyonları.',
    'Koleksiyonu Keşfet',
    '/koleksiyonlar',
    'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=1600',
    TRUE, 1, NOW(), NOW()
  ),
  (
    'hero-002',
    'Bridal Koleksiyonu',
    'Özel gününüz için tasarlanmış, Fransız dantelinden premium takımlar.',
    'Bridal Koleksiyonunu İncele',
    '/koleksiyonlar/bridal',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600',
    FALSE, 2, NOW(), NOW()
  )
ON CONFLICT DO NOTHING;
