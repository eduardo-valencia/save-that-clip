import { Message } from "../../../main/common/messages";

type ChromeTabs = typeof chrome.tabs;

type Query = ChromeTabs["query"];
type QueryParameters = Parameters<Query>;
type QueryInfo = QueryParameters["0"];

type Create = ChromeTabs["create"];
type CreateParameters = Parameters<Create>;

type Tab = chrome.tabs.Tab;

export abstract class TabsRepoAbstraction {
  abstract sendMessage: (tabId: number, message: Message) => Promise<unknown>;

  /**
   * We do not allow the URL because that requires more permissions.
   */
  abstract query: (queryInfo: Omit<QueryInfo, "url">) => Promise<Tab[]>;

  abstract create: (creationFields: CreateParameters[0]) => Promise<Tab>;
}
