import { TabsRepoAbstraction } from "./Tabs.repo-abstraction";

export class TabsRepo extends TabsRepoAbstraction {
  public sendMessage = chrome.tabs.sendMessage;

  public query = chrome.tabs.query;
}
