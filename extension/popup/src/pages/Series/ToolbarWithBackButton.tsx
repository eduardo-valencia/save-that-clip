import { Box, Button } from "@mui/material";
import LeftArrowIcon from "@mui/icons-material/ArrowBackIos";
import React, { useContext } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  SearchContext,
  SearchContextValue,
} from "../../components/SearchProvider";

export default function ToolbarWithBackButton() {
  const navigate: NavigateFunction = useNavigate();
  const { setQuery }: SearchContextValue = useContext(SearchContext);

  const handleClick = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setQuery!("");
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-start", mb: "1.75rem" }}>
      <Button
        variant="text"
        sx={{
          p: 0,
          color: "#65676E",
          ":hover": { backgroundColor: "initial" },
        }}
        startIcon={<LeftArrowIcon />}
        onClick={handleClick}
      >
        Home
      </Button>
    </Box>
  );
}
