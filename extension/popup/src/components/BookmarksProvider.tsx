import React, { useState, createContext, useEffect, useMemo } from "react";
import { Bookmark } from "../bookmarks/Bookmarks.repo-abstraction";
import { bookmarksService } from "../bookmarks/bookmarksService";
import { createContextGetterHook } from "../utils/client.utils";

type PossibleBookmarks = Bookmark[] | null;

/**
 * @param resetBookmarks Defaults to true.
 */
type FindAndSetBookmarks = (resetBookmarks?: boolean) => Promise<void>;

export interface BookmarksContextValue {
  bookmarks: PossibleBookmarks;
  isRefreshing: boolean;
  findAndSetBookmarks?: FindAndSetBookmarks;
}

const defaultBookmarks: PossibleBookmarks = null;

const DEFAULT_IS_REFRESHING = true;
export const BookmarksContext = createContext<BookmarksContextValue>({
  bookmarks: defaultBookmarks,
  /**
   * Whether it's loading for the first time, or fetching new data to replace
   * the existing list of bookmarks.
   */
  isRefreshing: DEFAULT_IS_REFRESHING,
});

export const useBookmarksContext = createContextGetterHook(
  BookmarksContext,
  "Bookmarks Context"
);

interface Props {
  children: React.ReactNode;
}

export const BookmarksProvider = ({ children }: Props): JSX.Element => {
  const [bookmarks, setBookmarks] =
    useState<PossibleBookmarks>(defaultBookmarks);
  const [isRefreshing, setIsRefreshing] = useState<
    BookmarksContextValue["isRefreshing"]
  >(DEFAULT_IS_REFRESHING);

  // Note: Update corresponding JS Doc comment if we update resetBookmark's
  // default value.
  const findAndSetBookmarks = async (): Promise<void> => {
    setIsRefreshing(true);
    const newBookmarks: Bookmark[] = await bookmarksService.find();
    setBookmarks(newBookmarks);
    setIsRefreshing(false);
  };

  useEffect(() => {
    void findAndSetBookmarks();
  }, []);

  const value: BookmarksContextValue = useMemo(() => {
    return { bookmarks, findAndSetBookmarks, isRefreshing };
  }, [bookmarks, isRefreshing]);

  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  );
};
