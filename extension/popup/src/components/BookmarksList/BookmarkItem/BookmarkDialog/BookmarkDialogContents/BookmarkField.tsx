import { Box, Typography } from "@mui/material";
import React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
};

export const BookmarkField = ({ title, children }: Props) => {
  return (
    <Box sx={{ mb: "1rem" }}>
      <Typography variant="h3" component="h2">
        {title}
      </Typography>
      <Typography>{children || "Unknown"}</Typography>
    </Box>
  );
};
