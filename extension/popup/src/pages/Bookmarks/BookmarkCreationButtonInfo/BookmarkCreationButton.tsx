import { Button } from "@mui/material";
import React, { useContext } from "react";
import {
  DialogContext,
  PossibleDialogInfo,
} from "../BookmarkCreationDialog/BookmarkCreationDialogProvider";
import { IsButtonDisabled } from ".";

interface Props {
  disabled: IsButtonDisabled;
}

export default function BookmarkCreationButton({
  disabled,
}: Props): JSX.Element {
  const { open }: PossibleDialogInfo = useContext(DialogContext);

  return (
    <Button
      variant="contained"
      color="primary"
      sx={{
        width: "9.0625rem",
        px: "0.56rem",
        py: "0.75rem",
        boxShadow: 0,
      }}
      onClick={open}
      disabled={disabled}
    >
      Add Bookmark
    </Button>
  );
}
