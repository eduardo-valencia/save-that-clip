import { v4 as uuidv4 } from "uuid";
import {
  Bookmark,
  BookmarksRepoAbstraction,
  RepoFieldsToCreateBookmark,
} from "./Bookmarks.repo-abstraction";
import { getChrome } from "../../../main/common/chrome.service";
import _ from "lodash";
import { NotFoundError } from "../errors/NotFound.error";

export interface StoredData {
  bookmarks?: Bookmark[];
}

type FieldsToPick = "id";
type FieldsToUpdateBookmark = Pick<Bookmark, FieldsToPick> &
  Omit<Partial<Bookmark>, FieldsToPick>;

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

  private setBookmarks = async (bookmarks: Bookmark[]): Promise<void> => {
    await this.chrome.storage.local.set({ bookmarks } as StoredData);
  };

  public create = async (
    fields: RepoFieldsToCreateBookmark
  ): Promise<Bookmark> => {
    const bookmark: Bookmark = this.createBookmarkFields(fields);
    const bookmarks: Bookmark[] = await this.getBookmarksWithNewOne(bookmark);
    await this.setBookmarks(bookmarks);
    return bookmark;
  };

  private getStoredItems = async (): Promise<StoredData> => {
    return this.chrome.storage.local.get("bookmarks" as keyof StoredData);
  };

  public list = async (): Promise<Bookmark[]> => {
    const storedItems: StoredData = await this.getStoredItems();
    return storedItems.bookmarks || [];
  };

  private listAndCloneBookmarks = async (): Promise<Bookmark[]> => {
    const bookmarks: Bookmark[] = await this.list();
    return _.cloneDeep(bookmarks);
  };

  public update = async ({
    id,
    ...updateFields
  }: FieldsToUpdateBookmark): Promise<void> => {
    const clonedBookmarks: Bookmark[] = await this.listAndCloneBookmarks();
    const bookmark: Bookmark | undefined = _.find(clonedBookmarks, { id });
    if (bookmark) Object.assign(bookmark, updateFields);
    else throw new NotFoundError();
  };

  public destroy = async (id: Bookmark["id"]): Promise<void> => {
    const bookmarks: Bookmark[] = await this.list();
    _.remove(bookmarks, { id });
    await this.setBookmarks(bookmarks);
  };
}
