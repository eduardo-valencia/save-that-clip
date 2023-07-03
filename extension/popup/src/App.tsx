import React from "react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import BookmarksPage from "./pages/Bookmarks/BookmarksPage";
import ErrorPage from "./pages/ErrorPage";
import { SearchProvider } from "./components/SearchProvider";
import { GlobalStyles, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { BookmarksProvider } from "./components/BookmarksProvider";
import SeriesPage from "./pages/Series/SeriesPage";

/**
 * We must use a memory router because Chrome extensions don't support browser
 * routers.
 */
const router = createMemoryRouter([
  {
    path: "/",
    element: <BookmarksPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/series/:name",
    element: <SeriesPage />,
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{ html: { minWidth: "320px", minHeight: "500px" } }}
      />
      <SearchProvider>
        <BookmarksProvider>
          <RouterProvider router={router}></RouterProvider>
        </BookmarksProvider>
      </SearchProvider>
    </ThemeProvider>
  );
}

export default App;
