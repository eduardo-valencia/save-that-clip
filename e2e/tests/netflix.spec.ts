import { test, expect } from './fixture'

const timeout = 5 * 60 * 1000

test.setTimeout(timeout)

test('This test allows me to inspect the Netflix video toolbar', async ({
  page,
}) => {
  await page.goto('https://www.netflix.com/watch/70283145')
  const locator = page.locator('[data-uia="video-title"] h4')
  await locator.waitFor({ timeout })
})
