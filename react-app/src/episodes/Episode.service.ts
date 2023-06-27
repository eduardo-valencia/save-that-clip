import { PossibleEpisodeTime } from "../../../common/messages";
import { Bookmark } from "../bookmarks/Bookmarks.service";
import { TabsRepo } from "../tabs/Tabs.repo";
import { TabsRepoAbstraction } from "../tabs/Tabs.repo-abstraction";

interface Options {
  tabsRepo?: TabsRepoAbstraction;
}

type Tab = chrome.tabs.Tab;

export type PossibleTab = Tab | null;

export class EpisodeService {
  private tabsRepo: TabsRepoAbstraction;

  constructor({ tabsRepo }: Options) {
    this.tabsRepo = tabsRepo || new TabsRepo();
  }

  /**
   * We will use this to determine if an episode is currently playing so we know
   * whether to open a new tab with the episode or to change the current
   * episode's time.
   */
  private findOneEpisodeTabByUrl = (
    url: Bookmark["episodeUrl"]
  ): Promise<PossibleTab> => {
    return new Promise((resolve) => resolve(null));
  };

  private getIfTabHasEpisodeUrl = ({ url }: Tab): boolean => {
    if (!url) return false;
    const episodeUrlPattern = /.+\/watch\/\d+/;
    const match: RegExpMatchArray | null = url.match(episodeUrlPattern);
    return !!match;
  };

  private findTabWithEpisodeUrl = (tabs: Tab[]): Tab | undefined => {
    return tabs.find(this.getIfTabHasEpisodeUrl);
  };

  /**
   * We will use this to get the tab's ID. Then, we'll send a message to that
   * tab asking for the episode info. We also need this to determine if we
   * should enable the "Add Bookmark" button.
   *
   * Plan:
   * - Get all active tabs.
   * - Filter them by a URL that looks like an episode URL. Note that we
   *   shouldn't filter it in the "query" method.
   * - Return first one.
   */
  public findOneEpisodeTab = async (): Promise<PossibleTab> => {
    const tabs: Tab[] = await this.tabsRepo.query({ active: true });
    const withEpisodeUrl: Tab | undefined = this.findTabWithEpisodeUrl(tabs);
    return withEpisodeUrl || null;
  };

  public findTimeOf1stEpisodeTab = async (): Promise<PossibleEpisodeTime> => {
    return new Promise((resolve) => resolve(null));
  };
}
