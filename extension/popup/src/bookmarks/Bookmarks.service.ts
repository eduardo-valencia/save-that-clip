/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import _ from "lodash";
import {
  EpisodeService,
  EpisodeTabAndTime,
  PossibleTab,
} from "../episodes/Episode.service";
import {
  PossibleSeriesName,
  SeriesInfoService,
} from "../seriesInfo/SeriesInfo.service";
import { BookmarksRepo } from "./Bookmarks.repo";
import {
  Bookmark,
  RepoFieldsToCreateBookmark as RepoCreationFields,
} from "./Bookmarks.repo-abstraction";
import { TabsRepo } from "../tabs/Tabs.repo";
import { TabsRepoAbstraction } from "../tabs/Tabs.repo-abstraction";

export type FieldsToCreateBookmark = Pick<Bookmark, "name">;

interface Options {
  seriesInfoService?: SeriesInfoService;
  episodeService?: EpisodeService;
  tabsRepo?: TabsRepoAbstraction;
}

type EpisodeUrlAndTime = Pick<RepoCreationFields, "episodeUrl" | "timeMs">;

/**
 * This is used in an injected script, but it is not actually accessible
 * anywhere besides the injected script. In other words, don't use this.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
declare const netflix: any;

type InjectedFunc = chrome.scripting.ScriptInjection["func"];

export class BookmarksService {
  private repo = new BookmarksRepo();

  private tabsRepo: TabsRepoAbstraction;

  private seriesInfo: SeriesInfoService;

  private episodeService: EpisodeService;

  constructor(options: Options = {}) {
    this.seriesInfo = options.seriesInfoService || new SeriesInfoService();
    this.episodeService = options.episodeService || new EpisodeService();
    this.tabsRepo = options.tabsRepo || new TabsRepo();
  }

  private getTabUrl = ({ url }: EpisodeTabAndTime["tab"]): string => {
    if (!url)
      throw new Error("Failed to get the URL from the tab with the episode.");
    return url;
  };

  private getEpisodeUrlAndTime = async (): Promise<EpisodeUrlAndTime> => {
    const { tab, time }: EpisodeTabAndTime =
      await this.episodeService.get1stEpisodeTabAndTime();
    return { timeMs: time, episodeUrl: this.getTabUrl(tab) };
  };

  private getSeriesName = (
    urlAndTime: EpisodeUrlAndTime
  ): Promise<PossibleSeriesName> => {
    return this.seriesInfo.findSeriesName(urlAndTime.episodeUrl);
  };

  private getRepoCreationFields = async (
    fields: FieldsToCreateBookmark
  ): Promise<RepoCreationFields> => {
    const urlAndTime: EpisodeUrlAndTime = await this.getEpisodeUrlAndTime();
    const seriesName: PossibleSeriesName = await this.getSeriesName(urlAndTime);
    return { ...fields, ...urlAndTime, seriesName };
  };

  private setTime = (bookmark: Bookmark): void => {
    const { videoPlayer } = netflix.appContext.state.playerApp.getAPI();
    const [sessionId] = videoPlayer.getAllPlayerSessionIds();
    const player = videoPlayer.getVideoPlayerBySessionId(sessionId);
    player.seek(bookmark.timeMs);
  };

  private getEpisodeTabId = async (): Promise<number> => {
    const { tab }: EpisodeTabAndTime =
      await this.episodeService.get1stEpisodeTabAndTime();
    /**
     * We assert this type because the tab is guaranteed to have an ID.
     */
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return tab.id!;
  };

  // todo: See if we should move this to the episode service.
  private injectScript = async (bookmark: Bookmark): Promise<void> => {
    await chrome.scripting.executeScript({
      target: { tabId: await this.getEpisodeTabId() },
      /**
       * We overwrite the type because Chrome's types are wrong.
       */
      func: this.setTime as unknown as InjectedFunc,
      args: [bookmark],
      world: "MAIN",
    });
  };

  public create = async (fields: FieldsToCreateBookmark): Promise<Bookmark> => {
    const repoFields: RepoCreationFields = await this.getRepoCreationFields(
      fields
    );
    return this.repo.create(repoFields);
  };

  public find = async (fields?: Partial<Bookmark>): Promise<Bookmark[]> => {
    const bookmarks: Bookmark[] = await this.repo.list();
    if (!fields) return bookmarks;
    return _.filter(bookmarks, fields);
  };

  public destroy = async (id: Bookmark["id"]): Promise<void> => {
    await this.repo.destroy(id);
  };

  private validateOneBookmarkFound = (bookmarks: Bookmark[]): void => {
    if (bookmarks.length === 1) return;
    else if (bookmarks.length > 1)
      throw new Error("Found more than one bookmark.");
    throw new Error("Unable to find a bookmark.");
  };

  private getById = async (id: Bookmark["id"]): Promise<Bookmark> => {
    const bookmarks: Bookmark[] = await this.find({ id });
    this.validateOneBookmarkFound(bookmarks);
    return bookmarks[0];
  };

  private getTimeInSeconds = (bookmark: Bookmark): number => {
    const timeInSeconds: number = bookmark.timeMs / 1000;
    return Math.floor(timeInSeconds);
  };

  private getUrlWithTime = (bookmark: Bookmark): string => {
    const url = new URL(bookmark.episodeUrl);
    const timeInSeconds: number = this.getTimeInSeconds(bookmark);
    /**
     * This parameter allows us to set the time.
     */
    url.searchParams.append("t", timeInSeconds.toString());
    return url.href;
  };

  private openBookmarkTabAtTime = async (bookmark: Bookmark): Promise<void> => {
    await this.tabsRepo.create({
      active: true,
      url: this.getUrlWithTime(bookmark),
    });
  };

  private createBookmarkTabOrUpdateIt = async (
    bookmark: Bookmark,
    tab: PossibleTab
  ): Promise<void> => {
    if (tab)
      await this.episodeService.sendMessageToSetEpisodeTime(bookmark.timeMs);
    else await this.openBookmarkTabAtTime(bookmark);
  };

  public open = async (id: Bookmark["id"]): Promise<void> => {
    const bookmark: Bookmark = await this.getById(id);
    const tab: PossibleTab = await this.episodeService.findOneEpisodeTabByUrl(
      bookmark.episodeUrl
    );
    await this.createBookmarkTabOrUpdateIt(bookmark, tab);
  };
}
