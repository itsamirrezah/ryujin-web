import { createContext, useState, ReactNode, useEffect, useContext } from "react";
import { socket } from "@/lib/socket";
import { ryujinMachine } from "./ryujin-machine";
import { useMachine } from "@xstate/react";
import { GameResponse, PlayerResponse, RoomResponse, PieceType, SquareType, CardType } from "./types";
import { GameContext } from "./ryujin-machine";

type PlayValues = GameContext & {
    joinRoom: () => void,
    onCardSelected: (card: CardType) => void,
    onPieceSelected: (piece: PieceType, square: SquareType) => void,
    onMove: (from: SquareType, to: SquareType) => void,
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

        socket.on("JOIN_ROOM", (room: RoomResponse) => {
            let playersInfo = {} as Record<"self" | "opponent", PlayerResponse>
            for (let i = 0; i < room.players.length; i++) {
                if (room.players[i] === socket.id) {
                    playersInfo.self = { socketId: room.players[i], name: "You" }
                    continue
                }
                playersInfo.opponent = { socketId: room.players[i], name: "Opponent" }
            }
            send({ type: "PLAYER_JOIN", players: playersInfo, roomId: room.id })
        })

        socket.on("START_GAME", (game: GameResponse) => {
            const [selfCards, opponentCards] = socket.id === game.whiteId ? [game.whiteCards, game.blackCards] : [game.blackCards, game.whiteCards]
            send({
                type: "GAME_STARTED",
                boardPosition: game.boardPosition,
                selfColor: socket.id === game.whiteId ? "w" : "b",
                hasTurn: socket.id === game.turnId,
                selfCards: selfCards,
                opponentCard: opponentCards,
                reserveCards: game.reserveCards
            })
        })

        socket.on("OPPONENT_MOVE", (data: any) => {
            if (socket.id === data.playerId) { console.log("confirmed by server, now change state to idle"); return; }
            console.log("send a opponent move")
        })

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("JOIN_ROOM");
            socket.off("START_GAME")
            socket.off("OPPONENT_MOVE")
        }
    }, [])

    function joinRoom() {
        socket.emit("CREATE_OR_JOIN_ROOM");
    }

    function onCardSelected(card: CardType) {
        send({ type: "SELECT_CARD", card })
    }

    function onPieceSelected(piece: PieceType, square: SquareType) {
        send({ type: "SELECT_PIECE", piece, square })
    }

    function onMove(from: SquareType, to: SquareType) {
        send({ type: "MOVE", from, to })
        socket.emit("MOVE", { playerId: socket.id, roomId: state.context.roomId, from, to })
    }

    return (
        <PlayContext.Provider value={{
            joinRoom,
            onCardSelected,
            onPieceSelected,
            onMove,
            ...state.context
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
