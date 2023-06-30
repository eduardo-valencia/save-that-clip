import { RuntimeMessageRepoAbstraction } from "./RuntimeMessage.repo-abstraction";

export class RuntimeMessageRepo extends RuntimeMessageRepoAbstraction {
  public sendMessage = <Response>(data: unknown): Promise<Response> => {
    return chrome.runtime.sendMessage(data) as Promise<Response>;
  };
}
