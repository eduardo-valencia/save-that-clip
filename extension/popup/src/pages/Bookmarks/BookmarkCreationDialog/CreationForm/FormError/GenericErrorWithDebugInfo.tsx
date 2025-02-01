import React from "react";
import { Typography } from "@mui/material";
import { DebugInfo } from "./DebugInfo";
import { FormErrorInfo } from "../../../../../components/BookmarkForm";

type Props = {
  errorInfo: FormErrorInfo;
};

export const GenericErrorWithDebugInfo = ({ errorInfo }: Props) => {
  const createMsgFromError = ({ name, message }: Error): string => {
    return `${name}: ${message}`;
  };

  type DebugMessage = string | null;

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
    <>
      <Typography color="error">
        Sorry, there was a problem. Please try again later.
      </Typography>
      {tryRenderingDebugInfo()}
    </>
  );
};
