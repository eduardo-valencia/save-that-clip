import { Button, Typography } from "@mui/material";
import { Bookmark } from "../../../bookmarks/Bookmarks.repo-abstraction";
import { BookmarksService } from "../../../bookmarks/Bookmarks.service";
import _ from "lodash";

interface Props {
  bookmark: Bookmark;
}

export default function BookmarkTitle({ bookmark }: Props) {
  const bookmarksService = new BookmarksService();

  const openBookmarkAndCloseWindow = async (): Promise<void> => {
    await bookmarksService.open(bookmark.id);
    window.close();
  };

  const handleClick = (): void => {
    void openBookmarkAndCloseWindow();
  };

  return (
    <Button
      variant="text"
      aria-label="Open bookmark"
      onClick={handleClick}
      sx={{
        p: 0,
        minWidth: 0,
        ":hover": { backgroundColor: "initial" },
        textAlign: "left",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontSize: "1.25rem",
          fontWeight: 500,
          lineHeight: "1.75rem",
          letterSpacing: "-0.025rem",
          color: "black",
        }}
      >
        {_.truncate(bookmark.name, { length: 45 })}
      </Typography>
    </Button>
  );
}
