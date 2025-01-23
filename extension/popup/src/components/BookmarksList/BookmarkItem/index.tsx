import ResourceItem from "../../ResourceItem";
import { Bookmark } from "../../../bookmarks/Bookmarks.repo-abstraction";
import DeleteBookmarkButton from "./DeleteBookmarkButton";
import BookmarkTitle from "./BookmarkTitle";
import BookmarkSecondaryText from "./BookmarkSecondaryText";

interface Props {
  bookmark: Bookmark;
}

export default function BookmarkItem({ bookmark }: Props) {
  return (
    <ResourceItem
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <BookmarkTitle bookmark={bookmark} />
        <BookmarkSecondaryText secondaryTxt={bookmark.seriesName} />
      </div>
      <DeleteBookmarkButton bookmarkId={bookmark.id} />
    </ResourceItem>
  );
}
