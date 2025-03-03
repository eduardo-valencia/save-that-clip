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

  const showSuccessMsg = (id: Bookmark["id"]): void => {
    const btn = <BtnToViewBookmark onClick={() => setIdOfBookmarkToView(id)} />;
    toast.success("Bookmark saved", {
      duration: Infinity,
      action: btn,
    });
  };

  useEffect(() => {
    showSuccessMsg("1");
  }, [showSuccessMsg]);

  const handleSubmission = useCallback<BookmarkFormProps["onSubmit"]>(
    async (fields) => {
      const bookmarksService = new BookmarksService();
      const bookmark: Bookmark = await bookmarksService.create(fields);
      showSuccessMsg(bookmark.id);
    },
    []
  );

  return <BookmarkForm onSubmit={handleSubmission} />;
}
