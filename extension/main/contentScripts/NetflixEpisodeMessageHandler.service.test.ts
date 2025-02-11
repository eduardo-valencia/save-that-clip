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
import { NetflixEpisodeInfo } from "./NetflixEpisodeMessageHandler.service";

const { sendMessage } = new MessageListenerTestUtils();

const sendMessageToGetInfo = () => {
  const message: Message = { type: Messages.getNetflixEpisodeInfo };
  return sendMessage({ message }) as Promise<NetflixEpisodeInfo>;
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
    const response: NetflixEpisodeInfo = await sendMessageToGetInfo();
    const timeInMs = videoTimeSeconds * 1000;
    expect(response.timeMs).toEqual(timeInMs);
  });
});

it("Responds with a null time when the video element does not exist", async () => {
  const response: NetflixEpisodeInfo = await sendMessageToGetInfo();
  expect(response.timeMs).toBeNull();
});
