import { createContext, useState, ReactNode, useEffect, useContext } from "react";
import { socket } from "@/lib/socket";
import { ryujinMachine } from "./ryujin-machine";
import { useMachine } from "@xstate/react";
import { GameResponse, PlayerResponse, RoomResponse, PieceType, SquareType, CardType, MoveResponse, InvalidMoveResponse } from "./types";
import { GameContext } from "./ryujin-machine";

type PlayValues = GameContext & {
    joinRoom: () => void,
    onCardSelected: (card: CardType) => void,
    onPieceSelected: (piece: PieceType, square: SquareType) => void,
    onMove: (to: SquareType) => void,
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

        socket.on("INVALID_MOVE", (data: InvalidMoveResponse) => {
            const { payload } = data
            const [selfCards, opponentCards] = socket.id === payload.whiteId ? [payload.whiteCards, payload.blackCards] : [payload.blackCards, payload.whiteCards]
            send({
                type: "INVALID_MOVE",
                boardPosition: payload.boardPosition,
                selfColor: socket.id === payload.whiteId ? "w" : "b",
                hasTurn: socket.id === payload.turnId,
                selfCards: selfCards,
                opponentCards: opponentCards,
                reserveCards: payload.reserveCards,

            })
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
                reserveCards: game.reserveCards,
                time: game.gameTime
            })
        })

        socket.on("OPPONENT_MOVE", (move: MoveResponse) => {
            const { playerId, from, to, selectedCard } = move
            if (socket.id === playerId) {
                send({ type: "MOVE_CONFIRMED" })
                return;
            }
            send({ type: "OPPONENT_MOVED", playerId, from, to, selectedCard })
        })

        socket.on("UPDATE_TIME", (data: any) => {
            const { white, black } = data
            send({ type: "UPDATE_TIME", white, black })
        })

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("JOIN_ROOM");
            socket.off("START_GAME")
            socket.off("OPPONENT_MOVE")
            socket.off("INVALID_MOVE")
        }
    }, [])

    const { hasTurn, gameStarted } = state.context

    function joinRoom() {
        socket.emit("CREATE_OR_JOIN_ROOM");
    }

    function onCardSelected(card: CardType) {
        send({ type: "SELECT_CARD", card })
    }

    function onPieceSelected(piece: PieceType, square: SquareType) {
        send({ type: "SELECT_PIECE", piece, square })
    }

    function onMove(to: SquareType) {
        const { selectedPiece } = state.context
        if (!selectedPiece) return;
        send({ type: "MOVE", from: selectedPiece.square, to })
        const { roomId, selectedCard } = state.context
        socket.emit("MOVE", { playerId: socket.id, roomId, from: selectedPiece.square, to, selectedCard })
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
