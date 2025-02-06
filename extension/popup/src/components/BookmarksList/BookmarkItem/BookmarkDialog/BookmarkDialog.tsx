import { Dialog, Typography } from "@mui/material";
import { useCallback } from "react";
import {
  DialogInfo,
  DialogInfoProvider,
  useDialogInfo,
} from "../../../DialogInfoProvider";
import { DialogToolbar } from "../../../DialogToolbar";
import PageContainer from "../../../PageContainer";
import { BookmarkDialogContents } from "./BookmarkDialogContents/BookmarkDialogContents";
import { Bookmark } from "../../../../bookmarks/Bookmarks.repo-abstraction";
import { EditingBtnAndDialog } from "./EditingBtnAndDialog";
import {
  BookmarkDialogInfo,
  useBookmarkDialogInfo,
} from "../../../BookmarkDialogInfoProvider";

type Props = {
  bookmark: Bookmark;
};

export const BookmarkDialog = ({ bookmark }: Props) => {
  const { setIdOfBookmarkToView, idOfBookmarkToView }: BookmarkDialogInfo =
    useBookmarkDialogInfo();

  const setIsOpen = useCallback(
    (newIsOpen: boolean) => {
      if (newIsOpen) throw new Error("Open functionality not implemented");
      setIdOfBookmarkToView(null);
    },
    [setIdOfBookmarkToView]
  );

  const dialogInfo: DialogInfo = useDialogInfo({
    isOpen: Boolean(idOfBookmarkToView),
    setIsOpen,
  });

  return (
    <DialogInfoProvider {...dialogInfo}>
      <Dialog open={dialogInfo.isOpen} onClose={dialogInfo.close} fullScreen>
        <DialogToolbar endBtn={<EditingBtnAndDialog bookmark={bookmark} />} />
        <PageContainer>
          <Typography variant="h1" sx={{ marginBottom: "2.13rem" }}>
            Bookmark Info
          </Typography>
          <BookmarkDialogContents bookmark={bookmark} />
        </PageContainer>
      </Dialog>
    </DialogInfoProvider>
  );
};
