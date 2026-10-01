import { expect, test } from '@playwright/test'

test('landing renders the branded hero and paused account CTA', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /professional identity platform/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /create your card/i }).first()).toBeDisabled()
  await expect(page.locator('[data-gsap-hero-bg]')).toBeAttached()
  await expect(page.getByText('Your reputation, proven when it matters.')).toBeVisible()
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

test('platform admin can sign in and reach protected operations', async ({ page }) => {
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

test('member entitlements and server-controlled themes load in settings', async ({ page }) => {
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

test('privacy notice lists RAYTME LLC and store contact details', async ({ page }) => {
  await page.goto('/privacy')
  await expect(page.getByRole('heading', { name: 'Privacy Notice' })).toBeVisible()
  await expect(page.getByText('RAYTME LLC')).toBeVisible()
  await expect(page.getByText(/30 N Gould St, Ste R, Sheridan, WY 82801/)).toBeVisible()
  await expect(page.getByText('privacy@raytme.me').first()).toBeVisible()
  await expect(page.getByRole('link', { name: 'Support' }).first()).toHaveAttribute('href', '/support')
  await expect(page.getByRole('link', { name: 'Next' })).toHaveAttribute('href', '/terms')
  await expect(page.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/legal')
})

test('legal slideshow advances to home and supports Arabic', async ({ page }) => {
  await page.goto('/support')
  await expect(page.getByRole('heading', { name: 'Support' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
  await page.getByRole('button', { name: /language|العربية/i }).click()
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.getByRole('heading', { name: 'الدعم' })).toBeVisible()
})

test('support page is usable for App Store and Play Console', async ({ page }) => {
  await page.goto('/support')
  await expect(page.getByRole('heading', { name: 'Support' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'support@raytme.me' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'privacy@raytme.me' })).toBeVisible()
})
