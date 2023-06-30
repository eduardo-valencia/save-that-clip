import { Button, ButtonProps } from "@mui/material";
import React from "react";

export default function FormActionButton({ sx = {}, ...other }: ButtonProps) {
  return <Button sx={{ px: "1.875rem", ...sx }} {...other} />;
}
