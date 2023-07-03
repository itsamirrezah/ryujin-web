import { createContext, useState, ReactNode, useEffect, useContext } from "react";
import { socket } from "@/lib/socket";
import { Game, Player, Room } from "./types";
import { ryujinMachine } from "./ryujin-machine";
import { useMachine } from "@xstate/react";
import { Position } from "@/components/board/types";


type PlayValues = {
    joinRoom: () => void,
    hasRoom: boolean
    roomId?: string
    turn?: "w" | "b",
    boardPosition: Position | undefined
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
            let players: Player[] = room.players.map(id => (
                {
                    socketId: id,
                    name: id === socket.id ? "You" : "Opponent",
                    color: undefined
                }))
            send({ type: "PLAYER_JOIN", players, roomId: room.id })
        })

        socket.on("START_GAME", (game: Game) => {
            send({
                type: "GAME_STARTED", boardPosition: game.boardPosition,
                turn: game.turnColor,
                blackPlayerId: game.playerB,
                whitePlayerId: game.playerW
            })
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
        <PlayContext.Provider value={{
            joinRoom,
            hasRoom: !!state.context?.roomId,
            roomId: state.context?.roomId,
            turn: state.context.turn,
            boardPosition: state.context.boardPosition
        }}>
            {children}
        </PlayContext.Provider>
    );
};

export function usePlay() {
    const ctx = useContext(PlayContext)
    if (!ctx) throw new Error("no ctx")
    return ctx
}
