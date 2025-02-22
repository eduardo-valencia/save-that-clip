/**
 * TODO: Refactor this file. There shouldn't be so many things here
 */

import { EpisodeTime, Message, Messages } from "../../../main/common/messages";
import { TabsRepo } from "../tabs/Tabs.repo";
import { Tab, TabsRepoAbstraction } from "../tabs/Tabs.repo-abstraction";
import { Bookmark } from "../bookmarks/Bookmarks.repo-abstraction";
import {
  InjectionResult,
  ScriptsRepoAbstraction,
} from "../scripts/Scripts.repo-abstraction";
import { ScriptsRepo } from "../scripts/Scripts.repo";
import { NetflixEpisodeInfo } from "../../../main/contentScripts/NetflixEpisodeMessageHandler.service";
import { waitMs } from "../../../main/common/utils";
import {
  ResultOfSettingTime,
  trySeekingForNetflix,
} from "./NetflixSeeker.service";

interface Options {
  tabsRepo?: TabsRepoAbstraction;
  scriptsRepo?: ScriptsRepoAbstraction;
}

export type PossibleTab = Tab | null;

interface ValidNetflixEpisodeInfo extends NetflixEpisodeInfo {
  timeMs: EpisodeTime;
}
export interface EpisodeTabAndInfo {
  tab: Tab;
  info: ValidNetflixEpisodeInfo;
}

type InjectedFunc = chrome.scripting.ScriptInjection["func"];

type PossibleResult = InjectionResult | undefined;
type TabMatch = Tab | undefined;

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

  private getPathWithoutTrailingSlash = (path: string): string => {
    if (!path) return path;
    const lastCharIndex: number = path.length - 1;
    if (path[lastCharIndex] === "/") return path.substring(0, lastCharIndex);
    return path;
  };

  private getIfPathsAreEqual = (path1: string, path2: string): boolean => {
    const sanitizedUrl1: string = this.getPathWithoutTrailingSlash(path1);
    const sanitizedUrl2: string = this.getPathWithoutTrailingSlash(path2);
    return sanitizedUrl1 === sanitizedUrl2;
  };

  /**
   * We compare the path names to ensure the URLs are considered the same even
   * when the trailing slashes don't match. We also need to disregard query
   * parameters because tabs' URLs might have them, so they might prevent us
   * from matching a tab with a URL path.
   */
  private getGetIfTabUrlHasPathname = (pathname: URL["pathname"]) => {
    return (tab: Tab): boolean => {
      if (!tab.url) return false;
      const urlInstance = new URL(tab.url);
      return this.getIfPathsAreEqual(pathname, urlInstance.pathname);
    };
  };

  private getUrlPathAndFindTabWithSameOne = async (
    urlToGetPathFrom: Bookmark["episodeUrl"]
  ): Promise<TabMatch> => {
    const tabs: Tab[] = await this.getCurrentTabs();
    const { pathname } = new URL(urlToGetPathFrom);
    return tabs.find(this.getGetIfTabUrlHasPathname(pathname));
  };

  /**
   * Implementation notes:
   *
   * This won't find tabs with pending URLs. However, this is fine because a
   * pending tab would have unloaded content, so we wouldn't be able to change
   * the episode's time anyways.
   */
  public findOneEpisodeTabWithSamePathAsUrl = async (
    url: Bookmark["episodeUrl"]
  ): Promise<PossibleTab> => {
    const findTab = this.getUrlPathAndFindTabWithSameOne;
    const tabWithUrl: TabMatch = await findTab(url);
    return tabWithUrl || null;
  };

  public getIfTabHasUrlLikeEpisode = ({ url }: Tab): boolean => {
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

  private sendMessageToGetEpisodeInfo = async (episodeTab: Tab) => {
    const data: Message = { type: Messages.getNetflixEpisodeInfo };
    const { sendMessage } = this.tabsRepo;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return sendMessage(episodeTab.id!, data) as Promise<NetflixEpisodeInfo>;
  };

  private findAndValidateEpisodeInfo = async (
    episodeTab: Tab
  ): Promise<ValidNetflixEpisodeInfo> => {
    const episodeInfo: NetflixEpisodeInfo =
      await this.sendMessageToGetEpisodeInfo(episodeTab);
    if (episodeInfo.timeMs === null)
      throw new Error("Failed to get the episode's time.");
    return { ...episodeInfo, timeMs: episodeInfo.timeMs };
  };

  private get1stEpisodeTab = async (): Promise<Tab> => {
    const episodeTab: PossibleTab = await this.findOneEpisodeTab();
    if (!episodeTab) return this.handleMissingTab();
    return episodeTab;
  };

  /**
   * We must throw an error when a tab was not found because we would only call
   * this method when attempting to create a bookmark, and we expect a Netflix
   * tab to be open already.
   */
  public get1stEpisodeTabAndInfo = async (): Promise<EpisodeTabAndInfo> => {
    const episodeTab: Tab = await this.get1stEpisodeTab();
    const info: ValidNetflixEpisodeInfo = await this.findAndValidateEpisodeInfo(
      episodeTab
    );
    return { info, tab: episodeTab };
  };

  private getEpisodeTabId = async (): Promise<number> => {
    const tab: Tab = await this.get1stEpisodeTab();
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
      func: trySeekingForNetflix as unknown as InjectedFunc,
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

  private setScriptInjectionTimeout =
    async (): Promise<ResultOfSettingTime> => {
      await waitMs(3000);
      return { success: false };
    };

  private trySettingTimeWithoutTimeout = async (
    timeMs: Bookmark["timeMs"]
  ): Promise<ResultOfSettingTime> => {
    const results: InjectionResult[] = await this.injectScriptToSetTime(timeMs);
    const wasSuccessful = this.getIfWasSuccessful(results);
    if (!wasSuccessful) console.error(JSON.stringify(results, null, 2));
    /**
     * When we execute a script against the Netflix tab, it returns an injection
     * result with some information. We must analyze these results to determine if
     * the time was actually set.
     **/
    return { success: wasSuccessful };
  };

  // TODO: Maybe return a reason from here, and send the reason it timed out to
  // Sentry Alternatively, log it some other way
  public trySettingTime = (
    timeMs: Bookmark["timeMs"]
  ): Promise<ResultOfSettingTime> => {
    return Promise.race([
      this.trySettingTimeWithoutTimeout(timeMs),
      this.setScriptInjectionTimeout(),
    ]);
  };
}
