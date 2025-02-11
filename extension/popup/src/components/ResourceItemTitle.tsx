import { Typography, TypographyProps } from "@mui/material";
import React from "react";

export default function ResourceItemTitle({ sx, ...other }: TypographyProps) {
  return (
    <Typography
      variant="h2"
      sx={{
        fontSize: "1.25rem",
        fontWeight: 500,
        lineHeight: "1.75rem",
        letterSpacing: "-0.025rem",
        color: "black",
        ...sx,
      }}
      {...other}
    />
  );
}
