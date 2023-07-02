import _ from "lodash";
import {
  EpisodeTime,
  Message,
  Messages,
  PossibleEpisodeTime as PossibleTime,
} from "../../../main/common/messages";
import { TabsRepo } from "../tabs/Tabs.repo";
import { TabsRepoAbstraction } from "../tabs/Tabs.repo-abstraction";
import { Bookmark } from "../bookmarks/Bookmarks.repo-abstraction";
import {
  InjectionResult,
  ScriptsRepoAbstraction,
} from "../scripts/Scripts.repo-abstraction";
import { ScriptsRepo } from "../scripts/Scripts.repo";

interface Options {
  tabsRepo?: TabsRepoAbstraction;
  scriptsRepo?: ScriptsRepoAbstraction;
}

type Tab = chrome.tabs.Tab;

export type PossibleTab = Tab | null;

export interface EpisodeTabAndTime {
  tab: Tab;
  time: EpisodeTime;
}

/**
 * This is used in an injected script, but it is not actually accessible
 * anywhere besides the injected script. In other words, don't use this.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
declare const netflix: any;

type InjectedFunc = chrome.scripting.ScriptInjection["func"];

export interface ResultOfSettingTime {
  success: boolean;
}

type PossibleResult = InjectionResult | undefined;

/**
 * This service allows us to interact with an episode tab.
 */
export class EpisodeService {
  private tabsRepo: TabsRepoAbstraction;
  private scriptsRepo: ScriptsRepoAbstraction;

  constructor(options?: Options) {
    this.tabsRepo = options?.tabsRepo || new TabsRepo();
    this.scriptsRepo = options?.scriptsRepo || new ScriptsRepo();
  }

  private getCurrentTabs = (): Promise<Tab[]> => {
    return this.tabsRepo.query({ active: true, lastFocusedWindow: true });
  };

  /**
   * Implementation notes:
   *
   * This won't finding tabs with pending URLs. However, this is fine because a
   * pending tab would have unloaded content, so we wouldn't be able to change
   * the episode's time anyways.
   */
  public findOneEpisodeTabByUrl = async (
    url: Bookmark["episodeUrl"]
  ): Promise<PossibleTab> => {
    const tabs: Tab[] = await this.getCurrentTabs();
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
    const tabs: Tab[] = await this.getCurrentTabs();
    const withEpisodeUrl: Tab | undefined =
      this.findTabWithUrlLikeEpisode(tabs);
    return withEpisodeUrl || null;
  };

  private handleMissingTab = (): never => {
    throw new Error("No tab with a Netflix episode was found.");
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
  public get1stEpisodeTabAndTime = async (): Promise<EpisodeTabAndTime> => {
    const episodeTab: PossibleTab = await this.findOneEpisodeTab();
    if (!episodeTab) return this.handleMissingTab();
    const time: EpisodeTime = await this.findAndValidateEpisodeTime(episodeTab);
    return { time, tab: episodeTab };
  };

  /**
   * * This function is being injected into the Netflix episode's tab.
   */
  /* eslint-disable @typescript-eslint/no-unsafe-return */
  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  /* eslint-disable @typescript-eslint/no-unsafe-call */
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  private setTimeInBrowser = (
    timeMs: Bookmark["timeMs"]
  ): ResultOfSettingTime => {
    const { videoPlayer } = netflix.appContext.state.playerApp.getAPI();
    const [sessionId] = videoPlayer.getAllPlayerSessionIds();
    const player = videoPlayer.getVideoPlayerBySessionId(sessionId);
    player.seek(timeMs);
    return { success: true };
  };
  /* eslint-enable @typescript-eslint/no-unsafe-return */
  /* eslint-enable @typescript-eslint/no-unsafe-member-access */
  /* eslint-enable @typescript-eslint/no-unsafe-call */
  /* eslint-enable @typescript-eslint/no-unsafe-assignment */

  private getEpisodeTabId = async (): Promise<number> => {
    const { tab }: EpisodeTabAndTime = await this.get1stEpisodeTabAndTime();
    /**
     * We assert this type because the tab is guaranteed to have an ID.
     */
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return tab.id!;
  };

  private injectScriptToSetTime = async (
    timeMs: Bookmark["timeMs"]
  ): Promise<InjectionResult[]> => {
    return this.scriptsRepo.executeScript({
      target: { tabId: await this.getEpisodeTabId() },
      /**
       * We overwrite the type because Chrome's types are wrong.
       */
      func: this.setTimeInBrowser as unknown as InjectedFunc,
      args: [timeMs],
      world: "MAIN",
    });
  };

  private getIfIsUnsuccessfulInjectionResult = ({
    result,
  }: InjectionResult): boolean => {
    const resultWithType = result as ResultOfSettingTime | undefined;
    /**
     * If there's an error, it might not return a "success" status of false. So,
     * we should check if it is not true.
     */
    return resultWithType?.success !== true;
  };

  private findUnsuccessfulInjectionResult = (
    results: InjectionResult[]
  ): PossibleResult => {
    return results.find(this.getIfIsUnsuccessfulInjectionResult);
  };

  private getIfWasSuccessful = (
    results: InjectionResult[]
  ): ResultOfSettingTime["success"] => {
    if (!results.length) return false;
    const unsuccessfulResult: PossibleResult =
      this.findUnsuccessfulInjectionResult(results);
    return !unsuccessfulResult;
  };

  public trySettingTime = async (
    timeMs: Bookmark["timeMs"]
  ): Promise<ResultOfSettingTime> => {
    const results: InjectionResult[] = await this.injectScriptToSetTime(timeMs);
    /**
     * When we execute a script against the Netflix tab, it returns an injection
     * result with some information. We must analyze these results to determine if
     * everything the time was actually set.
     **/
    return { success: this.getIfWasSuccessful(results) };
  };
}
