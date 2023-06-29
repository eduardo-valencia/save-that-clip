import { Button } from "@mui/material";
import React from "react";

export default function BookmarkCreationButton() {
  return (
    <Button
      variant="contained"
      color="primary"
      sx={{
        width: "9.0625rem",
        marginLeft: "auto",
        px: "0.56rem",
        py: "0.75rem",
        letterSpacing: "-0.02225rem",
      }}
    >
      Add Bookmark
    </Button>
  );
}
