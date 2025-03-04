import React, { useCallback } from "react";
import { toast } from "sonner";
import { BookmarksService } from "../../../../bookmarks/Bookmarks.service";
import {
  BookmarkForm,
  BookmarkFormProps,
} from "../../../../components/BookmarkForm";
import { Bookmark } from "../../../../bookmarks/Bookmarks.repo-abstraction";
import { BtnToViewBookmark } from "./BtnToViewBookmark";

export default function CreationForm() {
  const handleSubmission = useCallback<BookmarkFormProps["onSubmit"]>(
    async (fields) => {
      const showSuccessMsg = (id: Bookmark["id"]): void => {
        const toastId = `bookmark-${id}`;
        toast.success("Bookmark saved", {
          duration: 5000,
          id: toastId,
          action: <BtnToViewBookmark bookmarkId={id} toastId={toastId} />,
        });
      };

      const bookmarksService = new BookmarksService();
      const bookmark: Bookmark = await bookmarksService.create(fields);
      showSuccessMsg(bookmark.id);
    },
    []
  );

  return <BookmarkForm onSubmit={handleSubmission} />;
}
