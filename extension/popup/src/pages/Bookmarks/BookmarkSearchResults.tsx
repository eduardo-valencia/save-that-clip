import React, { useContext } from "react";
import {
  BookmarksContextValue,
  BookmarksContext,
} from "../../components/BookmarksProvider";
import {
  SearchContext,
  SearchContextValue,
} from "../../components/SearchProvider";
import BookmarksListWithLoader, {
  BookmarksListWithLoaderProps,
} from "../../components/BookmarksList/BookmarksListWithLoader";
import { Bookmark } from "../../bookmarks/Bookmarks.repo-abstraction";

export default function BookmarkSearchResults() {
  const { bookmarks }: BookmarksContextValue = useContext(BookmarksContext);
  const { query }: SearchContextValue = useContext(SearchContext);

  const getIfBookmarkMatchesQuery = (): boolean => {
    const queryPattern = new RegExp(query, "gi");
    return queryPattern.test(query);
  };

  const filterBookmarksByQuery = (): Bookmark[] => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return bookmarks!.filter(getIfBookmarkMatchesQuery);
  };

  const getBookmarks =
    (): BookmarksListWithLoaderProps["possibleBookmarks"] => {
      if (!bookmarks) return null;
      return filterBookmarksByQuery();
    };

  return <BookmarksListWithLoader possibleBookmarks={getBookmarks()} />;
}
