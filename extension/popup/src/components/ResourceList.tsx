import { Box, BoxProps } from "@mui/material";
import React from "react";

export default function ResourceList(props: BoxProps) {
  return <Box component="ul" sx={{ pl: 0, my: 0 }} {...props} />;
}
