import React, { useContext, useState } from "react";
import { Box } from "@mui/material";
import { Bookmark } from "../../../../bookmarks/Bookmarks.repo-abstraction";
import BookmarkNameField from "./BookmarkNameField";
import {
  BookmarkCreationDialogContextValue,
  BookmarkCreationDialogContext,
} from "../BookmarkCreationDialogProvider";
import FormError from "./FormError";
import { BookmarksService } from "../../../../bookmarks/Bookmarks.service";
import {
  BookmarksContextValue,
  BookmarksContext,
} from "../../../../components/BookmarksProvider";
import FormButtonsToolbar from "./FormButtonsToolbar";
import LoadingIndicator from "../../../../components/LoadingIndicator";

export interface FormErrorInfo {
  error: unknown;
}

type PossibleErrorInfo = null | FormErrorInfo;

type IsLoading = boolean;

export default function CreationForm() {
  const bookmarksService = new BookmarksService();

  const [name, setName] = useState<Bookmark["name"]>("");

  const [error, setError] = useState<PossibleErrorInfo>(null);

  const [isLoading, setIsLoading] = useState<IsLoading>(false);

  const { findAndSetBookmarks }: BookmarksContextValue =
    useContext(BookmarksContext);

  const { close }: BookmarkCreationDialogContextValue = useContext(
    BookmarkCreationDialogContext
  );

  const saveBookmarkAndClose = async (): Promise<void> => {
    setIsLoading(true);
    await bookmarksService.create({ name });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await findAndSetBookmarks!();
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmission = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setError(null);
    void trySavingBookmark();
  };

  return (
    <form onSubmit={handleSubmission}>
      <Box sx={{ marginBottom: "4.13rem" }}>
        {error ? <FormError errorInfo={error} /> : null}
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <BookmarkNameField setName={setName} name={name} />
        )}
      </Box>
      {isLoading ? null : <FormButtonsToolbar />}
    </form>
  );
}
