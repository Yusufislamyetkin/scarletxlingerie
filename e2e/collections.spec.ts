import { test, expect } from '@playwright/test'

test.describe('Koleksiyon Sayfaları', () => {
  test('koleksiyonlar listesi yükleniyor', async ({ page }) => {
    await page.goto('/koleksiyonlar')
    await expect(page).toHaveTitle(/Koleksiyonlar/)
    await expect(page.locator('a[href^="/koleksiyonlar/"]').first()).toBeVisible()
  })

  test('koleksiyon detay sayfası ürünleri gösteriyor', async ({ page }) => {
    await page.goto('/koleksiyonlar/velvet-noir')
    await expect(page.locator('h1', { hasText: 'Velvet Noir' })).toBeVisible()
    await expect(page.locator('a[href^="/urun/"]').first()).toBeVisible()
  })

  test('koleksiyon sayfası BreadcrumbList JSON-LD içeriyor', async ({ page }) => {
    await page.goto('/koleksiyonlar/velvet-noir')
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents()
    const hasBreadcrumb = schemas.some((s) => s.includes('BreadcrumbList'))
    expect(hasBreadcrumb).toBe(true)
  })

  test('ürün kartına tıklayınca ürün sayfasına gidiliyor', async ({ page }) => {
    await page.goto('/koleksiyonlar/velvet-noir')
    await page.locator('a[href^="/urun/"]').first().click()
    await expect(page).toHaveURL(/\/urun\//)
    await expect(page.locator('h1')).toBeVisible()
  })
})
