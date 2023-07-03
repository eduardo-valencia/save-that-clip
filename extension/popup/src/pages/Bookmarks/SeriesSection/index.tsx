import React, { useContext } from "react";
import {
  BookmarksContext,
  BookmarksContextValue,
} from "../../../components/BookmarksProvider";
import LoadingIndicator, {
  LoadingIndicatorProps,
} from "../../../components/LoadingIndicator";
import SeriesList from "./SeriesList";

export default function SeriesSection() {
  const { bookmarks: possibleBookmarks }: BookmarksContextValue =
    useContext(BookmarksContext);

  const progressElementId: LoadingIndicatorProps["progressElementId"] =
    "series-progress";

  return (
    <div
      aria-describedby={`#${progressElementId}`}
      aria-busy={!possibleBookmarks}
    >
      {possibleBookmarks ? (
        <LoadingIndicator progressElementId={progressElementId} />
      ) : (
        <SeriesList />
      )}
    </div>
  );
}
