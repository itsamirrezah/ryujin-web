import { createContext, useState, ReactNode, useEffect, useContext } from "react";
import { socket } from "@/lib/socket";
import { Room } from "./types";

const PlayContext = createContext({ joinRoom: () => { } });

export default function PlayContextProvider({ children }: { children: ReactNode }) {
    const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
    const [room, setRoom] = useState<Room>()

    useEffect(() => {
        if (!isConnected) {
            socket.connect();
        }
        socket.on("connect", () => {
            setIsConnected(true);
        })
        socket.on("disconnect", () => {
            setIsConnected(false);
        })
        socket.on("JOIN_ROOM", (room) => {
            console.log({ room })
            setRoom(room);
        })
        socket.on("START_GAME", (game) => {
            console.log({ game })
        })
        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("JOIN_ROOM");
            socket.off("START_GAME")
        }
    }, [])

    function joinRoom() {
        socket.emit("CREATE_OR_JOIN_ROOM");
    }
    return (
        <PlayContext.Provider value={{ joinRoom }}>
            {children}
        </PlayContext.Provider>
    );
};

export function usePlay() {
    const ctx = useContext(PlayContext)
    if (!ctx) throw new Error("no ctx")
    return ctx
}
