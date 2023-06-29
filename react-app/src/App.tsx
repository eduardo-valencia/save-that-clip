import React from "react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import Bookmarks from "./pages/Bookmarks/Bookmarks";
import ErrorPage from "./pages/ErrorPage";
import { SearchProvider } from "./components/SearchProvider";

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
      <RouterProvider router={router}></RouterProvider>
    </SearchProvider>
  );
}

export default App;
