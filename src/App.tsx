import { useEffect } from "react"
import { socket } from "./socket"
import { RouterProvider } from "react-router-dom"
import { router } from "./router"

export function App() {
  useEffect(() => {
    socket.on('connect', () => {})

    return () => {
      socket.on('disconnect', () => {})
    }
  }, [])

  return (
    <RouterProvider router={router} />
  )
}
