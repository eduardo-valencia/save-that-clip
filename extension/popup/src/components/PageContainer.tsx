import { Box, BoxProps } from "@mui/material";

export default function PageContainer({ sx, ...other }: BoxProps) {
  return <Box sx={{ px: "1.5rem", ...sx }} {...other} />;
}
