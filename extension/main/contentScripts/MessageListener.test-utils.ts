import { Message } from "../common/messages";
import {
  AddListener,
  OnMessage,
  Runtime,
  SendResponse,
} from "../content-script";

type SpiedAddListener = jest.SpiedFunction<AddListener>;

/**
 * We must place this outside of the class. Otherwise, we'll create a new
 * instance of the mocked function each time we create a Chrome service, so some
 * tests wouldn't work.
 */
const spiedAddListener: SpiedAddListener = jest.fn();

type PromiseExecutor = ConstructorParameters<typeof Promise>[0];

type Resolve = Parameters<PromiseExecutor>[0];

interface FieldsToSendMessage {
  message: Message;
}

type MainMessageHandler = Parameters<AddListener>[0];

export class MessageListenerTestUtils {
  private getHandler = (): MainMessageHandler => {
    expect(spiedAddListener).toHaveBeenCalled();
    const [handler] = spiedAddListener.mock.lastCall;
    expect(handler).toBeTruthy();
    return handler;
  };

  private getSendMessageResponse = (resolve: Resolve): SendResponse => {
    return (response?: unknown): void => {
      resolve(response);
    };
  };

  private getMessageSenderPromiseResolver = ({
    message,
  }: FieldsToSendMessage) => {
    return (resolve: Resolve): void => {
      const handleMessage: MainMessageHandler = this.getHandler();
      const sender = {};
      const sendResponse = this.getSendMessageResponse(resolve);
      handleMessage(message, sender, sendResponse);
    };
  };

  /**
   * Implementation notes:
   *
   * - This might not be accurate if there are multiple listeners because we
   *   only call the last listener.
   *
   * @returns the message response
   */
  public sendMessage = (fields: FieldsToSendMessage): Promise<unknown> => {
    return new Promise(this.getMessageSenderPromiseResolver(fields));
  };

  private getMockedOnMessage = () => {
    const onMessageMock: Pick<OnMessage, "addListener"> = {
      addListener: spiedAddListener as unknown as AddListener,
    };
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
