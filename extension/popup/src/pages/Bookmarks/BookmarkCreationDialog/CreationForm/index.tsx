import { useCallback } from "react";
import { toast } from "sonner";
import { BookmarksService } from "../../../../bookmarks/Bookmarks.service";
import {
  BookmarkForm,
  BookmarkFormProps,
} from "../../../../components/BookmarkForm";
import { useBookmarkDialogInfo } from "../../../../components/BookmarkDialogAndProvider/BookmarkDialogAndProvider";
import { Bookmark } from "../../../../bookmarks/Bookmarks.repo-abstraction";

export default function CreationForm() {
  const { setIdOfBookmarkToView } = useBookmarkDialogInfo();

  const handleSubmission = useCallback<BookmarkFormProps["onSubmit"]>(
    async (fields) => {
      const showSuccessMsg = (id: Bookmark["id"]): void => {
        toast.success("Bookmark saved", {
          duration: 5000,
          action: { label: "View", onClick: () => setIdOfBookmarkToView(id) },
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
