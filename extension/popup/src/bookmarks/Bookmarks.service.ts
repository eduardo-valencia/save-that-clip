import _ from "lodash";
import {
  EpisodeService,
  EpisodeTabAndInfo,
  PossibleTab,
  ResultOfSettingTime,
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
import { ErrorReporterService } from "../errorReporter/ErrorReporter.service";
import { NotFoundError } from "../errors/NotFound.error";

export type FieldsToCreateBookmark = Pick<Bookmark, "name">;

interface Options {
  seriesInfoService?: SeriesInfoService;
  episodeService?: EpisodeService;
  tabsRepo?: TabsRepoAbstraction;
}

type EpisodeUrlAndTime = Pick<RepoCreationFields, "episodeUrl" | "timeMs">;

export class BookmarksService {
  private repo = new BookmarksRepo();

  private tabsRepo: TabsRepoAbstraction;

  private seriesInfo: SeriesInfoService;

  private episodeService: EpisodeService;

  private errorReporterService = new ErrorReporterService();

  constructor(options: Options = {}) {
    this.seriesInfo = options.seriesInfoService || new SeriesInfoService();
    this.episodeService = options.episodeService || new EpisodeService();
    this.tabsRepo = options.tabsRepo || new TabsRepo();
  }

  private getTabUrl = ({ url }: EpisodeTabAndInfo["tab"]): string => {
    if (!url)
      throw new Error("Failed to get the URL from the tab with the episode.");
    return url;
  };

  /**
   * Netflix URLs can have a "t" param that sets the time, which could interfere
   * with us setting the episode's time. To prevent this, we remove the params.
   */
  private getUrlWithoutParams = (url: string): string => {
    const splitByParams: string[] = url.split("?");
    return splitByParams[0];
  };

  private createEpisodeUrl = (tab: EpisodeTabAndInfo["tab"]): string => {
    const tabUrl: string = this.getTabUrl(tab);
    return this.getUrlWithoutParams(tabUrl);
  };

  private getEpisodeInfoAndUrl = async (): Promise<EpisodeUrlAndTime> => {
    const { tab, info }: EpisodeTabAndInfo =
      await this.episodeService.get1stEpisodeTabAndInfo();
    return { ...info, episodeUrl: this.createEpisodeUrl(tab) };
  };

  private getSeriesName = (
    urlAndTime: EpisodeUrlAndTime
  ): Promise<PossibleSeriesName> => {
    return this.seriesInfo.findSeriesName(urlAndTime.episodeUrl);
  };

  private getRepoCreationFields = async (
    fields: FieldsToCreateBookmark
  ): Promise<RepoCreationFields> => {
    const infoAndUrl: EpisodeUrlAndTime = await this.getEpisodeInfoAndUrl();
    const seriesName: PossibleSeriesName = await this.getSeriesName(infoAndUrl);
    return { ...fields, ...infoAndUrl, seriesName };
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

  public update = this.repo.update;

  public destroy = async (id: Bookmark["id"]): Promise<void> => {
    await this.repo.destroy(id);
  };

  private validateOneBookmarkFound = (bookmarks: Bookmark[]): void => {
    if (bookmarks.length === 1) return;
    else if (bookmarks.length > 1)
      throw new Error("Found more than one bookmark.");
    throw new NotFoundError();
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

  public getUrlWithTime = (bookmark: Bookmark): string => {
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

  private reportFailingToSetTime = (): void => {
    this.errorReporterService.captureMessage(
      "Failed to update episode's time.",
      { level: "info" }
    );
  };

  private handleFailingToSetTime = async (
    bookmark: Bookmark
  ): Promise<void> => {
    await this.openBookmarkTabAtTime(bookmark);
    this.reportFailingToSetTime();
  };

  private setTimeOrOpenNewTab = async (bookmark: Bookmark): Promise<void> => {
    const result: ResultOfSettingTime =
      await this.episodeService.trySettingTime(bookmark.timeMs);
    if (!result.success) await this.handleFailingToSetTime(bookmark);
  };

  private createBookmarkTabOrUpdateIt = async (
    bookmark: Bookmark,
    tab: PossibleTab
  ): Promise<void> => {
    if (tab) await this.setTimeOrOpenNewTab(bookmark);
    else await this.openBookmarkTabAtTime(bookmark);
  };

  public open = async (id: Bookmark["id"]): Promise<void> => {
    const bookmark: Bookmark = await this.getById(id);
    const findTab = this.episodeService.findOneEpisodeTabWithSamePathAsUrl;
    const tab: PossibleTab = await findTab(bookmark.episodeUrl);
    await this.createBookmarkTabOrUpdateIt(bookmark, tab);
  };
}
