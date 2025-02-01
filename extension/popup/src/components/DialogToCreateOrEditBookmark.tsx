import { Dialog, Typography } from "@mui/material";
import PageContainer from "./PageContainer";
import { DialogInfo, useDialogContext } from "./DialogInfoProvider";
import CreationForm from "../pages/Bookmarks/BookmarkCreationDialog/CreationForm";
import { DialogToolbar } from "./DialogToolbar";

export type CloseCreationDialog = () => void;

export const DialogToCreateOrEditBookmark = (): JSX.Element => {
  const { close, isOpen }: DialogInfo = useDialogContext();

  return (
    <Dialog onClose={close} open={isOpen} fullScreen>
      <DialogToolbar />
      <PageContainer>
        <Typography variant="h1" sx={{ marginBottom: "2.13rem" }}>
          Add Bookmark
        </Typography>
        <CreationForm />
      </PageContainer>
    </Dialog>
  );
};
