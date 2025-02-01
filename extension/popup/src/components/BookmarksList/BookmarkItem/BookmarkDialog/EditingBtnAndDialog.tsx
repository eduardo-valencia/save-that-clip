import React, { useCallback } from "react";
import { Bookmark } from "../../../../bookmarks/Bookmarks.repo-abstraction";
import {
  DialogContext,
  DialogInfo,
  useDialogInfo,
} from "../../../DialogInfoProvider";
import { IconButton } from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import { DialogToCreateOrEditBookmark } from "../../../DialogToCreateOrEditBookmark";
import { BookmarkForm, BookmarkFormProps } from "../../../BookmarkForm";
import { BookmarksService } from "../../../../bookmarks/Bookmarks.service";

type Props = {
  bookmark: Bookmark;
};

export const EditingBtnAndDialog = ({ bookmark }: Props) => {
  const dialogInfo: DialogInfo = useDialogInfo();

  const handleSubmission: BookmarkFormProps["onSubmit"] = useCallback(
    (fields) => {
      const bookmarkService = new BookmarksService();
      return bookmarkService.update({ id: bookmark.id, ...fields });
    },
    [bookmark.id]
  );

  return (
    <DialogContext.Provider value={dialogInfo}>
      <IconButton onClick={dialogInfo.open} aria-label="Edit bookmark">
        <Edit />
      </IconButton>
      <DialogToCreateOrEditBookmark title="Edit Bookmark">
        <BookmarkForm defaultValues={bookmark} onSubmit={handleSubmission} />
      </DialogToCreateOrEditBookmark>
    </DialogContext.Provider>
  );
};
