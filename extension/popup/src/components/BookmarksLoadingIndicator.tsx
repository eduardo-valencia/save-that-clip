import React, { useContext } from "react";
import LoadingIndicator, { LoadingIndicatorProps } from "./LoadingIndicator";
import { BookmarksContext, BookmarksContextValue } from "./BookmarksProvider";

export interface BookmarksLoadingIndicatorProps
  extends Pick<LoadingIndicatorProps, "progressElementId"> {
  children: React.ReactNode;
}

/**
 * Only loads its children after the bookmarks load.
 */
export default function BookmarksLoadingIndicator({
  children,
  progressElementId,
}: BookmarksLoadingIndicatorProps) {
  const { isRefreshing }: BookmarksContextValue = useContext(BookmarksContext);

  return (
    <div
      aria-describedby={progressElementId ? `#${progressElementId}` : undefined}
      aria-busy={isRefreshing}
    >
      {isRefreshing ? (
        <LoadingIndicator progressElementId={progressElementId} />
      ) : (
        children
      )}
    </div>
  );
}
