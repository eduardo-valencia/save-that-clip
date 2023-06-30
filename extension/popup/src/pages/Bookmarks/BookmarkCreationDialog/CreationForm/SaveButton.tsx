import React from "react";
import FormActionButton from "./FormActionButton";

export default function SaveButton() {
  return (
    <FormActionButton type="submit" variant="contained" color="primary">
      Save
    </FormActionButton>
  );
}
