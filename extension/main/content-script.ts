/**
 * Note that this content script will only be loaded on certain pages. Please
 * avoid assuming that it exists. Ex: Do not send a message to the content
 * script unless we know it exists. Otherwise, this could cause errors.
 */

import { getChrome } from "./common/chrome.service";
import { Message, Messages } from "./common/messages";
import { NetflixEpisodeMessageHandlers } from "./contentScripts/NetflixEpisodeMessageHandler.service";

export type Runtime = typeof chrome.runtime;

export type Sender = chrome.runtime.MessageSender;

export type SendResponse = (...args: unknown[]) => void;

export type OnMessage = Runtime["onMessage"];

export type AddListener = OnMessage["addListener"];

const netflixMessageHandlers = new NetflixEpisodeMessageHandlers();

type MessageHandler = (message: Message, sender: Sender) => unknown;

type MessageHandlers = {
  [key in Messages]: MessageHandler;
};

const getMessageHandlers = (): MessageHandlers => {
  return {
    [Messages.getNetflixEpisodeInfo]: netflixMessageHandlers.getEpisodeInfo,
  };
};

const getMessageHandlerFromType = (type: Messages): MessageHandler => {
  const handlers: MessageHandlers = getMessageHandlers();
  return handlers[type];
};

/**
 * Note that this cannot be an async function
 */
const handleMessage = (
  message: Message,
  sender: Sender,
  sendResponse: SendResponse
): true => {
  const handler: MessageHandler = getMessageHandlerFromType(message.type);

  const getResAndSendIt = async (): Promise<void> => {
    const response: unknown = await handler(message, sender);
    sendResponse(response);
  };

  void getResAndSendIt();

  /**
   * Because we must return true if we are asynchronously sending the response.
   * This allows us to call sendResponse at a later time.
   */
  return true;
};

const listenToMessages = (): void => {
  const chromeInstance: typeof chrome = getChrome();
  chromeInstance.runtime.onMessage.addListener(handleMessage);
};

listenToMessages();
