import React, { useContext } from "react";
import { BookmarksContextValue } from "./BookmarksProvider";
import { SearchContext, SearchContextValue } from "./SearchProvider";
import BookmarksListWithLoader, {
  BookmarksListWithLoaderProps,
} from "./BookmarksList/BookmarksListWithLoader";
import { Bookmark } from "../bookmarks/Bookmarks.repo-abstraction";

interface Props {
  possibleBookmarks: BookmarksContextValue["bookmarks"];
}

export default function BookmarkSearchResults({ possibleBookmarks }: Props) {
  const { query }: SearchContextValue = useContext(SearchContext);

  const getIfBookmarkMatchesQuery = (bookmark: Bookmark): boolean => {
    const queryPattern = new RegExp(query, "gi");
    return queryPattern.test(bookmark.name);
  };

  const filterBookmarksByQuery = (): Bookmark[] => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return possibleBookmarks!.filter(getIfBookmarkMatchesQuery);
  };

  const getBookmarks =
    (): BookmarksListWithLoaderProps["possibleBookmarks"] => {
      if (!possibleBookmarks) return null;
      return filterBookmarksByQuery();
    };

  return <BookmarksListWithLoader possibleBookmarks={getBookmarks()} />;
}
