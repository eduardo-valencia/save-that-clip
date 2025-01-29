import React, { useContext } from "react";
import {
  PossibleDialogInfo,
  DialogContext,
} from "../../BookmarkCreationDialogProvider";
import FormActionButton from "../FormActionButton";

export default function CancelButton() {
  const { close }: PossibleDialogInfo = useContext(DialogContext);
  return (
    <FormActionButton
      variant="outlined"
      color="error"
      type="button"
      onClick={close}
    >
      Cancel
    </FormActionButton>
  );
}
