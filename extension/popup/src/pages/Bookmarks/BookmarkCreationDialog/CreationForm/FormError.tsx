import { Box, Typography } from "@mui/material";
import React from "react";
import { FormErrorInfo } from ".";

interface Props {
  errorInfo: FormErrorInfo;
}

type DebugMessage = string | null;

export default function FormError({ errorInfo }: Props): JSX.Element {
  const getIfIsConnectionError = (msg: string): boolean => {
    const expectedMsg = `Could not establish connection. Receiving end does not exist.`;
    return msg === expectedMsg;
  };

  const createMsgFromError = ({ name, message }: Error): string => {
    const isConnectionError: boolean = getIfIsConnectionError(message);
    if (isConnectionError)
      return "Sorry, there was a problem. Please try reloading the tab. If the issue persists, contact support.";
    return `${name}: ${message}`;
  };

  const getDebugErrorMessage = (): DebugMessage => {
    const { error } = errorInfo;
    if (error instanceof Error) return createMsgFromError(error);
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
