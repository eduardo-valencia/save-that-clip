import { MessageListenerTestUtils } from "./MessageListener.test-utils";

jest.mock("../common/chrome.service", () => {
  const testUtils = new MessageListenerTestUtils();
  return testUtils.getMockedChromeService();
});

it("Works", () => {
  expect(true).toEqual(true);
});
