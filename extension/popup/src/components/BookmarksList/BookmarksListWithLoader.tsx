import React from "react";
import { BookmarksContextValue } from "../BookmarksProvider";
import BookmarksLoadingIndicator from "../BookmarksLoadingIndicator";
import BookmarksList, { BookmarkListProps } from "./BookmarksList";

export interface BookmarksListWithLoaderProps
  extends Partial<Omit<BookmarkListProps, "bookmarks">> {
  possibleBookmarks: BookmarksContextValue["bookmarks"];
}

/**
 * Shows a loading indicator when there are no bookmarks in the Bookmarks
 * Provider. Otherwise, it renders the list of bookmarks.
 */
export default function BookmarksListWithLoader({
  possibleBookmarks,
  ...other
}: BookmarksListWithLoaderProps) {
  return (
    <BookmarksLoadingIndicator progressElementId="bookmarks-progress">
      {possibleBookmarks ? (
        <BookmarksList bookmarks={possibleBookmarks} {...other} />
      ) : null}
    </BookmarksLoadingIndicator>
  );
}
