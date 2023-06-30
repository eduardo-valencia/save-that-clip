import { Box, Typography } from "@mui/material";
import React from "react";
import { FormErrorInfo } from ".";

interface Props {
  errorInfo: FormErrorInfo;
}

type DebugMessage = string | null;

export default function FormError({ errorInfo }: Props): JSX.Element {
  const getDebugErrorMessage = (): DebugMessage => {
    const { error } = errorInfo;
    if (error instanceof Error) {
      return `${error.name}: ${error.message}`;
    }
    return null;
  };

  type DebugInfo = JSX.Element | null;

  const renderDebugInfo = (message: string): DebugInfo => {
    return (
      <>
        <Typography
          variant="h3"
          color="error"
          sx={{ fontSize: "1rem", fontWeight: 500, mt: "1rem" }}
        >
          Debug Info
        </Typography>
        <Typography color="error">{message}</Typography>
      </>
    );
  };

  const tryRenderingDebugInfo = (): DebugInfo => {
    const debugMessage: DebugMessage = getDebugErrorMessage();
    return debugMessage ? renderDebugInfo(debugMessage) : null;
  };

  return (
    <Box sx={{ mb: "2rem" }}>
      <Typography color="error">
        Sorry, there was a problem. Please try again later.
      </Typography>
      {tryRenderingDebugInfo()}
    </Box>
  );
}
