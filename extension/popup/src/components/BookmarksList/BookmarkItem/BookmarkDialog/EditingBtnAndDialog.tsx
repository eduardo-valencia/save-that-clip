import React, { useCallback } from "react";
import { Bookmark } from "../../../../bookmarks/Bookmarks.repo-abstraction";
import {
  DialogInfo,
  DialogInfoProvider,
  useDialogInfo,
} from "../../../DialogInfoProvider";
import { IconButton } from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import { DialogToCreateOrEditBookmark } from "../../../DialogToCreateOrEditBookmark";
import { BookmarkForm, BookmarkFormProps } from "../../../BookmarkForm";
import { BookmarksService } from "../../../../bookmarks/Bookmarks.service";
import { toast } from "sonner";

type Props = {
  bookmark: Bookmark;
};

export const EditingBtnAndDialog = ({ bookmark }: Props) => {
  const dialogInfo: DialogInfo = useDialogInfo();

  const handleSubmission: BookmarkFormProps["onSubmit"] = useCallback(
    async (fields) => {
      const bookmarkService = new BookmarksService();
      await bookmarkService.update({ id: bookmark.id, ...fields });
      toast.success("Bookmark updated", { duration: 5000 });
    },
    [bookmark.id]
  );

  return (
    <DialogInfoProvider {...dialogInfo}>
      <IconButton onClick={dialogInfo.open} aria-label="Edit bookmark">
        <Edit />
      </IconButton>
      <DialogToCreateOrEditBookmark title="Edit Bookmark">
        <BookmarkForm defaultValues={bookmark} onSubmit={handleSubmission} />
      </DialogToCreateOrEditBookmark>
    </DialogInfoProvider>
  );
};
