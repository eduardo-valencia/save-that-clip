import React from "react";
import { BookmarksContextValue } from "../BookmarksProvider";
import BookmarksLoadingIndicator from "../BookmarksLoadingIndicator";
import BookmarksList from "./BookmarksList";

export interface BookmarksListWithLoaderProps {
  possibleBookmarks: BookmarksContextValue["bookmarks"];
}

/**
 * Shows a loading indicator when there are no bookmarks in the Bookmarks
 * Provider. Otherwise, it renders the list of bookmarks.
 */
export default function BookmarksListWithLoader({
  possibleBookmarks,
}: BookmarksListWithLoaderProps) {
  return (
    <BookmarksLoadingIndicator
      progressElementId="bookmarks-progress"
      possibleBookmarks={possibleBookmarks}
    >
      {possibleBookmarks ? (
        <BookmarksList bookmarks={possibleBookmarks} />
      ) : null}
    </BookmarksLoadingIndicator>
  );
}
