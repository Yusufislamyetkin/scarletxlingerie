import { test, expect } from '@playwright/test'

test.describe('Ana Sayfa', () => {
  test('hero section ve koleksiyonlar yükleniyor', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/ScarletX/)
    await expect(page.locator('h1')).toBeVisible()
    // Koleksiyonlar grid görünür
    await expect(page.locator('a[href^="/koleksiyonlar/"]').first()).toBeVisible()
  })

  test('header sepet ikonuna tıklanınca drawer açılıyor', async ({ page }) => {
    await page.goto('/')
    const cartBtn = page.locator('button[aria-label*="epet"], button[aria-label*="Cart"]').first()
    await cartBtn.click()
    await expect(page.locator('text=Sepetiniz Boş').or(page.locator('[data-testid="cart-drawer"]'))).toBeVisible({ timeout: 5000 })
  })

  test('search overlay açılıp kapanıyor', async ({ page }) => {
    await page.goto('/')
    // Search button
    const searchBtn = page.locator('button[aria-label*="ara"], button[aria-label*="Ara"], button[aria-label*="search"]').first()
    await searchBtn.click()
    await expect(page.locator('input[placeholder*="Ara"]').or(page.locator('input[type="search"]'))).toBeVisible({ timeout: 5000 })
    await page.keyboard.press('Escape')
    await expect(page.locator('input[placeholder*="Ara"]')).not.toBeVisible({ timeout: 3000 })
  })
})
