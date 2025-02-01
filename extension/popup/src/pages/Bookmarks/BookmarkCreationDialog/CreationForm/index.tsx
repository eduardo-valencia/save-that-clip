import { useCallback } from "react";
import { BookmarksService } from "../../../../bookmarks/Bookmarks.service";
import { BookmarkForm, BookmarkFormProps } from "./BookmarkForm";

export default function CreationForm() {
  const handleSubmission = useCallback<BookmarkFormProps["onSubmit"]>(
    async (fields) => {
      const bookmarksService = new BookmarksService();
      await bookmarksService.create(fields);
    },
    []
  );

  return <BookmarkForm onSubmit={handleSubmission} />;
}
