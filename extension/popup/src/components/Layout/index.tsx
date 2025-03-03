import { AppBar, Box, Toolbar } from "@mui/material";
import PageContainer from "../PageContainer";
import Search from "./Search";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props): JSX.Element {
  return (
    <Box
      sx={{
        minWidth: "20rem",
        height: "32.8125rem",
        overflowY: "auto",
        "::-webkit-scrollbar": { display: "none" },
      }}
    >
      <AppBar
        color="transparent"
        sx={{
          boxShadow: "none",
          py: "1rem",
          marginTop: "1.1875rem",
          marginBottom: "1.6875rem",
        }}
        position="static"
      >
        <Toolbar>
          <Search />
        </Toolbar>
      </AppBar>
      <PageContainer>{children}</PageContainer>
    </Box>
  );
}
