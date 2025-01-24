import ResourceItem from "../../ResourceItem";
import { Bookmark } from "../../../bookmarks/Bookmarks.repo-abstraction";
import DeleteBookmarkButton from "./DeleteBookmarkButton";
import BookmarkTitle from "./BookmarkTitle";
import BookmarkSecondaryText from "./BookmarkSecondaryText";

export interface BookmarkItemProps {
  bookmark: Bookmark;
  showEpisode?: boolean;
}

export default function BookmarkItem({
  bookmark,
  showEpisode,
}: BookmarkItemProps) {
  const { seriesName, episodeName } = bookmark;

  type SecondaryTxt = Bookmark["seriesName" | "episodeName"];
  const secondaryTxt: SecondaryTxt = showEpisode ? episodeName : seriesName;

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
        {secondaryTxt ? (
          <BookmarkSecondaryText secondaryTxt={secondaryTxt} />
        ) : null}
      </div>
      <DeleteBookmarkButton bookmarkId={bookmark.id} />
    </ResourceItem>
  );
}
