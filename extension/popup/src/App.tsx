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
import { BookmarkDialogAndProvider } from "./components/BookmarkDialogAndProvider/BookmarkDialogAndProvider";

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
          <BookmarkDialogAndProvider>
            <RouterProvider router={router}></RouterProvider>
            {/* This must be here so that the creation notification's button
            can access the dialog provider */}
            <Toaster richColors closeButton />
          </BookmarkDialogAndProvider>
        </BookmarksProvider>
      </SearchProvider>
    </ThemeProvider>
  );
}

export default App;
