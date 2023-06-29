import { Dialog } from "@mui/material";
import { BookmarkCreationDialogInfo } from "../Bookmarks";
import PageContainer from "../../../components/PageContainer";
import BookmarkCreationDialogToolbar from "./BookmarkCreationDialogToolbar";

type Props = BookmarkCreationDialogInfo;

export type CloseCreationDialog = () => void;

export const BookmarkCreationDialog = ({
  isOpen,
  setIsOpen,
}: Props): JSX.Element => {
  const close: CloseCreationDialog = () => {
    setIsOpen(false);
  };

  return (
    <Dialog onClose={close} open={isOpen} fullScreen>
      <BookmarkCreationDialogToolbar close={close} />
      <PageContainer>
        <p>Test</p>
      </PageContainer>
    </Dialog>
  );
};
