import { Button } from "@mui/material";
import { Bookmark } from "../../../bookmarks/Bookmarks.repo-abstraction";
import ResourceItemTitle from "../../ResourceItemTitle";
import { BookmarksService } from "../../../bookmarks/Bookmarks.service";

interface Props {
  bookmark: Bookmark;
}

export default function BookmarkTitle({ bookmark }: Props) {
  const bookmarksService = new BookmarksService();

  const openBookmark = (): void => {
    void bookmarksService.open(bookmark.id);
  };

  return (
    <Button
      variant="text"
      aria-label="Open bookmark"
      onClick={openBookmark}
      sx={{ p: 0, minWidth: 0, ":hover": { backgroundColor: "initial" } }}
    >
      <ResourceItemTitle>{bookmark.name}</ResourceItemTitle>
    </Button>
  );
}
