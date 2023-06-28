import _ from "lodash";
import { EpisodeService, EpisodeTabAndTime } from "../episodes/Episode.service";
import {
  PossibleSeriesName,
  SeriesInfoService,
} from "../seriesInfo/SeriesInfo.service";
import { BookmarksRepo } from "./Bookmarks.repo";
import {
  Bookmark,
  RepoFieldsToCreateBookmark as RepoCreationFields,
} from "./Bookmarks.repo-abstraction";

export type FieldsToCreateBookmark = Pick<Bookmark, "name">;

interface Options {
  seriesInfoService?: SeriesInfoService;
  episodeService?: EpisodeService;
}

type EpisodeUrlAndTime = Pick<RepoCreationFields, "episodeUrl" | "timeMs">;

export class BookmarksService {
  private repo = new BookmarksRepo();

  private seriesInfo: SeriesInfoService;

  private episodeService: EpisodeService;

  constructor(options: Options = {}) {
    this.seriesInfo = options.seriesInfoService || new SeriesInfoService();
    this.episodeService = options.episodeService || new EpisodeService();
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

  public create = async (fields: FieldsToCreateBookmark): Promise<void> => {
    const repoFields: RepoCreationFields = await this.getRepoCreationFields(
      fields
    );
    await this.repo.create(repoFields);
  };

  public find = async (fields?: Partial<Bookmark>): Promise<Bookmark[]> => {
    const bookmarks: Bookmark[] = await this.repo.list();
    if (!fields) return bookmarks;
    return _.filter(bookmarks, fields);
  };

  public destroy = async (id: Bookmark["id"]): Promise<void> => {
    await this.repo.destroy(id);
  };

  public open = async (id: Bookmark["id"]): Promise<void> => {};
}
