import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import {
  Bookmark,
  BookmarksRepoAbstraction,
  RepoFieldsToCreateBookmark,
} from "./Bookmarks.repo-abstraction";
import { StoredItems } from "./storageMock";
import { getChrome } from "../../../main/common/chrome.service";

type FieldsToStore = Omit<Bookmark, "id">;

/**
 * We created a repo for this just in case we decide to switch to a database in
 * the future.
 */
export class BookmarksRepo extends BookmarksRepoAbstraction {
  private chrome = getChrome();

  private createBookmarkFields = (
    creationFields: RepoFieldsToCreateBookmark
  ): FieldsToStore => {
    return { ...creationFields, type: "bookmark" };
  };

  public create = async (
    creationFields: RepoFieldsToCreateBookmark
  ): Promise<Bookmark> => {
    const id: string = uuidv4();
    const bookmark: FieldsToStore = this.createBookmarkFields(creationFields);
    await this.chrome.storage.local.set({ [id]: bookmark });
    return { ...bookmark, id };
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
    const bookmarkFields = storedValue as FieldsToStore;
    const bookmark: Bookmark = { ...bookmarkFields, id };
    return [...bookmarks, bookmark];
  };

  public list = async (): Promise<Bookmark[]> => {
    const storedItems: StoredItems = await this.getStoredItems();
    return _.reduce(storedItems, this.addBookmarkFromStoredItem, []);
  };

  public destroy = async (id: Bookmark["id"]): Promise<void> => {
    await this.chrome.storage.local.remove(id);
  };
}
