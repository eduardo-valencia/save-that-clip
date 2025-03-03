import React, { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { BookmarksService } from "../../../../bookmarks/Bookmarks.service";
import {
  BookmarkForm,
  BookmarkFormProps,
} from "../../../../components/BookmarkForm";
import { Bookmark } from "../../../../bookmarks/Bookmarks.repo-abstraction";
import { BtnToViewBookmark } from "./BtnToViewBookmark";
import { useBookmarkDialogInfo } from "../../../../components/BookmarkDialogAndProvider/BookmarkDialogAndProvider";

export default function CreationForm() {
  const { setIdOfBookmarkToView } = useBookmarkDialogInfo();

  const handleSubmission = useCallback<BookmarkFormProps["onSubmit"]>(
    async (fields) => {
      const getClickHandler = (bookmarkId: Bookmark["id"], toastId: string) => {
        return (): void => {
          setIdOfBookmarkToView(bookmarkId);
          toast.dismiss(toastId);
        };
      };

      const showSuccessMsg = (id: Bookmark["id"]): void => {
        const toastId = `bookmark-${id}`;
        const handleClick = getClickHandler(id, toastId);
        toast.success("Bookmark saved", {
          duration: 5000,
          id: toastId,
          action: <BtnToViewBookmark onClick={handleClick} />,
        });
      };

      const bookmarksService = new BookmarksService();
      const bookmark: Bookmark = await bookmarksService.create(fields);
      showSuccessMsg(bookmark.id);
    },
    [setIdOfBookmarkToView]
  );

  return <BookmarkForm onSubmit={handleSubmission} />;
}
