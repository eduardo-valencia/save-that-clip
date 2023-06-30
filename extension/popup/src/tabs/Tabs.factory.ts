import _ from "lodash";

type Tab = chrome.tabs.Tab;

export class TabsFactory {
  private generateTabId = (): number => {
    const idString = _.uniqueId();
    return parseInt(idString);
  };

  public generateEpisodeTab = () => {
    const tab: Pick<Tab, "url" | "active" | "id"> = {
      url: "http://netflix.com/watch/81091396",
      active: true,
      id: this.generateTabId(),
    };
    return tab as Tab;
  };
}
