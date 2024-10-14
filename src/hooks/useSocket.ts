import { SocketContext } from "@/contexts/SocketContext";
import { useContext } from "react";

export function useSocket() {
  const { socket, isConnected } = useContext(SocketContext);

  return { socket, isConnected }
}
