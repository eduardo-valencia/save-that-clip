import { Box, Typography } from "@mui/material";
import React from "react";
import { FormErrorInfo } from "..";
import { DebugInfo } from "./DebugInfo";

interface Props {
  errorInfo: FormErrorInfo;
}

type DebugMessage = string | null;

export default function FormError({ errorInfo }: Props): JSX.Element {
  const getIfIsConnectionError = (msg: string): boolean => {
    const expectedMsg = `Could not establish connection. Receiving end does not exist.`;
    return msg === expectedMsg;
  };

  // TODO: Don't show this in debug info
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

  const tryRenderingDebugInfo = (): DebugInfo => {
    const debugMsg: DebugMessage = getDebugErrorMessage();
    return debugMsg ? <DebugInfo>{debugMsg}</DebugInfo> : null;
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
