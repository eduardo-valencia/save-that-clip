import React from "react";
import { Bookmark } from "../../../../../bookmarks/Bookmarks.repo-abstraction";
import { BookmarkField } from "./BookmarkField";
import { Box, Button } from "@mui/material";
import DeleteBookmarkButton from "./DeleteBookmarkButton";
import { DialogInfo, useDialogContext } from "../../../../DialogInfoProvider";
import { bookmarksService } from "../../../../../bookmarks/Bookmarks.service";

type Props = {
  bookmark: Bookmark;
};

export const BookmarkDialogContents = ({ bookmark }: Props) => {
  const { close }: DialogInfo = useDialogContext();
  const { id, name, seriesName, episodeName } = bookmark;
  // TODO: See if any of these fields need to be formatted
  return (
    <div>
      <BookmarkField title="Name">{name}</BookmarkField>
      <BookmarkField title="Series">{seriesName}</BookmarkField>
      <BookmarkField title="Episode">{episodeName}</BookmarkField>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "3.4375rem",
        }}
      >
        <DeleteBookmarkButton bookmarkId={id} />
        <Button
          variant="contained"
          onClick={close}
          href={bookmarksService.getUrlWithTime(bookmark)}
          target="_blank"
        >
          Open
        </Button>
      </Box>
    </div>
  );
};
