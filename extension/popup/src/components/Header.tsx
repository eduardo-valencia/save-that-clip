import { Box, BoxProps, Typography } from "@mui/material";
import React from "react";

interface Props extends BoxProps {
  title: string;
  children: React.ReactNode;
}

export default function Header({ title, children, sx = {}, ...other }: Props) {
  return (
    <Box sx={{ marginBottom: "2.5rem", ...sx }} {...other}>
      <Typography variant="h1" sx={{ marginBottom: "2.69rem" }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}
