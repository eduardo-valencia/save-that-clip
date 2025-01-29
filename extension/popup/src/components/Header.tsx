import { Box, BoxProps, Typography } from "@mui/material";
import React from "react";

export interface HeaderProps extends BoxProps {
  title: string;
  children: React.ReactNode;
}

export default function Header({
  title,
  children,
  sx = {},
  ...other
}: HeaderProps) {
  return (
    <Box sx={{ marginBottom: "2.5rem", ...sx }} {...other}>
      <Typography variant="h1" sx={{ marginBottom: "2.69rem" }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}
