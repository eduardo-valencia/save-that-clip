import { Box, Typography } from "@mui/material";
import React from "react";
import { FormErrorInfo } from "..";
import { DebugInfo } from "./DebugInfo";

interface Props {
  errorInfo: FormErrorInfo;
}

type DebugMessage = string | null;

export default function FormError({ errorInfo }: Props): JSX.Element {
  const getIfIsConnectionError = (): boolean => {
    const { error } = errorInfo;
    if (!(error instanceof Error)) return false;
    const expectedMsg = `Could not establish connection. Receiving end does not exist.`;
    return error.message === expectedMsg;
  };

  const createMsgFromError = ({ name, message }: Error): string => {
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

  const renderConnectionError = (): JSX.Element => {
    return (
      <Typography color="error">
        Sorry, there was a problem. Please try reloading the tab. If the issue
        persists, contact support.
      </Typography>
    );
  };

  const renderGenericErrorWithDebugInfo = (): JSX.Element => {
    return (
      <>
        <Typography color="error">
          Sorry, there was a problem. Please try again later.
        </Typography>
        {tryRenderingDebugInfo()}
      </>
    );
  };

  const renderContent = (): JSX.Element => {
    const isConnectionError: boolean = getIfIsConnectionError();
    if (isConnectionError) return renderConnectionError();
    return renderGenericErrorWithDebugInfo();
  };

  return <Box sx={{ mb: "2rem" }}>{renderContent()}</Box>;
}
