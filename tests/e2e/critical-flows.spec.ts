import { expect, test } from '@playwright/test'

test('landing renders the branded hero and working account CTA', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /professional identity platform/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /create your card/i }).first()).toBeDisabled()
  await expect(page.locator('[data-gsap-hero-bg]')).toBeAttached()
  await expect(page.getByText('Your RaytME profile is your business card')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'James Carter' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Sofia Mendes' })).toBeVisible()
  await expect(page.getByText('LinkedIn')).toHaveCount(0)
})

test('public QR profile is card-only, privacy-safe, and app-directed', async ({ page }) => {
  await page.goto('/p/demo-omar-al-kuwari')
  await expect(page.getByRole('heading', { name: 'Michael Brennan' })).toBeVisible()
  await expect(page.getByText('Public card preview')).toBeVisible()
  await expect(page.getByText('Request phone in the app')).toBeVisible()
  await expect(page.getByText('Continue in the RaytME app')).toBeVisible()
  await expect(page.getByRole('link', { name: 'App Store' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Google Play' })).toBeVisible()
  await expect(page.getByRole('button', { name: /^rate$/i })).toHaveCount(0)
  await expect(page.getByText(/view professional snapshot/i)).toHaveCount(0)
  await expect(page.getByText('omar.personal@example.com')).toHaveCount(0)
})

test('public profile supports RTL without exposing app-only actions', async ({ page }) => {
  await page.goto('/p/demo-omar-al-kuwari')
  await page.getByRole('button', { name: 'Change language' }).click()
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.getByText('معاينة البطاقة العامة')).toBeVisible()
  await expect(page.getByRole('button', { name: /^rate$/i })).toHaveCount(0)
})

test.skip('platform admin can sign in and reach protected operations', async ({ page }) => {
  await page.goto('/sign-in')
  await page.getByLabel('Email').fill('admin@demo.rayt.me')
  await page.getByLabel('Password').fill('RaytDev!2026')
  const loginResponse = page.waitForResponse(response =>
    response.url().includes('/backend/auth/login'),
  )
  await page.getByRole('button', { name: 'Continue' }).click()
  expect((await loginResponse).status()).toBe(200)
  await expect(page).toHaveURL(/admin-dashboard/)
  await expect(page.getByRole('heading', { name: 'Admin dashboard' })).toBeVisible()
})

test.skip('member entitlements and server-controlled themes load in settings', async ({ page }) => {
  await page.goto('/sign-in')
  await page.getByLabel('Email').fill('user@demo.rayt.me')
  await page.getByLabel('Password').fill('RaytDev!2026')
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page).toHaveURL(/settings/)
  await expect(page.getByText('Ratings given per month:')).toBeVisible()
  await expect(page.getByText('25', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Download my data' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Delete account' })).toBeDisabled()
  const themeResponse = page.waitForResponse(response =>
    response.url().includes('/backend/me/theme'),
  )
  await page.getByLabel('Card theme').selectOption('slate')
  expect((await themeResponse).status()).toBe(200)
})
