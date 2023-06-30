import React, { useContext, useState } from "react";
import { Bookmark } from "../../../../bookmarks/Bookmarks.repo-abstraction";
import BookmarkNameField from "./BookmarkNameField";
import { Box } from "@mui/material";
import CancelButton from "./CancelButton";
import SaveButton from "./SaveButton";
import {
  BookmarkCreationDialogContextValue,
  BookmarkCreationDialogContext,
} from "../BookmarkCreationDialogProvider";
import FormError from "./FormError";
import { BookmarksService } from "../../../../bookmarks/Bookmarks.service";

export interface FormErrorInfo {
  error: unknown;
}

type PossibleErrorInfo = null | FormErrorInfo;

export default function CreationForm() {
  const bookmarksService = new BookmarksService();

  const [name, setName] = useState<Bookmark["name"]>("");

  const [error, setError] = useState<PossibleErrorInfo>(null);

  const { close }: BookmarkCreationDialogContextValue = useContext(
    BookmarkCreationDialogContext
  );

  // todo: Refresh list of bookmarks
  const saveBookmarkAndClose = async (): Promise<void> => {
    await bookmarksService.create({ name });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    close!();
  };

  const handleError = (error: unknown): void => {
    console.error(error);
    setError({ error });
  };

  const trySavingBookmark = async (): Promise<void> => {
    try {
      await saveBookmarkAndClose();
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmission = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    void trySavingBookmark();
  };

  return (
    <form onSubmit={handleSubmission}>
      <Box sx={{ marginBottom: "4.13rem" }}>
        {error ? <FormError errorInfo={error} /> : null}
        <BookmarkNameField setName={setName} name={name} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <CancelButton />
        <SaveButton />
      </Box>
    </form>
  );
}
