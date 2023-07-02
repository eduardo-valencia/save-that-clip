/**
 * Imports to create mocks.
 */
import { MessageListenerTestUtils } from "./MessageListener.test-utils";

jest.mock("../common/chrome.service", () => {
  const testUtils = new MessageListenerTestUtils();
  return testUtils.getMockedChromeService();
});

/**
 * Other imports
 */
import { Messages } from "../common/messages";
import "../content-script";

const testUtils = new MessageListenerTestUtils();

// todo: Add way of testing that it responds with an error

it("Works", async () => {
  const message = await testUtils.sendMessage({
    message: { type: Messages.getEpisodeTime },
  });
  expect(message).toBeTruthy();
});
