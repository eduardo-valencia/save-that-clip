import { AppBar, Toolbar, IconButton } from "@mui/material";
import React, { useContext } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PageContainer from "../../../components/PageContainer";
import {
  BookmarkCreationDialogContextValue,
  BookmarkCreationDialogContext,
} from "./BookmarkCreationDialogProvider";

export default function BookmarkCreationDialogToolbar() {
  const { close }: BookmarkCreationDialogContextValue = useContext(
    BookmarkCreationDialogContext
  );

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
