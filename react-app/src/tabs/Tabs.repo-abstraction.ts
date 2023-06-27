export abstract class TabsRepoAbstraction {
  abstract sendMessage: typeof chrome.tabs.sendMessage;

  abstract query: typeof chrome.tabs.query;
}
