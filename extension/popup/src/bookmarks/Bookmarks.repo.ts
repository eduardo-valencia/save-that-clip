import { v4 as uuidv4 } from "uuid";
import {
  Bookmark,
  BookmarksRepoAbstraction,
  RepoFieldsToCreateBookmark,
} from "./Bookmarks.repo-abstraction";
import { getChrome } from "../../../main/common/chrome.service";
import _ from "lodash";

interface StoredData {
  bookmarks?: Bookmark[];
}

/**
 * We created a repo for this just in case we decide to switch to a database in
 * the future.
 */
export class BookmarksRepo extends BookmarksRepoAbstraction {
  private chrome = getChrome();

  private createBookmarkFields = (
    creationFields: RepoFieldsToCreateBookmark
  ): Bookmark => {
    const id: string = uuidv4();
    return { ...creationFields, type: "bookmark", id };
  };

  private getBookmarksWithNewOne = async (
    bookmark: Bookmark
  ): Promise<Bookmark[]> => {
    const bookmarks: Bookmark[] = await this.list();
    return [...bookmarks, bookmark];
  };

  public create = async (
    fields: RepoFieldsToCreateBookmark
  ): Promise<Bookmark> => {
    const bookmark: Bookmark = this.createBookmarkFields(fields);
    const bookmarks: Bookmark[] = await this.getBookmarksWithNewOne(bookmark);
    await this.chrome.storage.local.set({ bookmarks } as StoredData);
    return bookmark;
  };

  private getStoredItems = async (): Promise<StoredData> => {
    return this.chrome.storage.local.get("bookmarks" as keyof StoredData);
  };

  public list = async (): Promise<Bookmark[]> => {
    const storedItems: StoredData = await this.getStoredItems();
    return storedItems.bookmarks || [];
  };

  public destroy = async (id: Bookmark["id"]): Promise<void> => {
    const bookmarks: Bookmark[] = await this.list();
    _.remove(bookmarks, { id });
    // await this.chrome.storage.local.set({ bookmarks } as StoredData);
  };
}
