import { Bookmark } from "./Bookmarks.service";

export type FieldsToCreateBookmark = Omit<Bookmark, "id">;

export abstract class BookmarksRepoAbstraction {
  /**
   * This must generate the ID instead of receiving it because most databases
   * generate their own IDs. If we switched to a database in the future, it
   * probably wouldn't accept an ID.
   */
  abstract create: (fields: FieldsToCreateBookmark) => Promise<void>;

  abstract list: () => Promise<Bookmark[]>;

  abstract destroy: (url: Bookmark["episodeUrl"]) => Promise<void>;
}
