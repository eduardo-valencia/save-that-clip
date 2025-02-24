import { Typography } from "@mui/material";
import React from "react";

export default function DisabledReason() {
  return (
    <Typography
      sx={{
        fontWeight: 500,
        fontSize: "0.875rem",
        letterSpacing: "-0.01875rem",
        mb: "0.81rem",
        // TODO: Maybe refactor this color (code duplication)
        color: "#65676E",
      }}
    >
      To add a bookmark, start watching an episode on Netflix and click on the
      extension while on the page.
    </Typography>
  );
}
