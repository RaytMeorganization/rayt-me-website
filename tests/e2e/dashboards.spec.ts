import { expect, test, type Page } from '@playwright/test'

async function signIn(page: Page, email: string) {
  await page.addInitScript(() => {
    window.localStorage.setItem('rate-me-locale', 'en')
  })
  await page.goto('/sign-in')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password', { exact: true }).fill('RaytDev!2026')
  const loginResponse = page.waitForResponse(response =>
    response.url().includes('/backend/auth/login'),
  )
  await page.getByRole('button', { name: 'Continue' }).click()
  expect((await loginResponse).status()).toBe(200)
}

test('admin dashboard covers verification, disputes, search, and metrics', async ({ page }) => {
  await signIn(page, 'admin@demo.rayt.me')
  await expect(page).toHaveURL(/admin-dashboard/)
  await expect(page.getByRole('heading', { name: 'Admin dashboard' })).toBeVisible()
  await expect(page.getByText('Verification status')).toBeVisible({ timeout: 15_000 })
  await expect(page.getByText('Subscription tiers')).toBeVisible()
  // Chart bars are labelled with their counts; demo seed sizes vary, so match any count.
  await expect(page.getByLabel(/^\d+$/).first()).toBeVisible()

  await page.getByRole('tab', { name: 'Verification queue' }).click()
  await expect(page.getByRole('heading', { name: 'Pending Verification Demo' })).toBeVisible({ timeout: 15_000 })
  await expect(page.getByRole('heading', { name: 'Pending Student Demo' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Approve' }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Reject' }).first()).toBeVisible()

  await page.getByRole('tab', { name: 'Disputes' }).click()
  await expect(page.getByText('Michael Brennan')).toBeVisible({ timeout: 15_000 })
  await expect(page.getByRole('button', { name: 'Resolve' }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Dismiss' }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Hide rating' })).toHaveCount(0)

  await page.getByRole('tab', { name: 'Users' }).click()
  const search = page.getByRole('textbox', { name: 'Search' })
  await search.fill('Pending Student')
  await search.press('Enter')
  await expect(page.getByRole('heading', { name: 'Pending Student Demo' })).toBeVisible({ timeout: 15_000 })
  await expect(page.getByText('1 users')).toBeVisible()
})

test('business dashboard shows company reputation and manages seats', async ({ page }) => {
  await signIn(page, 'business@demo.rayt.me')
  await expect(page).toHaveURL(/business-dashboard/)
  await expect(page.getByRole('heading', { name: 'Acme Qatar' })).toBeVisible({ timeout: 15_000 })
  await expect(page.getByText('Lowest score')).toBeVisible()
  await expect(page.getByText('Verified members')).toBeVisible()
  await expect(page.getByText(/Seats used/)).toBeVisible()

  await page.getByRole('tab', { name: 'Roster & invites' }).click()
  await expect(page.getByRole('heading', { name: 'Michael Brennan', exact: true })).toBeVisible()
  const inviteEmail = `seat-${Date.now()}@demo.rayt.me`
  await page.getByRole('textbox', { name: 'Email' }).fill(inviteEmail)
  const inviteResponse = page.waitForResponse(response =>
    response.url().includes('/backend/business/invites') && response.request().method() === 'POST',
  )
  await page.getByRole('button', { name: 'Invite' }).click()
  expect((await inviteResponse).status()).toBe(201)
  await expect(page.getByText(inviteEmail)).toBeVisible()
})

test('admin organization editor validates purchased seats and tabs expose scroll controls', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 })
  await signIn(page, 'admin@demo.rayt.me')
  await expect(page).toHaveURL(/admin-dashboard/)
  await expect(page.getByRole('button', { name: 'Show more tabs' })).toBeVisible()
  await page.getByRole('tab', { name: 'Organizations' }).click()
  await page.getByRole('button', { name: 'Edit details' }).first().click()
  const seats = page.getByLabel('Seats purchased').first()
  await expect(seats).toBeVisible()
  await seats.fill('2')
  await expect(page.getByText('Enter a whole number from 3 to 10,000.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Save changes' }).last()).toBeDisabled()
})

test('destructive business actions ask for confirmation in a styled dialog', async ({ page }) => {
  await signIn(page, 'business@demo.rayt.me')
  await page.getByRole('tab', { name: 'Roster & invites' }).click()
  await page.getByRole('button', { name: 'Revoke' }).first().click()
  const dialog = page.getByRole('dialog', { name: 'Please confirm' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Confirm' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await page.getByRole('button', { name: 'Revoke' }).first().click()
  await dialog.getByRole('button', { name: 'Cancel' }).click()
  await expect(dialog).toBeHidden()
})
