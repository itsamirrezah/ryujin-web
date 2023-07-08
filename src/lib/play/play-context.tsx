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
    playersInfo?: Record<"self" | "opponent", Player>
    hasTurn: boolean,
    boardPosition: Position | undefined
    selfColor?: "w" | "b"
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
            let playersInfo = {} as Record<"self" | "opponent", Player>
            for (let i = 0; i < room.players.length; i++) {
                if (room.players[i] === socket.id) {
                    playersInfo.self = { socketId: room.players[i], name: "You" }
                    continue
                }
                playersInfo.opponent = { socketId: room.players[i], name: "Opponent" }
            }
            send({ type: "PLAYER_JOIN", players: playersInfo, roomId: room.id })
        })

        socket.on("START_GAME", (game: Game) => {
            console.log({ game })
            send({
                type: "GAME_STARTED", boardPosition: game.boardPosition,
                selfColor: socket.id === game.whiteId ? "w" : "b",
                hasTurn: socket.id === game.turnId
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

    console.log(state.context)
    return (
        <PlayContext.Provider value={{
            joinRoom,
            hasRoom: !!state.context?.roomId,
            roomId: state.context?.roomId,
            selfColor: state.context.selfColor,
            hasTurn: state.context.hasTurn,
            playersInfo: state.context.playersInfo,
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
