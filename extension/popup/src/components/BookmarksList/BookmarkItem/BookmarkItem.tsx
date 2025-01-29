import ResourceItem from "../../ResourceItem";
import { Bookmark } from "../../../bookmarks/Bookmarks.repo-abstraction";
import BookmarkTitle from "./BookmarkTitle";
import BookmarkSecondaryText from "./BookmarkSecondaryText";
import { IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import {
  DialogContext,
  DialogInfo,
  useDialogInfo,
} from "../../DialogInfoProvider";
import { BookmarkDialog } from "./BookmarkDialog/BookmarkDialog";

export interface BookmarkItemProps {
  bookmark: Bookmark;
  showEpisode?: boolean;
}

export default function BookmarkItem({
  bookmark,
  showEpisode,
}: BookmarkItemProps) {
  const dialogInfo: DialogInfo = useDialogInfo();

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
      <IconButton onClick={dialogInfo.open} aria-label="Open bookmark info">
        <InfoIcon />
      </IconButton>
      <DialogContext.Provider value={dialogInfo}>
        <BookmarkDialog bookmark={bookmark} />
      </DialogContext.Provider>
    </ResourceItem>
  );
}
