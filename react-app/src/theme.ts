import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#226CE0",
    },
  },
  typography: {
    fontFamily: "'Montserrat', sans-serif",
    h1: {
      fontSize: "2.25rem",
      fontWeight: 600,
      lineHeight: "2.875rem",
      letterSpacing: "-0.1rem",
    },
    button: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: "normal",
      textTransform: "none",
    },
  },
});
