import { Dialog, Typography } from "@mui/material";
import React from "react";
import { DialogInfo, useDialogInfo } from "../../../DialogInfoProvider";
import { DialogToolbar } from "../../../DialogToolbar";
import PageContainer from "../../../PageContainer";
import { BookmarkDialogContents } from "./BookmarkDialogContents";
import { Bookmark } from "../../../../bookmarks/Bookmarks.repo-abstraction";

type Props = {
  bookmark: Bookmark;
};

export const BookmarkDialog = ({ bookmark }: Props) => {
  const { isOpen, close }: DialogInfo = useDialogInfo();

  // TODO: Refactor title
  return (
    <Dialog open={isOpen} onClose={close} fullScreen>
      <DialogToolbar />
      <PageContainer>
        <Typography variant="h1" sx={{ marginBottom: "2.13rem" }}>
          Bookmark Info
        </Typography>
        <BookmarkDialogContents bookmark={bookmark} />
      </PageContainer>
    </Dialog>
  );
};
