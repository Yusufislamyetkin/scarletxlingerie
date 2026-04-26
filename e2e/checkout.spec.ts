import { test, expect } from '@playwright/test'

// Helper: ürün ekleyip checkout'a git
async function addProductAndGoToCheckout(page: import('@playwright/test').Page) {
  await page.goto('/urun/velvet-noir-sutyen')
  await page.locator('button', { hasText: '70B' }).click()
  await page.locator('button', { hasText: /Sepete Ekle/ }).click()
  await expect(page.locator('text=Sepete Eklendi')).toBeVisible({ timeout: 5000 })
  await page.goto('/odeme')
}

test.describe('Checkout Akışı', () => {
  test('boş sepet ile /odeme — yönlendirme uyarısı gösteriyor', async ({ page }) => {
    await page.goto('/odeme')
    await expect(page.locator('text=Sepetiniz Boş')).toBeVisible({ timeout: 5000 })
  })

  test('checkout formu görünür, sepette ürün varken', async ({ page }) => {
    await addProductAndGoToCheckout(page)
    await expect(page.locator('h1', { hasText: 'Teslimat Bilgileri' })).toBeVisible()
    await expect(page.locator('text=Standart Kargo')).toBeVisible()
    await expect(page.locator('button', { hasText: /Güvenli Ödemeye Geç/ })).toBeVisible()
  })

  test('zorunlu alanlar eksik → submit hata gösteriyor', async ({ page }) => {
    await addProductAndGoToCheckout(page)
    await page.locator('button[type="submit"], button', { hasText: /Güvenli Ödemeye Geç/ }).click()
    await expect(page.locator('text=Bu alan zorunludur').first()).toBeVisible({ timeout: 5000 })
  })

  test('tam form doldurulunca sipariş onay sayfasına gidiliyor', async ({ page }) => {
    await addProductAndGoToCheckout(page)

    await page.fill('input[name="fullName"]',     'Ayşe Yılmaz')
    await page.fill('input[name="phone"]',        '05321234567')
    await page.fill('input[name="email"]',        'test@example.com')
    await page.fill('input[name="addressLine1"]', 'Atatürk Cad. No:1')
    await page.fill('input[name="city"]',         'İstanbul')
    await page.fill('input[name="district"]',     'Beşiktaş')
    await page.fill('input[name="postalCode"]',   '34000')

    await page.locator('button', { hasText: /Güvenli Ödemeye Geç/ }).click()
    await expect(page).toHaveURL(/\/siparis-onay/, { timeout: 10_000 })
    await expect(page.locator('text=Siparişiniz Alındı')).toBeVisible({ timeout: 10_000 })
  })

  test('sipariş onay sayfasında sipariş numarası görünüyor', async ({ page }) => {
    await addProductAndGoToCheckout(page)

    await page.fill('input[name="fullName"]',     'Test Kullanıcı')
    await page.fill('input[name="phone"]',        '05321234567')
    await page.fill('input[name="email"]',        'test@example.com')
    await page.fill('input[name="addressLine1"]', 'Test Sokak No:5')
    await page.fill('input[name="city"]',         'Ankara')
    await page.fill('input[name="district"]',     'Çankaya')
    await page.fill('input[name="postalCode"]',   '06000')

    await page.locator('button', { hasText: /Güvenli Ödemeye Geç/ }).click()
    await page.waitForURL(/\/siparis-onay/, { timeout: 10_000 })

    // SX ile başlayan sipariş numarası
    await expect(page.locator('text=/SX\\d+/')).toBeVisible({ timeout: 5000 })
  })
})
