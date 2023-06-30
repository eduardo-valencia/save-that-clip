import { Dialog, Typography } from "@mui/material";
import PageContainer from "../../../components/PageContainer";
import BookmarkCreationDialogToolbar from "./BookmarkCreationDialogToolbar";
import { useContext } from "react";
import {
  BookmarkCreationDialogContextValue,
  BookmarkCreationDialogContext,
} from "./BookmarkCreationDialogProvider";
import CreationForm from "./CreationForm";

export type CloseCreationDialog = () => void;

export const BookmarkCreationDialog = (): JSX.Element => {
  const { close, isOpen }: BookmarkCreationDialogContextValue = useContext(
    BookmarkCreationDialogContext
  );

  return (
    <Dialog onClose={close} open={isOpen} fullScreen>
      <BookmarkCreationDialogToolbar />
      <PageContainer>
        <Typography variant="h1" sx={{ marginBottom: "2.13rem" }}>
          Add Bookmark
        </Typography>
        <CreationForm />
      </PageContainer>
    </Dialog>
  );
};
