import { Typography } from "@mui/material";
import React from "react";

export const SeriesSubtitle = () => {
  return (
    <Typography
      textTransform="uppercase"
      sx={{
        fontSize: "0.875rem",
        fontWeight: "bold",
        letterSpacing: "-0.0187rem",
        marginBottom: "3px",
      }}
    >
      Series
    </Typography>
  );
};
