import ResourceItem from "../../ResourceItem";
import { Bookmark } from "../../../bookmarks/Bookmarks.repo-abstraction";
import BookmarkTitle from "./BookmarkTitle";
import BookmarkSecondaryText from "./BookmarkSecondaryText";
import { IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { DialogInfo } from "../../DialogInfoProvider";
import {
  BookmarkDialogInfo,
  useBookmarkDialogInfo,
} from "../../BookmarkDialogInfoProvider";
import { useMemo } from "react";

export interface BookmarkItemProps {
  bookmark: Bookmark;
  showEpisode?: boolean;
}

export default function BookmarkItem({
  bookmark,
  showEpisode,
}: BookmarkItemProps) {
  const { seriesName, episodeName } = bookmark;
  const { setIdOfBookmarkToView, idOfBookmarkToView }: BookmarkDialogInfo =
    useBookmarkDialogInfo();

  const dialogInfo: DialogInfo = useMemo(() => {
    const open = (): void => {
      setIdOfBookmarkToView(bookmark.id);
    };

    const close = (): void => {
      setIdOfBookmarkToView(null);
    };

    return { open, close, isOpen: Boolean(idOfBookmarkToView) };
  }, [bookmark.id, idOfBookmarkToView, setIdOfBookmarkToView]);

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
      <IconButton onClick={dialogInfo.open} aria-label="Open bookmark info">
        <InfoIcon />
      </IconButton>
    </ResourceItem>
  );
}
