import { Button } from "@mui/material";
import React, { useContext } from "react";
import {
  BookmarkCreationDialogContext,
  BookmarkCreationDialogContextValue,
} from "./BookmarkCreationDialog/BookmarkCreationDialogProvider";

export default function BookmarkCreationButton(): JSX.Element {
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
        letterSpacing: "-0.02225rem",
        borderRadius: "0.3125rem",
        boxShadow: 0,
      }}
      onClick={open}
    >
      Add Bookmark
    </Button>
  );
}
