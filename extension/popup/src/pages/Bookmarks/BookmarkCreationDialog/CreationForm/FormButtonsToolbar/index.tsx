import { Box } from "@mui/material";
import React from "react";
import CancelButton from "./CancelButton";
import SaveButton from "./SaveButton";

export default function FormButtonsToolbar() {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <CancelButton />
      <SaveButton />
    </Box>
  );
}
