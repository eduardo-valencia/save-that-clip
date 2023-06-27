import { TabsRepoAbstraction } from "./Tabs.repo-abstraction";

export class TabMessageRepo extends TabsRepoAbstraction {
  public sendMessage = chrome.tabs.sendMessage;

  public query = chrome.tabs.query;
}
