import React, { useContext, useState } from "react";
import { Box } from "@mui/material";
import { Bookmark } from "../bookmarks/Bookmarks.repo-abstraction";
import BookmarkNameField from "../pages/Bookmarks/BookmarkCreationDialog/CreationForm/BookmarkNameField";
import { useDialogContext, DialogInfo } from "./DialogInfoProvider";
import FormError from "../pages/Bookmarks/BookmarkCreationDialog/CreationForm/FormError/FormError";
import { BookmarksContextValue, BookmarksContext } from "./BookmarksProvider";
import FormButtonsToolbar from "../pages/Bookmarks/BookmarkCreationDialog/CreationForm/FormButtonsToolbar";
import LoadingIndicator from "./LoadingIndicator";
import { ErrorReporterService } from "../errorReporter/ErrorReporter.service";

export interface FormErrorInfo {
  error: unknown;
}
type PossibleErrorInfo = null | FormErrorInfo;
type IsLoading = boolean;
type FormFields = Pick<Bookmark, "name">;

export interface BookmarkFormProps {
  onSubmit: (fields: FormFields) => Promise<void>;
  defaultValues?: FormFields;
}

export function BookmarkForm({ onSubmit, defaultValues }: BookmarkFormProps) {
  const errorReporterService = new ErrorReporterService();

  const [name, setName] = useState<Bookmark["name"]>(defaultValues?.name ?? "");

  const [error, setError] = useState<PossibleErrorInfo>(null);

  const [isSubmitting, setIsSubmitting] = useState<IsLoading>(false);

  const {
    findAndSetBookmarks,
    isRefreshing: isRefreshingBookmarks,
  }: BookmarksContextValue = useContext(BookmarksContext);

  const { close }: DialogInfo = useDialogContext();

  const saveBookmarkAndRefreshAndClose = async (): Promise<void> => {
    await onSubmit({ name });
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
    setIsSubmitting(true);
    await trySavingBookmark();
    setIsSubmitting(false);
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
        {isSubmitting || isRefreshingBookmarks ? (
          <LoadingIndicator />
        ) : (
          <BookmarkNameField setName={setName} name={name} />
        )}
      </Box>
      {isSubmitting ? null : <FormButtonsToolbar />}
    </form>
  );
}
