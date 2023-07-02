import { Message } from "../common/messages";

type Runtime = typeof chrome.runtime;

type AddListener = Runtime["onMessage"]["addListener"];

type SpiedAddListener = jest.SpiedFunction<AddListener>;

type MessageHandler = Parameters<AddListener>[0];

type PromiseExecutor = ConstructorParameters<typeof Promise>[0];

type Resolve = Parameters<PromiseExecutor>[0];

interface FieldsToSendMessage {
  spy: SpiedAddListener;
  message: Message;
}

export class MessageListenerTestUtils {
  private getHandler = (spy: SpiedAddListener): MessageHandler => {
    expect(spy).toHaveBeenCalled();
    const [handler] = spy.mock.lastCall;
    expect(handler).toBeTruthy();
    return handler;
  };

  private getSendMessageResponse = (resolve: Resolve) => {
    return (response?: unknown): void => {
      resolve(response);
    };
  };

  private getExecutePromiseToSendMessage = ({
    spy,
    message,
  }: FieldsToSendMessage) => {
    return (resolve: Resolve): void => {
      const handleMessage: MessageHandler = this.getHandler(spy);
      const sender = {};
      const sendResponse = this.getSendMessageResponse(resolve);
      handleMessage(message, sender, sendResponse);
    };
  };

  /**
   * Implementation notes:
   *
   * - This might not be accurate if there are multiple listeners because we
   *   only all the last listener.
   *
   * @returns the message response
   *
   * Plan:
   *
   * - Get handler
   * - Return new promise
   * - Define the callback, which is supposed to receive a response. Make sure
   *   the callback calls Promise.resolve with the response it receives.
   * - Call the handler with the message, a mocked sender, and the callback.
   */
  public sendMessage = (fields: FieldsToSendMessage): Promise<unknown> => {
    return new Promise(this.getExecutePromiseToSendMessage(fields));
  };
}
