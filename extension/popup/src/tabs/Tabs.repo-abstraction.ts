import { Message } from "../../../main/common/messages";

type ChromeTabs = typeof chrome.tabs;

type Query = ChromeTabs["query"];
type QueryParameters = Parameters<Query>;
type QueryInfo = QueryParameters["0"];

type Create = ChromeTabs["create"];
type CreateParameters = Parameters<Create>;

export type Tab = chrome.tabs.Tab;

/**
 * Note that we might not be able to use the types from chrome.tabs to define
 * the methods here because those have overloads, and we don't want to have to
 * mock the overloads
 */
export abstract class TabsRepoAbstraction {
  abstract sendMessage: (tabId: number, message: Message) => Promise<unknown>;

  /**
   * We do not allow the URL because that requires more permissions.
   */
  abstract query: (queryInfo: Omit<QueryInfo, "url">) => Promise<Tab[]>;

  abstract create: (creationFields: CreateParameters[0]) => Promise<Tab>;

  abstract remove: (ids: number[]) => Promise<void>;
}
