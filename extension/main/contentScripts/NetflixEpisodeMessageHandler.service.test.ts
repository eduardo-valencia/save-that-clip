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
import { Message, Messages } from "../common/messages";
import "../content-script";

const { sendMessage } = new MessageListenerTestUtils();

const sendMessageToGetTime = (): Promise<unknown> => {
  const message: Message = { type: Messages.getNetflixEpisodeInfo };
  return sendMessage({ message });
};

afterEach(() => {
  /**
   * We reset the HTML to prevents tests from interfering with each other.
   */
  document.body.innerHTML = "";
});

describe("When the video element exists", () => {
  const videoTimeSeconds = 300;

  const addVideoElement = (): void => {
    document.body.innerHTML = "<video />";
  };

  const setVideoTime = (): void => {
    const video: HTMLVideoElement | null = document.querySelector("video");
    if (!video) throw new Error("Element not found.");
    video.currentTime = videoTimeSeconds;
  };

  beforeAll(() => {
    addVideoElement();
    setVideoTime();
  });

  it("Responds with the time", async () => {
    const response: unknown = await sendMessageToGetTime();
    const timeInMs = videoTimeSeconds * 1000;
    expect(response).toEqual(timeInMs);
  });
});

it("Responds with null when the video element does not exist", async () => {
  const response: unknown = await sendMessageToGetTime();
  expect(response).toBeNull();
});
