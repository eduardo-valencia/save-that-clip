type ChromeTabs = typeof chrome.tabs;

type Query = ChromeTabs["query"];

type QueryParameters = Parameters<Query>;

type QueryInfo = QueryParameters["0"];

export abstract class TabsRepoAbstraction {
  abstract sendMessage: (tabId: number, message: unknown) => Promise<unknown>;

  /**
   * We do not allow the URL because that requires more permissions.
   */
  abstract query: (
    queryInfo: Omit<QueryInfo, "url">
  ) => Promise<chrome.tabs.Tab[]>;
}
