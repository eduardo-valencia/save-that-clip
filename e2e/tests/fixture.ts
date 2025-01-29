/**
 * Playwright's license requires me to state that I changed this file. Just so
 * you know, I changed it.
 */

import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({ }, use) => {
    const pathToExtension = path.resolve(__dirname, '../../extension');
    const userDir = 'C:\\Users\\80259\\AppData\\Local\\Google\\Chrome\\User Data';
    const context = await chromium.launchPersistentContext(userDir, {
      headless: false,
      // args: [
      //   `--disable-extensions-except=${pathToExtension}`,
      //   `--load-extension=${pathToExtension}`,
      // ],
      channel: "chrome-canary",
      
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background)
      background = await context.waitForEvent('serviceworker');

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

export const expect = test.expect;