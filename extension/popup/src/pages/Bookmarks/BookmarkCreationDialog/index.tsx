import { Dialog, Typography } from "@mui/material";
import PageContainer from "../../../components/PageContainer";
import {
  DialogInfo,
  useDialogContext,
} from "../../../components/DialogInfoProvider";
import CreationForm from "./CreationForm";
import { DialogToolbar } from "../../../components/DialogToolbar";

export type CloseCreationDialog = () => void;

export const BookmarkCreationDialog = (): JSX.Element => {
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
