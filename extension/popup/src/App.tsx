import React, { useEffect } from "react";

import { Toaster } from "sonner";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import BookmarksPage from "./pages/Bookmarks/BookmarksPage";
import ErrorPage from "./pages/ErrorPage";
import { SearchProvider } from "./components/SearchProvider";
import { ThemeProvider } from "@mui/material";
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
  const handleBlur = (): void => {
    window.close();
  };

  useEffect(() => {
    window.addEventListener("blur", handleBlur);

    const removeListener = (): void => {
      window.removeEventListener("blur", handleBlur);
    };

    return removeListener;
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <SearchProvider>
        <BookmarksProvider>
          <RouterProvider router={router}></RouterProvider>
        </BookmarksProvider>
      </SearchProvider>
      <Toaster richColors closeButton />
    </ThemeProvider>
  );
}

export default App;
