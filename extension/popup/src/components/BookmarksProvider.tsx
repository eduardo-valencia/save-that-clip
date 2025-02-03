import React, { useState, createContext, useEffect, useMemo } from "react";
import { Bookmark } from "../bookmarks/Bookmarks.repo-abstraction";
import { bookmarksService } from "../bookmarks/Bookmarks.service";

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

export const BookmarksContext = createContext<BookmarksContextValue>({
  bookmarks: defaultBookmarks,
  isRefreshing: true,
});

interface Props {
  children: React.ReactNode;
}

export const BookmarksProvider = ({ children }: Props): JSX.Element => {
  const [bookmarks, setBookmarks] =
    useState<PossibleBookmarks>(defaultBookmarks);
  const [isRefreshing, setIsRefreshing] =
    useState<BookmarksContextValue["isRefreshing"]>(false);

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
