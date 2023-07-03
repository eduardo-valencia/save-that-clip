import React from "react";
import { Bookmark } from "../../../bookmarks/Bookmarks.repo-abstraction";
import { Button } from "@mui/material";

interface Props {
  bookmarkId: Bookmark["id"];
}

export default function DeleteBookmarkButton(props: Props) {
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: "rgba(255, 0, 0, 0.10)",
        color: "#FF0000",
        px: "0.715rem",
      }}
    >
      DeleteBookmarkButton
    </Button>
  );
}
