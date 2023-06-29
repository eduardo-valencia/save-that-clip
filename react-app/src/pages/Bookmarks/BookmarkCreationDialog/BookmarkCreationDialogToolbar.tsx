import { AppBar, Toolbar, IconButton } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import PageContainer from "../../../components/PageContainer";
import { CloseCreationDialog } from ".";

interface Props {
  close: CloseCreationDialog;
}

export default function BookmarkCreationDialogToolbar({ close }: Props) {
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
