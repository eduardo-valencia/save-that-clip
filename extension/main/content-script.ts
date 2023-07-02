import { getChrome } from "./common/chrome.service";
import { Message, Messages } from "./common/messages";

type Sender = chrome.runtime.MessageSender;

type SendResponse = (...args: any) => void;

export type Runtime = typeof chrome.runtime;

export type OnMessage = Runtime["onMessage"];

export type AddListener = OnMessage["addListener"];

export type MessageHandler = Parameters<AddListener>[0];

const sendEpisodeTime: MessageHandler = (
  message: Message,
  sender: Sender,
  sendResponse: SendResponse
): undefined => {
  sendResponse(null);
  return undefined;
};

const setEpisodeTime: MessageHandler = (
  message: Message,
  sender: Sender,
  sendResponse: SendResponse
): undefined => {
  sendResponse(null);
  return undefined;
};

type MessageHandlers = {
  [key in Messages]: MessageHandler;
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
): undefined => {
  const handlers: MessageHandlers = getMessageHandlers();
  const { [message.type]: handler } = handlers;
  handler(message, sender, sendResponse);
  return undefined;
};

const listenToMessages = (): void => {
  const chromeInstance: typeof chrome = getChrome();
  chromeInstance.runtime.onMessage.addListener(handleMessage);
};

listenToMessages();
