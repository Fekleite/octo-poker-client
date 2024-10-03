import { useEffect } from "react"
import { RouterProvider } from "react-router-dom"

import { socket } from "./socket"
import { router } from "./router"

import './index.css'

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
