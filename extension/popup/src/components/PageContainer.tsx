import { Box, BoxProps } from "@mui/material";

/**
 * Defines the padding for the page. Note that this is also used in certain
 * components, so we shouldn't put styles like overflow styles  here.
 */
export default function PageContainer({ sx, ...other }: BoxProps) {
  return <Box sx={{ px: "1.5rem", ...sx }} {...other} />;
}
