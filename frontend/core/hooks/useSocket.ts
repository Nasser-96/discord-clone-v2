import { useEffect, useState } from "react";

// eslint-disable-next-line import/named
import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client";
import { DynamicValuesType } from "@/core/types&enums/types";
import { getAuthToken } from "@/core/helpers/auth/token";
import { backendUrl } from "../axios/axios";

export interface useSocketIoProps {
  url: string;
  shouldConnect: boolean;
  query?: DynamicValuesType;
}

const options: Partial<ManagerOptions & SocketOptions> = {
  reconnection: true, // default: true
  reconnectionAttempts: 4, // default: Infinity
  reconnectionDelay: 3000, // default 1000
};

/**
 * @description this is a hook that use to connect to socket
 * @param url url of the socket that should connect to it
 * @param shouldConnect this will prevent the connection from happening ( if wanted ), by default it is false ( it can be state )
 * @param query it is a params that a backend want it
 * @returns ( socket ) the connection of socket ( it can be null at the start and after unmount )
 */
const useSocketIo = ({
  url,
  shouldConnect = false,
  query,
}: useSocketIoProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const token = getAuthToken();

  useEffect(() => {
    if (socket) {
      socket?.disconnect();
      setSocket(null);
    }

    // there is default values of query provided by socket.io that is:
    // - EIO (Engine.IO) : the version of the socket that used on the frontend side and this version it should be compatible with server version
    // - transport: refers to the method used to transfer data between the client and the server ( pooling, websocket ) default is websocket
    // - sid: socket id provided by socket.io
    setSocket(
      io(backendUrl + url, {
        ...options,
        auth: {
          token: token ?? "",
        },
        query: query ? query : undefined,
        autoConnect: false, // default: true
        transports: ["websocket"], // default: ["polling", "websocket"]
      })
    );

    return () => {
      socket?.disconnect();
      setSocket(null);
    };
  }, [token]);

  useEffect(() => {
    if (shouldConnect) {
      socket?.connect();
    } else {
      socket?.disconnect();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket, shouldConnect]);

  return { socket };
};

export default useSocketIo;
