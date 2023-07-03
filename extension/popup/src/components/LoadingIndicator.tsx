import { Box, CircularProgress } from "@mui/material";
import React from "react";

export interface LoadingIndicatorProps {
  /**
   * @see CircularProgress to learn how this helps accessibility.
   */
  progressElementId: string;
}

export default function LoadingIndicator(props: LoadingIndicatorProps) {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <CircularProgress variant="indeterminate" id={props.progressElementId} />
    </Box>
  );
}
