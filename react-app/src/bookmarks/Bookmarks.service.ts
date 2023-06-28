import { Bookmark } from "./Bookmarks.repo-abstraction";

export type FieldsToCreateBookmark = Pick<Bookmark, "name">;

export class BookmarksService {
  public create = async (fields: FieldsToCreateBookmark): Promise<void> => {};

  public find = async (): Promise<Bookmark[]> => {
    return [];
  };
}
