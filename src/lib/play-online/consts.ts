import { io, Socket } from "socket.io-client";
import { ClientEvents, ServerEvents } from "./types";

export const socket = io(
    `${import.meta.env.VITE_SERVER_BASEURL}/play`,
    { autoConnect: false, withCredentials: true, transports: ["websocket"] }
) as Socket<ServerEvents, ClientEvents>
