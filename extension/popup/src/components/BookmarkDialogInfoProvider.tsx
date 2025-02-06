import {
  createContext,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { Bookmark } from "../bookmarks/Bookmarks.repo-abstraction";
import { createContextGetterHook } from "../utils/client.utils";

type PossibleBookmarkId = Bookmark["id"] | null;
export interface BookmarkDialogInfo {
  idOfBookmarkToView: PossibleBookmarkId;
  setIdOfBookmarkToView: Dispatch<SetStateAction<PossibleBookmarkId>>;
}

type PossibleBookmarkDialogInfo = BookmarkDialogInfo | null;
const BookmarkDialogInfoContext =
  createContext<PossibleBookmarkDialogInfo>(null);

export const useBookmarkDialogInfo = createContextGetterHook(
  BookmarkDialogInfoContext,
  "Bookmark dialog info"
);

interface Props {
  children: React.ReactNode;
}

export const BookmarkDialogInfoProvider = ({ children }: Props) => {
  const [bookmarkId, setIdOfBookmarkToView] =
    useState<PossibleBookmarkId>(null);

  const value = useMemo((): BookmarkDialogInfo => {
    return { idOfBookmarkToView: bookmarkId, setIdOfBookmarkToView };
  }, [bookmarkId]);

  return (
    <BookmarkDialogInfoContext.Provider value={value}>
      {children}
    </BookmarkDialogInfoContext.Provider>
  );
};
