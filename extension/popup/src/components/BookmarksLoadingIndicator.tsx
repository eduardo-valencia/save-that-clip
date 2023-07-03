import React from "react";
import { BookmarksContextValue } from "./BookmarksProvider";
import LoadingIndicator, { LoadingIndicatorProps } from "./LoadingIndicator";

interface Props extends Pick<LoadingIndicatorProps, "progressElementId"> {
  children: React.ReactNode;
  possibleBookmarks: BookmarksContextValue["bookmarks"];
}

/**
 * Only loads its children after the bookmarks load.
 */
export default function BookmarksLoadingIndicator({
  children,
  progressElementId,
  possibleBookmarks,
}: Props) {
  return (
    <div
      aria-describedby={`#${progressElementId}`}
      aria-busy={!possibleBookmarks}
    >
      {possibleBookmarks ? (
        children
      ) : (
        <LoadingIndicator progressElementId={progressElementId} />
      )}
    </div>
  );
}
