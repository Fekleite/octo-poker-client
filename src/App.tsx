import { useEffect } from "react"
import { socket } from "./socket"

export function App() {
  useEffect(() => {
    socket.on('connect', () => {})

    return () => {
      socket.on('disconnect', () => {})
    }
  }, [])

  return (
    <div>
      Hello, octo!
    </div>
  )
}
