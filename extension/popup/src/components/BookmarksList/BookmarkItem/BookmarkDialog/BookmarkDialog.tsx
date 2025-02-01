import { Dialog, Typography } from "@mui/material";
import React from "react";
import { DialogInfo, useDialogContext } from "../../../DialogInfoProvider";
import { DialogToolbar } from "../../../DialogToolbar";
import PageContainer from "../../../PageContainer";
import { BookmarkDialogContents } from "./BookmarkDialogContents/BookmarkDialogContents";
import { Bookmark } from "../../../../bookmarks/Bookmarks.repo-abstraction";
import { EditingBtnAndDialog } from "./EditingBtnAndDialog";

type Props = {
  bookmark: Bookmark;
};

export const BookmarkDialog = ({ bookmark }: Props) => {
  const { isOpen, close }: DialogInfo = useDialogContext();

  return (
    <Dialog open={isOpen} onClose={close} fullScreen>
      <DialogToolbar endBtn={<EditingBtnAndDialog bookmark={bookmark} />} />
      <PageContainer>
        <Typography variant="h1" sx={{ marginBottom: "2.13rem" }}>
          Bookmark Info
        </Typography>
        <BookmarkDialogContents bookmark={bookmark} />
      </PageContainer>
    </Dialog>
  );
};
