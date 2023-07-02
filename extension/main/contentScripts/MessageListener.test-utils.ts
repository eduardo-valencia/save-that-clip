import { Message } from "../common/messages";
import {
  AddListener,
  MessageHandler,
  OnMessage,
  Runtime,
} from "../content-script";

export type SpiedAddListener = jest.SpiedFunction<AddListener>;

type PromiseExecutor = ConstructorParameters<typeof Promise>[0];

type Resolve = Parameters<PromiseExecutor>[0];

interface FieldsToSendMessage {
  spy: SpiedAddListener;
  message: Message;
}

/**
 * We must place this outside of the class. Otherwise, we'll create a new
 * instance of the mocked function each time we create a Chrome service, so some
 * tests wouldn't work.
 */
const onMessageMock: Pick<OnMessage, "addListener"> = {
  addListener: jest.fn(),
};

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

  private getMockedOnMessage = () => {
    return onMessageMock as OnMessage;
  };

  private getMockedRunTime = () => {
    const onMessage: OnMessage = this.getMockedOnMessage();
    const runtimeMock: Pick<Runtime, "onMessage"> = { onMessage };
    return runtimeMock as Runtime;
  };

  private getMockedChrome = () => {
    const runtime: Runtime = this.getMockedRunTime();
    const chromeMock: Pick<typeof chrome, "runtime"> = { runtime };
    return chromeMock as typeof chrome;
  };

  public getMockedChromeService = () => {
    return { getChrome: this.getMockedChrome };
  };
}
