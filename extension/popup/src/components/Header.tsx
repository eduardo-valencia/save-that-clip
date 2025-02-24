import { Box, BoxProps, Typography } from "@mui/material";
import React from "react";

export interface HeaderProps extends BoxProps {
  title: string;
  before: React.ReactNode;
  children: React.ReactNode;
}

export default function Header({
  title,
  before,
  children,
  sx = {},
  ...other
}: HeaderProps) {
  return (
    <Box sx={{ marginBottom: "2.5rem", ...sx }} {...other}>
      {before}
      <Typography variant="h1" sx={{ marginBottom: "2.69rem" }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}
