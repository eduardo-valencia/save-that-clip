import { Dialog, Typography } from "@mui/material";
import PageContainer from "./PageContainer";
import { DialogInfo, useDialogContext } from "./DialogInfoProvider";
import { DialogToolbar } from "./DialogToolbar";
import React from "react";

export type CloseCreationDialog = () => void;

interface Props {
  title: string;
  children: React.ReactNode;
}

export const DialogToCreateOrEditBookmark = ({
  title,
  children,
}: Props): JSX.Element => {
  const { close, isOpen }: DialogInfo = useDialogContext();

  return (
    <Dialog onClose={close} open={isOpen} fullScreen>
      <DialogToolbar />
      <PageContainer>
        <Typography variant="h1" sx={{ marginBottom: "2.13rem" }}>
          {title}
        </Typography>
        {children}
      </PageContainer>
    </Dialog>
  );
};
