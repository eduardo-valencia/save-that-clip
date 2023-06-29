import { Dialog } from "@mui/material";
import PageContainer from "../../../components/PageContainer";
import BookmarkCreationDialogToolbar from "./BookmarkCreationDialogToolbar";
import { useContext } from "react";
import {
  BookmarkCreationDialogContextValue,
  BookmarkCreationDialogContext,
} from "./BookmarkCreationDialogProvider";

export type CloseCreationDialog = () => void;

export const BookmarkCreationDialog = (): JSX.Element => {
  const { close, isOpen }: BookmarkCreationDialogContextValue = useContext(
    BookmarkCreationDialogContext
  );

  return (
    <Dialog onClose={close} open={isOpen} fullScreen>
      <BookmarkCreationDialogToolbar />
      <PageContainer>
        <p>Test</p>
      </PageContainer>
    </Dialog>
  );
};
