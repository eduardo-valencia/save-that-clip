import { Message, Messages } from "./common/messages";

type Sender = chrome.runtime.MessageSender;

type SendResponse = (...args: any) => void;

const sendEpisodeTime = () => {};

const setEpisodeTime = () => {};

type MessageHandlers = {
  [key in Messages]: SendResponse;
};

const getMessageHandlers = (): MessageHandlers => {
  return {
    [Messages.getEpisodeTime]: sendEpisodeTime,
    [Messages.setEpisodeTime]: setEpisodeTime,
  };
};

/**
 * Plan:
 * 1. Get the message handlers
 * 2. Get the message handler for the message type.
 * 3. Call it to handle the message.
 */
const handleMessage = (
  message: Message,
  sender: Sender,
  sendResponse: SendResponse
): undefined => {};

const listenToMessages = (): void => {
  chrome.runtime.onMessage.addListener(handleMessage);
};

export {};
