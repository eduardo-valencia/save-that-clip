import React, { useContext } from "react";
import { Bookmark } from "../../../../../bookmarks/Bookmarks.repo-abstraction";
import { Button } from "@mui/material";
import {
  BookmarksContext,
  BookmarksContextValue,
} from "../../../../BookmarksProvider";
import { BookmarksService } from "../../../../../bookmarks/Bookmarks.service";

interface Props {
  bookmarkId: Bookmark["id"];
}

export default function DeleteBookmarkButton({ bookmarkId }: Props) {
  const { findAndSetBookmarks }: BookmarksContextValue =
    useContext(BookmarksContext);

  const bookmarksService = new BookmarksService();

  const deleteBookmarkAndRefreshBookmarks = async (): Promise<void> => {
    await bookmarksService.destroy(bookmarkId);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await findAndSetBookmarks!();
  };

  const handleClick = (): void => {
    void deleteBookmarkAndRefreshBookmarks();
  };

  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: "rgba(255, 0, 0, 0.10)",
        color: "#FF0000",
        px: "0.715rem",
        ":hover": {
          backgroundColor: "rgba(255, 0, 0, 0.3)",
        },
      }}
      onClick={handleClick}
    >
      Delete
    </Button>
  );
}
