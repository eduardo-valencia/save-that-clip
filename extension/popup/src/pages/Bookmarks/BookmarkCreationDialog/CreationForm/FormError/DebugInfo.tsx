import { Typography, TypographyProps } from "@mui/material";
import React from "react";

type Props = Pick<TypographyProps, "children">;

export const DebugInfo = ({ children }: Props): JSX.Element => {
  return (
    <>
      <Typography
        variant="h3"
        color="error"
        sx={{ fontSize: "1rem", fontWeight: 500, mt: "1rem" }}
      >
        Debug Info
      </Typography>
      <Typography color="error">{children}</Typography>
    </>
  );
};
