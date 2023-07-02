import { createContext, useState, ReactNode, useEffect, useContext } from "react";
import { socket } from "@/lib/socket";
import { Player, Room } from "./types";
import { createMachine } from "xstate";
import { ryujinMachine } from "./ryujin-machine";
import { useMachine } from "@xstate/react";


type PlayValues = {
    joinRoom: () => void,
    hasRoom: boolean
    roomId?: string
}

const PlayContext = createContext({} as PlayValues);
export default function PlayContextProvider({ children }: { children: ReactNode }) {
    const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
    const [state, send] = useMachine(ryujinMachine)

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
        socket.on("JOIN_ROOM", (room: Room) => {
            console.log({room})
            let players: Player[] = room.players.map(id => (
                {
                    socketId: id,
                    name: id === socket.id ? "You" : "Opponent",
                    color: undefined
                }))
            send({ type: "PLAYER_JOIN", players, roomId: room.id })
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
        <PlayContext.Provider value={{ joinRoom, hasRoom: !!room?.id, roomId: room?.id }}>
            {children}
        </PlayContext.Provider>
    );
};

export function usePlay() {
    const ctx = useContext(PlayContext)
    if (!ctx) throw new Error("no ctx")
    return ctx
}
