import { createContext, ReactNode, useEffect, useState } from "react";
import { Socket } from "socket.io-client";

import { socket } from "@/socket";

interface SocketContextType {
  socket: Socket
  isConnected: boolean
}

export const SocketContext = createContext({} as SocketContextType)

interface SocketContextProviderProps {
  children: ReactNode
}

export function SocketContextProvider({ children }: SocketContextProviderProps) {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider
      value={{ socket, isConnected }}
    >
      {children}
    </SocketContext.Provider>
  )
}

