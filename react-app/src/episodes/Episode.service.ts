import { PossibleEpisodeTime } from "../../../common/messages";
import { TabsRepo } from "../tabs/Tabs.repo";
import { TabsRepoAbstraction } from "../tabs/Tabs.repo-abstraction";

interface Options {
  tabsRepo?: TabsRepoAbstraction;
}

export class EpisodeService {
  private tabsRepo: TabsRepoAbstraction;

  constructor({ tabsRepo }: Options) {
    this.tabsRepo = tabsRepo || new TabsRepo();
  }

  private findOneNetflixEpisodeTab = () => {};

  public findEpisodeTime = async (): Promise<PossibleEpisodeTime> => {};
}
