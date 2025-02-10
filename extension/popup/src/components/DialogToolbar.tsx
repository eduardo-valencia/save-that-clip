import { AppBar, Toolbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PageContainer from "./PageContainer";
import { DialogInfo, useDialogContext } from "./DialogInfoProvider";
import React from "react";

interface Props {
  extraBtn?: React.ReactNode;
}

export function DialogToolbar({ extraBtn }: Props) {
  const { close }: DialogInfo = useDialogContext();

  return (
    <AppBar
      sx={{
        position: "static",
        boxShadow: "none",
        marginBottom: "2.44rem",
        padding: "0.5rem 0 0 0",
      }}
      color="transparent"
    >
      <Toolbar disableGutters>
        <PageContainer
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: extraBtn ? "space-between" : "flex-end",
          }}
        >
          <IconButton
            edge={extraBtn ? "start" : "end"}
            onClick={close}
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>
          {extraBtn}
        </PageContainer>
      </Toolbar>
    </AppBar>
  );
}
