import { CSSObject, Components, createTheme } from "@mui/material";

const getInputPlaceholderStyles = (): CSSObject => {
  return {
    "::placeholder": {
      color: "rgba(0, 0, 0, 0.7)",
      opacity: 1,
    },
  };
};

const getComponentOverridesForPlaceholder = (): Components["MuiInput"] &
  Components["MuiInputBase"] => {
  return { styleOverrides: { input: getInputPlaceholderStyles() } };
};

const getButtonStyles = (): CSSObject => {
  const padding = "0.75rem";
  return { paddingTop: padding, paddingBottom: padding };
};

export const theme = createTheme({
  palette: {
    primary: {
      main: "#226CE0",
    },
    text: {
      secondary: "rgba(0, 0, 0, 0.9)",
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
      letterSpacing: "-0.02225rem",
      borderRadius: "0.3125rem",
    },
  },
  components: {
    MuiInput: getComponentOverridesForPlaceholder(),
    MuiInputBase: getComponentOverridesForPlaceholder(),
    MuiButton: {
      styleOverrides: {
        root: getButtonStyles(),
      },
    },
  },
});
