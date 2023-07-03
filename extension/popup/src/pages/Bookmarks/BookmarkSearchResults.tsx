import React, { useContext } from "react";
import {
  BookmarksContextValue,
  BookmarksContext,
} from "../../components/BookmarksProvider";
import {
  SearchContext,
  SearchContextValue,
} from "../../components/SearchProvider";

export default function BookmarkSearchResults() {
  const { bookmarks }: BookmarksContextValue = useContext(BookmarksContext);
  const { query }: SearchContextValue = useContext(SearchContext);

  return <div>BookmarkSearchResults</div>;
}
