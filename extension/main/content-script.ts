import { getChrome } from "./common/chrome.service";
import { Message, Messages } from "./common/messages";
import { NetflixEpisodeMessageHandlers } from "./contentScripts/NetflixEpisodeTime.service";

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
    [Messages.getEpisodeTime]: netflixMessageHandlers.sendEpisodeTime,
  };
};

const getMessageHandlerFromType = (type: Messages): MessageHandler => {
  const handlers: MessageHandlers = getMessageHandlers();
  return handlers[type];
};

const handleMessage = (
  message: Message,
  sender: Sender,
  sendResponse: SendResponse
): undefined => {
  const handler: MessageHandler = getMessageHandlerFromType(message.type);
  const response: unknown = handler(message, sender);
  sendResponse(response);
  return undefined;
};

const listenToMessages = (): void => {
  const chromeInstance: typeof chrome = getChrome();
  chromeInstance.runtime.onMessage.addListener(handleMessage);
};

listenToMessages();
