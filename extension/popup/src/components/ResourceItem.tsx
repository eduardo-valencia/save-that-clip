import { Box, BoxProps } from "@mui/material";
import React from "react";

export default function ResourceItem(props: BoxProps) {
  return (
    <Box
      component="li"
      sx={{
        mb: "1.5rem",
        paddingBottom: "0.88rem",
        borderBottom: "0.0625rem solid #A9ABBD",
        listStyle: "none",
      }}
      {...props}
    />
  );
}
