import React, { useContext, useState } from "react";
import { Bookmark } from "../../../../bookmarks/Bookmarks.repo-abstraction";
import BookmarkNameField from "./BookmarkNameField";
import { Box, Typography } from "@mui/material";
import CancelButton from "./CancelButton";
import SaveButton from "./SaveButton";
import {
  BookmarkCreationDialogContextValue,
  BookmarkCreationDialogContext,
} from "../BookmarkCreationDialogProvider";
// import { BookmarksService } from "../../../../bookmarks/Bookmarks.service";

type ErrorMessage = string | null;

export default function CreationForm() {
  const [name, setName] = useState<Bookmark["name"]>("");

  const [error, setError] = useState<ErrorMessage>(null);

  // const bookmarksService = new BookmarksService()

  const { close }: BookmarkCreationDialogContextValue = useContext(
    BookmarkCreationDialogContext
  );

  // eslint-disable-next-line @typescript-eslint/require-await
  const saveBookmarkAndClose = async (): Promise<void> => {
    console.log("submitted!");
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    close!();
    // await bookmarksService.create({})
  };

  const getDebugErrorMessage = (error: unknown): ErrorMessage => {
    if (error instanceof Error) {
      return `Debug info: ${error.name}: ${error.message}`;
    }
    return null;
  };

  const getErrorMessage = (error: unknown): string => {
    const debugMessage: ErrorMessage = getDebugErrorMessage(error);
    const baseMessage = "Sorry, there was a problem. Please try again later.";
    if (debugMessage) return `${baseMessage} ${debugMessage}`;
    return baseMessage;
  };

  const handleError = (error: unknown): void => {
    console.error(error);
    const message: string = getErrorMessage(error);
    setError(message);
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

  // todo: Validate that input has a name. It seems that setting it to
  // "required" will accomplish this, but we must test it.
  return (
    <form onSubmit={handleSubmission}>
      <Box sx={{ marginBottom: "4.13rem" }}>
        {error ? (
          <Typography color="error" sx={{ mb: "1rem" }}>
            {error}
          </Typography>
        ) : null}
        <BookmarkNameField setName={setName} name={name} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <CancelButton />
        <SaveButton />
      </Box>
    </form>
  );
}
