import { useCallback } from "react";
import { toast } from "sonner";
import { BookmarksService } from "../../../../bookmarks/Bookmarks.service";
import {
  BookmarkForm,
  BookmarkFormProps,
} from "../../../../components/BookmarkForm";

export default function CreationForm() {
  const handleSubmission = useCallback<BookmarkFormProps["onSubmit"]>(
    async (fields) => {
      const bookmarksService = new BookmarksService();
      await bookmarksService.create(fields);
      toast.success("Bookmark saved", { duration: 5000 });
    },
    []
  );

  return <BookmarkForm onSubmit={handleSubmission} />;
}
