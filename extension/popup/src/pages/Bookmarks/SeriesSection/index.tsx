import React, { useContext } from "react";
import {
  BookmarksContext,
  BookmarksContextValue,
} from "../../../components/BookmarksProvider";
import SeriesList from "./SeriesList";
import BookmarksLoadingIndicator from "../../../components/BookmarksLoadingIndicator";

export default function SeriesSection() {
  const { bookmarks: possibleBookmarks }: BookmarksContextValue =
    useContext(BookmarksContext);

  /*
    We cannot pass SeriesList directly and we must still check whether
    possibleBookmarks exists. Otherwise, we would accidentally render it,
    which would cause it to crash.
  */

  return (
    <BookmarksLoadingIndicator
      progressElementId="series-progress"
      possibleBookmarks={possibleBookmarks}
    >
      {possibleBookmarks ? <SeriesList /> : null}
    </BookmarksLoadingIndicator>
  );
}
