# ScarletX Lingerie — Canlıya Alma Kontrol Listesi

## 1. Environment Variables (Vercel Dashboard → Settings → Environment Variables)

### Zorunlu (şimdi)
- [ ] `NEXTAUTH_SECRET` — `openssl rand -base64 32` ile üret
- [ ] `NEXTAUTH_URL` — `https://scarletxlingerie.com`
- [ ] `DATABASE_URL` — Supabase accelerate URL (prisma://...)
- [ ] `DIRECT_URL` — Supabase doğrudan postgres URL
- [ ] `NEXT_PUBLIC_APP_URL` — `https://scarletxlingerie.com`
- [ ] `NEXT_PUBLIC_BASE_URL` — `https://scarletxlingerie.com`

### Cloudinary (görsel yükleme)
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`

### Analytics
- [ ] `NEXT_PUBLIC_GTM_ID` — GTM container ID (GTM-XXXXXXX)
- [ ] `NEXT_PUBLIC_META_PIXEL_ID` — Meta Pixel ID
- [ ] `META_PIXEL_ID` — aynı değer (server-side CAPI için)
- [ ] `META_CAPI_ACCESS_TOKEN` — Meta Business Manager'dan

### Ödeme (anlaşma sonrası)
- [ ] `IYZICO_API_KEY`
- [ ] `IYZICO_SECRET_KEY`
- [ ] `IYZICO_BASE_URL` — `https://api.iyzipay.com`

### E-posta (key alındığında)
- [ ] `RESEND_API_KEY`
- [ ] `EMAIL_FROM` — `ScarletX Lingerie <noreply@scarletxlingerie.com>`

---

## 2. Veritabanı

- [ ] Prisma migrate: `npx prisma migrate deploy`
- [ ] Admin kullanıcı oluştur (seed script veya doğrudan DB)
- [ ] Mock datayı gerçek ürünlerle değiştir (`src/lib/mock-data.ts` → DB sorguları)

---

## 3. Domain & SSL (Vercel)

- [ ] Vercel Dashboard → Domains → `scarletxlingerie.com` ekle
- [ ] DNS kayıtları: A veya CNAME → Vercel IP
- [ ] SSL otomatik (Vercel Let's Encrypt) — propagasyon 24-48 saat
- [ ] `www` yönlendirmesi → apex domain

---

## 4. Sosyal Medya & Meta

- [ ] `public/og-image.jpg` yükle (1200×630px) — OG varsayılan görseli
- [ ] `public/logo.png` yükle — Organization JSON-LD için
- [ ] `public/favicon.ico` + `public/apple-icon.png`
- [ ] Facebook Business Manager → Pixel doğrulama → Test Events
- [ ] Google Search Console → Sitemap gönder: `https://scarletxlingerie.com/sitemap.xml`
- [ ] Google Analytics → GA4 property → GTM üzerinden bağla

---

## 5. Güvenlik

- [ ] `NEXTAUTH_SECRET` production'da farklı ve güçlü
- [ ] Admin şifresi bcrypt hash — ilk admin kullanıcı seed'i
- [ ] Rate limiting çalışıyor: `/api/meta-capi` ve `/api/upload` test et
- [ ] Security headers doğrula: `https://securityheaders.com`
- [ ] CSP hataları için browser console kontrol et

---

## 6. Performans & SEO Son Kontrol

- [ ] `npm run build` — hata yok
- [ ] PageSpeed Insights: `https://pagespeed.web.dev` → 90+ hedef
- [ ] Google Rich Results Test: ürün sayfasında Product schema geçiyor
- [ ] robots.txt erişilebilir: `https://scarletxlingerie.com/robots.txt`
- [ ] sitemap.xml erişilebilir: `https://scarletxlingerie.com/sitemap.xml`

---

## 7. E2E Testler

```bash
# Dev server çalışırken:
npm run test:e2e

# Görsel mod:
npm run test:e2e:headed
```

- [ ] Tüm testler geçiyor (homepage, product, collections, checkout)

---

## 8. Canlıya Alma

- [ ] `git push origin main` → Vercel otomatik deploy
- [ ] Vercel deploy log'u hatasız
- [ ] Production URL'de checkout akışı manuel test
- [ ] İlk gerçek sipariş testi (kendi kartınla)
- [ ] Admin paneli `/admin` → giriş çalışıyor

---

## Acil Durum

Bir şey bozulursa → Vercel Dashboard → Deployments → önceki deploy'a "Promote to Production"
