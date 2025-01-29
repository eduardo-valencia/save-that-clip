import { Dialog, Typography } from "@mui/material";
import PageContainer from "../../../components/PageContainer";
import {
  DialogInfo,
  useDialogInfo,
} from "../../../components/DialogInfoProvider";
import CreationForm from "./CreationForm";
import { DialogToolbar } from "../../../components/DialogToolbar";

export type CloseCreationDialog = () => void;

export const BookmarkCreationDialog = (): JSX.Element => {
  const { close, isOpen }: DialogInfo = useDialogInfo();

  return (
    <Dialog onClose={close} open={isOpen} fullScreen>
      <DialogToolbar close={close} />
      <PageContainer>
        <Typography variant="h1" sx={{ marginBottom: "2.13rem" }}>
          Add Bookmark
        </Typography>
        <CreationForm />
      </PageContainer>
    </Dialog>
  );
};
