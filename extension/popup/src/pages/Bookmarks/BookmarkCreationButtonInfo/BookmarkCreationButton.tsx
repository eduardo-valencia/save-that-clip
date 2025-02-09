import { Button } from "@mui/material";
import React, { useContext } from "react";
import {
  BookmarkCreationDialogContext,
  BookmarkCreationDialogContextValue,
} from "../BookmarkCreationDialog/BookmarkCreationDialogProvider";
import { IsButtonDisabled } from ".";

interface Props {
  disabled: IsButtonDisabled;
}

export default function BookmarkCreationButton({
  disabled,
}: Props): JSX.Element {
  const { open }: BookmarkCreationDialogContextValue = useContext(
    BookmarkCreationDialogContext
  );

  return (
    <Button
      variant="contained"
      color="primary"
      sx={{
        width: "9.0625rem",
        px: "0.56rem",
        py: "0.75rem",
        boxShadow: 0,
      }}
      onClick={open}
      disabled={disabled}
    >
      Add Bookmark
    </Button>
  );
}
