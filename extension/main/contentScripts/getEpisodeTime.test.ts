/**
 * Imports to create mocks.
 */
import {
  MessageListenerTestUtils,
  SpiedAddListener,
} from "./MessageListener.test-utils";

jest.mock("../common/chrome.service", () => {
  const testUtils = new MessageListenerTestUtils();
  return testUtils.getMockedChromeService();
});

/**
 * Other imports
 */
import { getChrome } from "../common/chrome.service";
import { Messages } from "../common/messages";
import "../content-script";

const testUtils = new MessageListenerTestUtils();

it("Works", async () => {
  const chrome = getChrome();
  const message = await testUtils.sendMessage({
    // eslint-disable-next-line @typescript-eslint/unbound-method
    spy: chrome.runtime.onMessage.addListener as unknown as SpiedAddListener,
    message: { type: Messages.getEpisodeTime },
  });
  expect(message).toBeTruthy();
});
