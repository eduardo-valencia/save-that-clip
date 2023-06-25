import { Locator } from '@playwright/test'
import { test, expect } from './fixture'

test('popup page', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/popup.html`)
  const body: Locator = page.locator('body')
  expect(body).toHaveText('Bookmarks')
})
