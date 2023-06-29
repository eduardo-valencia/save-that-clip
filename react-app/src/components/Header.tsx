import { Box, Typography } from "@mui/material";
import React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function Header({ title, children }: Props) {
  return (
    <Box sx={{ marginBottom: "2.5rem" }}>
      <Typography variant="h1" sx={{ marginBottom: "2.69rem" }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}
