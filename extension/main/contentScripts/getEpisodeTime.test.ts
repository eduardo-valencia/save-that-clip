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

// todo: Add way of testing that it responds with an error

afterEach(() => {
  document.body.innerHTML = "";
});

describe("When the video element exists", () => {
  const videoTime = 300;

  const addVideoElement = (): void => {
    document.body.innerHTML = "<video />";
  };

  const setVideoTime = (): void => {
    const video: HTMLVideoElement | null = document.querySelector("video");
    if (!video) throw new Error("Element not found.");
    video.currentTime = videoTime;
  };

  beforeAll(() => {
    addVideoElement();
    setVideoTime();
  });

  it("Responds with the time", async () => {
    const message: Message = { type: Messages.getEpisodeTime };
    const response: unknown = await sendMessage({ message });
    expect(response).toEqual(videoTime);
  });
});

it.todo("Responds with null when the video element does not exist");
