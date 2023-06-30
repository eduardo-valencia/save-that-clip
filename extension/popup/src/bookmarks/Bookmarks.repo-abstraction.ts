import { SeriesName } from "../seriesInfo/SeriesInfo.service";

export type RepoFieldsToCreateBookmark = Omit<Bookmark, "id" | "type">;

export interface Bookmark {
  /**
   * We add a type so that we can easily distinguish between bookmarks and other
   * stored items in case we decide to store other types of items in the future.
   */
  type: "bookmark";
  id: string;
  name: string;
  episodeUrl: string;
  seriesName: SeriesName | null;
  timeMs: number;
}

export abstract class BookmarksRepoAbstraction {
  /**
   * This must generate the ID instead of receiving it because most databases
   * generate their own IDs. If we switched to a database in the future, it
   * probably wouldn't accept an ID.
   */
  abstract create: (fields: RepoFieldsToCreateBookmark) => Promise<Bookmark>;

  abstract list: () => Promise<Bookmark[]>;

  abstract destroy: (url: Bookmark["episodeUrl"]) => Promise<void>;
}
