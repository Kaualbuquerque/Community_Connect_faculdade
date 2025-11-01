// socket.ts
import { io, Socket } from "socket.io-client";

const URL = "http://localhost:4000";

// exporta uma instância única do socket
export const socket: Socket = io(URL, {
    autoConnect: true,
    withCredentials: true,
    transports: ["websocket"], // força websocket em vez de polling
});
