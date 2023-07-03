import React, { useState, createContext, useEffect } from "react";
import { Bookmark } from "../bookmarks/Bookmarks.repo-abstraction";
import { BookmarksService } from "../bookmarks/Bookmarks.service";

type PossibleBookmarks = Bookmark[] | null;

export interface BookmarksContextValue {
  bookmarks: PossibleBookmarks;
  findAndSetBookmarks?: () => Promise<void>;
}

const defaultBookmarks: PossibleBookmarks = null;

export const BookmarksContext = createContext<BookmarksContextValue>({
  bookmarks: defaultBookmarks,
});

interface Props {
  children: React.ReactNode;
}

// todo: If necessary, handle possibility that a Netflix tab isn't open.
export const BookmarksProvider = ({ children }: Props): JSX.Element => {
  const [bookmarks, setBookmarks] =
    useState<PossibleBookmarks>(defaultBookmarks);

  const findAndSetBookmarks = async (): Promise<void> => {
    // To indicate that it's loading.
    setBookmarks(null);
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
