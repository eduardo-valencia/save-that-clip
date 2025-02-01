import { Box, Typography } from "@mui/material";
import React from "react";
import { GenericErrorWithDebugInfo } from "./GenericErrorWithDebugInfo";
import { FormErrorInfo } from "../../../../../components/BookmarkForm";

interface Props {
  errorInfo: FormErrorInfo;
}

export default function FormError({ errorInfo }: Props): JSX.Element {
  const getIfIsConnectionError = (): boolean => {
    const { error } = errorInfo;
    if (!(error instanceof Error)) return false;
    const expectedMsg = `Could not establish connection. Receiving end does not exist.`;
    return error.message === expectedMsg;
  };

  const renderConnectionError = (): JSX.Element => {
    return (
      <Typography color="error">
        Sorry, there was a problem. Please try reloading the tab. If the issue
        persists, contact support.
      </Typography>
    );
  };

  const renderContent = (): JSX.Element => {
    const isConnectionError: boolean = getIfIsConnectionError();
    if (isConnectionError) return renderConnectionError();
    return <GenericErrorWithDebugInfo errorInfo={errorInfo} />;
  };

  return <Box sx={{ mb: "2rem" }}>{renderContent()}</Box>;
}
