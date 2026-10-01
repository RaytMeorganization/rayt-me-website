import { expect, test } from '@playwright/test'

test.describe('public signup and billing smoke', { tag: '@smoke' }, () => {
  test('Get Started stays paused until website sign-up is turned on', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: /get started/i }).first()).toBeDisabled()
    await expect(page.getByRole('link', { name: /app store/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /google play/i })).toBeVisible()
  })

  test('pricing shows the published yearly prices', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('$27')).toBeVisible()
    await expect(page.getByText('$21')).toBeVisible()
    await expect(page.getByRole('button', { name: /go pro/i })).toBeDisabled()
  })

  test('RaytME Bot answers from the site', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Open RaytME Bot' }).click()
    await expect(page.getByText('On this site')).toBeVisible()
    await page.getByLabel('Message RaytME Bot').fill('What is the Pro price?')
    await page.getByRole('button', { name: 'Send message' }).click()
    await expect(page.getByText(/\$27/)).toBeVisible()
  })
})

test.describe('legal and card regression', { tag: '@regression' }, () => {
  test('legal pages stay linked for store review', async ({ page }) => {
    await page.goto('/legal')
    await expect(page.getByRole('link', { name: /privacy/i }).first()).toBeVisible()
    await page.goto('/privacy')
    await expect(page.getByRole('heading', { name: 'Privacy Notice' })).toBeVisible()
    await page.goto('/terms')
    await expect(page.getByRole('heading', { name: 'Terms of Service' })).toBeVisible()
  })

  test('the public card does not sell a plan', async ({ page }) => {
    await page.goto('/p/demo-omar-al-kuwari')
    await expect(page.getByText('Continue in the RaytME app')).toBeVisible()
    await expect(page.getByRole('button', { name: /go pro|checkout|buy/i })).toHaveCount(0)
  })
})
