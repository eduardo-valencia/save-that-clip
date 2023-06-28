import { getChrome } from "../chrome.service";
import {
  BookmarksRepoAbstraction,
  FieldsToCreateBookmark,
  FieldsToFindBookmark,
} from "./Bookmarks.repo-abstraction";
import { Bookmark } from "./Bookmarks.service";
import { v4 as uuidv4 } from "uuid";

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

  public find = async (fields?: FieldsToFindBookmark): Promise<Bookmark[]> => {
    return new Promise((resolve) => resolve([]));
  };

  public destroy = async (id: Bookmark["id"]): Promise<void> => {
    return new Promise((resolve) => resolve());
  };
}
