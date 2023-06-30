import React from "react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import Bookmarks from "./pages/Bookmarks/Bookmarks";
import ErrorPage from "./pages/ErrorPage";
import { SearchProvider } from "./components/SearchProvider";
import { GlobalStyles, ThemeProvider } from "@mui/material";
import { theme } from "./theme";

/**
 * We must use a memory router because Chrome extensions don't support browser
 * routers.
 */
const router = createMemoryRouter([
  {
    path: "/",
    element: <Bookmarks />,
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return (
    <SearchProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles
          styles={{ html: { minWidth: "320px", minHeight: "500px" } }}
        />
        <RouterProvider router={router}></RouterProvider>
      </ThemeProvider>
    </SearchProvider>
  );
}

export default App;
