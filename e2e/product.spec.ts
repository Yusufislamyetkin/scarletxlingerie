import { test, expect } from '@playwright/test'

test.describe('Ürün Detay Sayfası', () => {
  test('ürün sayfası düzgün yükleniyor', async ({ page }) => {
    await page.goto('/urun/velvet-noir-sutyen')
    await expect(page.locator('h1')).toContainText('Velvet Noir')
    // Fiyat görünür
    await expect(page.locator('text=₺').first()).toBeVisible()
    // Beden seçenekleri mevcut
    await expect(page.locator('button').filter({ hasText: /^[0-9]+[A-C]?$|^(XS|S|M|L|XL)$/ }).first()).toBeVisible()
  })

  test('beden seçmeden sepete eklenemez', async ({ page }) => {
    await page.goto('/urun/velvet-noir-sutyen')
    const addBtn = page.locator('button', { hasText: /Sepete Ekle/ })
    await expect(addBtn).toBeDisabled()
  })

  test('beden seçince sepete ekle aktif oluyor', async ({ page }) => {
    await page.goto('/urun/velvet-noir-sutyen')
    // İlk stokta olan bedeni seç
    const sizeBtn = page.locator('button').filter({ hasText: '70B' })
    await sizeBtn.click()
    const addBtn = page.locator('button', { hasText: /Sepete Ekle/ })
    await expect(addBtn).toBeEnabled()
  })

  test('sepete ekle → onay mesajı gösteriyor', async ({ page }) => {
    await page.goto('/urun/velvet-noir-sutyen')
    await page.locator('button', { hasText: '70B' }).click()
    await page.locator('button', { hasText: /Sepete Ekle/ }).click()
    await expect(page.locator('text=Sepete Eklendi')).toBeVisible({ timeout: 5000 })
  })

  test('ürün JSON-LD schema head içinde mevcut', async ({ page }) => {
    await page.goto('/urun/velvet-noir-sutyen')
    const schema = await page.locator('script[type="application/ld+json"]').allTextContents()
    const hasProduct = schema.some((s) => s.includes('"@type":"Product"'))
    expect(hasProduct).toBe(true)
  })
})
