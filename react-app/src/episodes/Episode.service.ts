import _ from "lodash";
import {
  EpisodeTime,
  Message,
  MessageToSetEpisodeTime,
  Messages,
  PossibleEpisodeTime as PossibleTime,
} from "../../../common/messages";
import { TabsRepo } from "../tabs/Tabs.repo";
import { TabsRepoAbstraction } from "../tabs/Tabs.repo-abstraction";
import { Bookmark } from "../bookmarks/Bookmarks.repo-abstraction";

interface Options {
  tabsRepo?: TabsRepoAbstraction;
}

type Tab = chrome.tabs.Tab;

export type PossibleTab = Tab | null;

export class EpisodeService {
  private tabsRepo: TabsRepoAbstraction;

  constructor(options?: Options) {
    this.tabsRepo = options?.tabsRepo || new TabsRepo();
  }

  private getActiveTabs = (): Promise<Tab[]> => {
    return this.tabsRepo.query({ active: true });
  };

  /**
   * We will use this to determine if an episode is currently playing so we know
   * whether to open a new tab with the episode or to change the current
   * episode's time.
   */
  public findOneEpisodeTabByUrl = async (
    url: Bookmark["episodeUrl"]
  ): Promise<PossibleTab> => {
    const tabs: Tab[] = await this.getActiveTabs();
    const tabWithUrl: Tab | undefined = _.find(tabs, { url });
    return tabWithUrl || null;
  };

  private getIfTabHasUrlLikeEpisode = ({ url }: Tab): boolean => {
    if (!url) return false;
    const episodeUrlPattern = /.+\/watch\/\d+/;
    const match: RegExpMatchArray | null = url.match(episodeUrlPattern);
    return !!match;
  };

  private findTabWithUrlLikeEpisode = (tabs: Tab[]): Tab | undefined => {
    return tabs.find(this.getIfTabHasUrlLikeEpisode);
  };

  /**
   * We will use this to get the tab's ID. Then, we'll send a message to that
   * tab asking for the episode info. We also need this to determine if we
   * should enable the "Add Bookmark" button.
   */
  public findOneEpisodeTab = async (): Promise<PossibleTab> => {
    const tabs: Tab[] = await this.getActiveTabs();
    const withEpisodeUrl: Tab | undefined =
      this.findTabWithUrlLikeEpisode(tabs);
    return withEpisodeUrl || null;
  };

  private handleMissingTab = (): never => {
    throw new Error("No tab with a Netflix episode was found.");
  };

  private sendMessageToEpisodeTab = async (
    message: Message
  ): Promise<unknown> => {
    const episodeTab: PossibleTab = await this.findOneEpisodeTab();
    if (!episodeTab) return this.handleMissingTab();
    const { sendMessage } = this.tabsRepo;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return sendMessage(episodeTab.id!, message);
  };

  private sendMessageToGetTime = async (
    episodeTab: Tab
  ): Promise<PossibleTime> => {
    const data: Message = { type: Messages.getEpisodeTime };
    const { sendMessage } = this.tabsRepo;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const time: unknown = await sendMessage(episodeTab.id!, data);
    return time as PossibleTime;
  };

  private findAndValidateEpisodeTime = async (
    episodeTab: Tab
  ): Promise<EpisodeTime> => {
    const time: PossibleTime = await this.sendMessageToGetTime(episodeTab);
    if (!time) throw new Error("Failed to get the episode's time.");
    return time;
  };

  /**
   * We must throw an error when a tab was not found because we would only call
   * this method when attempting to create a bookmark, and we expect a Netflix
   * tab to be open already.
   */
  public getTimeOf1stEpisodeTab = async (): Promise<EpisodeTime> => {
    const episodeTab: PossibleTab = await this.findOneEpisodeTab();
    if (!episodeTab) return this.handleMissingTab();
    return this.findAndValidateEpisodeTime(episodeTab);
  };

  private getMessageToSetTime = (
    timeMs: MessageToSetEpisodeTime["timeMs"]
  ): MessageToSetEpisodeTime => {
    return { type: Messages.setEpisodeTime, timeMs };
  };

  public sendMessageToSetEpisodeTime = async (
    timeMs: MessageToSetEpisodeTime["timeMs"]
  ): Promise<void> => {
    const message: MessageToSetEpisodeTime = this.getMessageToSetTime(timeMs);
    await this.sendMessageToEpisodeTab(message);
  };
}
