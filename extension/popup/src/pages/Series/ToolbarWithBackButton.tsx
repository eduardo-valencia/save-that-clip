import { Box, Button } from "@mui/material";
import LeftArrowIcon from "@mui/icons-material/ArrowBackIos";
import React from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

export default function ToolbarWithBackButton() {
  const navigate: NavigateFunction = useNavigate();

  const handleClick = (): void => {
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
        Back
      </Button>
    </Box>
  );
}
