import { BookmarksService } from "./Bookmarks.service";

/**
 * We export this separately from the bookmarks service. Otherwise, this
 * wouldn't mocked correctly in the unit tests, which would cause them to fail.
 */
export const bookmarksService = new BookmarksService();
