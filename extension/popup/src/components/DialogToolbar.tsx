import { AppBar, Toolbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PageContainer from "./PageContainer";

interface Props {
  // TODO: Refactor
  close: () => void;
}

export function DialogToolbar({ close }: Props) {
  return (
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
  );
}
