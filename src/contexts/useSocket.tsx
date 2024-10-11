import { createContext, ReactNode, useEffect } from "react";
import { Socket } from "socket.io-client";

import { socket } from "@/socket";

interface SocketContextType {
  socket: Socket
}

export const SocketContext = createContext({} as SocketContextType)

interface SocketContextProviderProps {
  children: ReactNode
}

export function SocketContextProvider({ children }: SocketContextProviderProps) {
  useEffect(() => {
    socket.on('connect', () => {
      console.log("User connected")
    })

    socket.on('disconnect', () => {
      console.log("User disconnected")
    })

    socket.on('error', (response: { error: string }) => {
      console.error(response.error)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider
      value={{ socket }}
    >
      {children}
    </SocketContext.Provider>
  )
}

