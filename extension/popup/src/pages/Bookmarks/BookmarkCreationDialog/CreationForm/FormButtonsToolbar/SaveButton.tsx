import React from "react";
import FormActionButton from "../FormActionButton";
import Check from "@mui/icons-material/Check";

export default function SaveButton() {
  return (
    <FormActionButton
      type="submit"
      variant="contained"
      color="primary"
      endIcon={<Check />}
    >
      Save
    </FormActionButton>
  );
}
