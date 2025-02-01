import { AppBar, Toolbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PageContainer from "./PageContainer";
import { DialogInfo, useDialogContext } from "./DialogInfoProvider";
import React from "react";

interface Props {
  endBtn?: React.ReactNode;
}

export function DialogToolbar({ endBtn }: Props) {
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
            justifyContent: endBtn ? "space-between" : "flex-end",
          }}
        >
          <IconButton
            edge={endBtn ? "start" : "end"}
            onClick={close}
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>
          {endBtn}
        </PageContainer>
      </Toolbar>
    </AppBar>
  );
}
