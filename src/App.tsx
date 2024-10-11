import { RouterProvider } from "react-router-dom"
import { Toaster } from "sonner"

import { router } from "./router"
import { SocketContextProvider } from "./contexts/useSocket"

import './index.css'

export function App() {
  return (
    <SocketContextProvider>
      <RouterProvider router={router} />
      <Toaster richColors />
    </SocketContextProvider>
  )
}
