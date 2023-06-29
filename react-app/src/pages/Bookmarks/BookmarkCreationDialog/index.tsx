import { AppBar, Dialog, IconButton, Toolbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { BookmarkCreationDialogInfo } from "../Bookmarks";
import PageContainer from "../../../components/PageContainer";

type Props = BookmarkCreationDialogInfo;

export const BookmarkCreationDialog = ({
  isOpen,
  setIsOpen,
}: Props): JSX.Element => {
  const close = (): void => {
    setIsOpen(false);
  };

  return (
    <Dialog onClose={close} open={isOpen} fullScreen>
      <AppBar
        sx={{
          position: "static",
          boxShadow: "none",
          marginBottom: "2.44rem",
          padding: 0,
        }}
        color="transparent"
      >
        <Toolbar disableGutters>
          <PageContainer
            sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
          >
            <IconButton edge="end" onClick={close} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </PageContainer>
        </Toolbar>
      </AppBar>
      <PageContainer>
        <p>Test</p>
      </PageContainer>
    </Dialog>
  );
};
