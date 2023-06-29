import { Button } from "@mui/material";
import React from "react";
import { BookmarkCreationDialogInfo } from "./Bookmarks";

type Props = Pick<BookmarkCreationDialogInfo, "setIsOpen">;

export default function BookmarkCreationButton({
  setIsOpen,
}: Props): JSX.Element {
  const open = (): void => {
    setIsOpen(true);
  };

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
