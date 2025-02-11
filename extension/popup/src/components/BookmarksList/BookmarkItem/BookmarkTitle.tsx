import { Button } from "@mui/material";
import { Bookmark } from "../../../bookmarks/Bookmarks.repo-abstraction";
import ResourceItemTitle from "../../ResourceItemTitle";
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
      <ResourceItemTitle>
        {_.truncate(bookmark.name, { length: 45 })}
      </ResourceItemTitle>
    </Button>
  );
}
