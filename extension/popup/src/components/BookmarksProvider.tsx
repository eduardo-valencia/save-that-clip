import React, { useState, createContext, useEffect } from "react";
import { Bookmark } from "../bookmarks/Bookmarks.repo-abstraction";
import { BookmarksService } from "../bookmarks/Bookmarks.service";

type PossibleBookmarks = Bookmark[] | null;

/**
 * @param resetBookmarks Defaults to true.
 */
type FindAndSetBookmarks = (resetBookmarks?: boolean) => Promise<void>;

export interface BookmarksContextValue {
  bookmarks: PossibleBookmarks;
  findAndSetBookmarks?: FindAndSetBookmarks;
}

const defaultBookmarks: PossibleBookmarks = null;

export const BookmarksContext = createContext<BookmarksContextValue>({
  bookmarks: defaultBookmarks,
});

interface Props {
  children: React.ReactNode;
}

export const BookmarksProvider = ({ children }: Props): JSX.Element => {
  const [bookmarks, setBookmarks] =
    useState<PossibleBookmarks>(defaultBookmarks);

  // Note: Update corresponding JS Doc comment if we update resetBookmark's
  // default value.
  const findAndSetBookmarks = async (resetBookmarks = true): Promise<void> => {
    // To indicate that it's loading.
    if (resetBookmarks) setBookmarks(null);
    const bookmarksService = new BookmarksService();
    const newBookmarks: Bookmark[] = await bookmarksService.find();
    setBookmarks(newBookmarks);
  };

  useEffect(() => {
    void findAndSetBookmarks();
  }, []);

  return (
    <BookmarksContext.Provider value={{ bookmarks, findAndSetBookmarks }}>
      {children}
    </BookmarksContext.Provider>
  );
};
