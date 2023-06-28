import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import {
  BookmarksRepoAbstraction,
  FieldsToCreateBookmark,
} from "./Bookmarks.repo-abstraction";
import { Bookmark } from "./Bookmarks.service";
import { StoredItems } from "./storageMock";
import { getChrome } from "../chrome.service";

/**
 * We created a repo for this just in case we decide to switch to a database in
 * the future.
 */
export class BookmarksRepo extends BookmarksRepoAbstraction {
  private chrome = getChrome();

  public create = async (
    creationFields: FieldsToCreateBookmark
  ): Promise<void> => {
    const id: string = uuidv4();
    await this.chrome.storage.local.set({ [id]: creationFields });
  };

  private getStoredItems = async (): Promise<StoredItems> => {
    // We must assert this type because Chrome's types are wrong.
    const storageKey = null as unknown as string;
    return this.chrome.storage.local.get(storageKey);
  };

  private addBookmarkFromStoredItem = (
    bookmarks: Bookmark[],
    storedValue: unknown,
    key: keyof StoredItems
  ): Bookmark[] => {
    const id = key as string;
    const bookmarkFields = storedValue as FieldsToCreateBookmark;
    const bookmark: Bookmark = { ...bookmarkFields, id };
    return [...bookmarks, bookmark];
  };

  public list = async (): Promise<Bookmark[]> => {
    const storedItems: StoredItems = await this.getStoredItems();
    return _.reduce(storedItems, this.addBookmarkFromStoredItem, []);
  };

  public destroy = async (id: Bookmark["id"]): Promise<void> => {
    return new Promise((resolve) => resolve());
  };
}
