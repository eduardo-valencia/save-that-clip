import React, { useContext, useState } from "react";
import { Box } from "@mui/material";
import { Bookmark } from "../../../../bookmarks/Bookmarks.repo-abstraction";
import BookmarkNameField from "./BookmarkNameField";
import {
  useDialogContext,
  DialogInfo,
} from "../../../../components/DialogInfoProvider";
import FormError from "./FormError/FormError";
import { BookmarksService } from "../../../../bookmarks/Bookmarks.service";
import {
  BookmarksContextValue,
  BookmarksContext,
} from "../../../../components/BookmarksProvider";
import FormButtonsToolbar from "./FormButtonsToolbar";
import LoadingIndicator from "../../../../components/LoadingIndicator";
import { ErrorReporterService } from "../../../../errorReporter/ErrorReporter.service";

export interface FormErrorInfo {
  error: unknown;
}

type PossibleErrorInfo = null | FormErrorInfo;

type IsLoading = boolean;

export default function CreationForm() {
  const bookmarksService = new BookmarksService();
  const errorReporterService = new ErrorReporterService();

  const [name, setName] = useState<Bookmark["name"]>("");

  const [error, setError] = useState<PossibleErrorInfo>(null);

  const [isLoading, setIsLoading] = useState<IsLoading>(false);

  const { findAndSetBookmarks }: BookmarksContextValue =
    useContext(BookmarksContext);

  const { close }: DialogInfo = useDialogContext();

  const saveBookmarkAndRefreshAndClose = async (): Promise<void> => {
    await bookmarksService.create({ name });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await findAndSetBookmarks!();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    close();
  };

  const handleError = (error: unknown): void => {
    errorReporterService.captureExceptionAndLogError(error);
    setError({ error });
  };

  const trySavingBookmark = async (): Promise<void> => {
    try {
      await saveBookmarkAndRefreshAndClose();
    } catch (error) {
      handleError(error);
    }
  };

  const trySavingBookmarkAndUpdateIsLoading = async (): Promise<void> => {
    setIsLoading(true);
    await trySavingBookmark();
    setIsLoading(false);
  };

  const handleSubmission = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setError(null);
    void trySavingBookmarkAndUpdateIsLoading();
  };

  /**
   * We don't set a progressElementId on the loading indicator here because that
   * only enhances accessibility when the user expects a section to load and the
   * loading indicator describes that the section is loading. Here, we might
   * show an error once the form finishes submitting, but the user does not
   * expect that. Therefore, a progressElementId is useless.
   */
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
