type Query = (typeof chrome.tabs)["query"];

type QueryParameters = Parameters<Query>;

type QueryInfo = QueryParameters["0"];

export abstract class TabsRepoAbstraction {
  abstract sendMessage: (tabId: number, message: unknown) => Promise<unknown>;

  /**
   * We do not allow the URL because that requires more permissions.
   */
  abstract query: (queryInfo: Omit<QueryInfo, "url">) => ReturnType<Query>;
}
