import React, { useContext } from "react";
import {
  BookmarkCreationDialogContextValue,
  BookmarkCreationDialogContext,
} from "../BookmarkCreationDialogProvider";
import FormActionButton from "./FormActionButton";

export default function CancelButton() {
  const { close }: BookmarkCreationDialogContextValue = useContext(
    BookmarkCreationDialogContext
  );
  return (
    <FormActionButton
      variant="outlined"
      color="error"
      type="button"
      onClick={close}
    >
      Cancel
    </FormActionButton>
  );
}
