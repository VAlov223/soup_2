import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

interface SocketContextType {
  socket: any;
  isConnected: boolean;
  setSocketStatus: any;
  socketStatus: any;
}

const SocketContext = createContext<SocketContextType>({
  socket: "",
  isConnected: false,
  socketStatus: "",
  setSocketStatus: () => true,
});

interface SocketProviderProps {
  url: string;
  children: React.ReactNode;
}

export const SocketProvider = (props: SocketProviderProps) => {
  const { url, children } = props;
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketStatus, setSocketStatus] = useState(null);

  useEffect(() => {
    const socketInstance = io(url, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
    });

    setSocket(socketInstance);

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socketInstance.on("connect", handleConnect);
    socketInstance.on("disconnect", handleDisconnect);

    return () => {
      socketInstance.off("connect", handleConnect);
      socketInstance.off("disconnect", handleDisconnect);
      socketInstance.close();
    };
  }, [url]);

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, socketStatus, setSocketStatus }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
