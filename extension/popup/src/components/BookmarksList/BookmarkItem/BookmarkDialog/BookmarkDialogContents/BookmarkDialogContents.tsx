import React from "react";
import { Bookmark } from "../../../../../bookmarks/Bookmarks.repo-abstraction";
import { BookmarkField } from "./BookmarkField";
import { Box } from "@mui/material";
import DeleteBookmarkButton from "./DeleteBookmarkButton";
import _ from "lodash";
import { BookmarkOpenBtn } from "./BookmarkOpenBtn";

type Props = {
  bookmark: Bookmark;
};

export const BookmarkDialogContents = ({ bookmark }: Props) => {
  const { id, name, seriesName, episodeName } = bookmark;

  return (
    <div>
      <BookmarkField title="Name">
        {_.truncate(name, { length: 75 })}
      </BookmarkField>
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
        <BookmarkOpenBtn bookmark={bookmark} />
      </Box>
    </div>
  );
};
