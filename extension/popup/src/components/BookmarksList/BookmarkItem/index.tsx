import ResourceItem from "../../ResourceItem";
import { Typography } from "@mui/material";
import { Bookmark } from "../../../bookmarks/Bookmarks.repo-abstraction";
import { defaultSeriesName } from "../../../seriesInfo/seriesConfig";
import DeleteBookmarkButton from "./DeleteBookmarkButton";
import BookmarkTitle from "./BookmarkTitle";

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
        <Typography sx={{ fontSize: "0.875rem", lineHeight: "1.5rem" }}>
          {bookmark.seriesName || defaultSeriesName}
        </Typography>
      </div>
      <DeleteBookmarkButton bookmarkId={bookmark.id} />
    </ResourceItem>
  );
}
