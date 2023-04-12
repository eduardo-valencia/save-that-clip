import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Bookmarks from './pages/Bookmarks/Bookmarks'
import ErrorPage from './pages/ErrorPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Bookmarks />,
    errorElement: <ErrorPage />,
  },
])

function App() {
  return <RouterProvider router={router}></RouterProvider>
}

export default App
