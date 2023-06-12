import { io } from "socket.io-client";

export const socket = io(`${import.meta.env.VITE_SERVER_BASEURL}/play`, { autoConnect: false });
