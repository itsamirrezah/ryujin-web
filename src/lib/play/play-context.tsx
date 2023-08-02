import { createContext, useState, ReactNode, useEffect, useContext } from "react";
import { socket } from "@/lib/socket";
import { ryujinMachine } from "./ryujin-machine";
import { useInterpret, useSelector } from "@xstate/react";
import { GameResponse, PlayerResponse, RoomResponse, PieceType, SquareType, CardType, MoveResponse, InvalidMoveResponse } from "./types";
import { InterpreterFrom } from "xstate";

type PlayValues = {
    joinRoom: () => void,
    onCardSelected: (card: CardType) => void,
    onPieceSelected: (piece: PieceType, square: SquareType) => void,
    onMove: (from: SquareType, to: SquareType, selectedCard: CardType) => void,
    onFlag: () => void
    ryujinService: InterpreterFrom<typeof ryujinMachine>
}

const PlayContext = createContext({} as PlayValues);
export default function PlayContextProvider({ children }: { children: ReactNode }) {
    const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
    const ryujinService = useInterpret(ryujinMachine)
    const { send } = ryujinService
    const roomId = useSelector(ryujinService, (state) => state.context.roomId)

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

        socket.on("REJ_MOVE", (data: any) => {
            const { payload, white, black } = data
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
            send({ type: "UPDATE_TIME", white, black })
        })

        socket.on("REJ_FLAG", (data: any) => {
            const { white, black } = data
            send({ type: "REJECT_FLAG" })
            send({ type: "UPDATE_TIME", white, black })
        })

        socket.on("JOIN_ROOM", (room: RoomResponse) => {
            let playersInfo = {} as Record<"self" | "opponent", PlayerResponse>
            for (let i = 0; i < room.players.length; i++) {
                const player = room.players[i]
                if (player.socketId === socket.id)
                    playersInfo.self = player
                else
                    playersInfo.opponent = player
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

        socket.on("ACK_MOVE", (payload: any) => {
            const { white, black } = payload
            send({ type: "MOVE_CONFIRMED" })
            send({ type: "UPDATE_TIME", white, black })
        })

        socket.on("OPPONENT_MOVE", (move: any) => {
            const { playerId, from, to, selectedCard, white, black } = move
            send({ type: "OPPONENT_MOVED", playerId, from, to, selectedCard })
            send({ type: "UPDATE_TIME", white, black })
        })

        socket.on("END_GAME", (data: GameResponse) => {
            const [selfCards, opponentCards] = socket.id === data.whiteId ? [data.whiteCards, data.blackCards] : [data.blackCards, data.whiteCards]
            send({
                type: "GAME_OVER",
                boardPosition: data.boardPosition,
                selfColor: socket.id === data.whiteId ? "w" : "b",
                selfCards: selfCards,
                opponentCards: opponentCards,
                reserveCards: data.reserveCards,
                endGame: data.endGame,
                whiteRemainingTime: data.whiteRemainingTime,
                blackRemainingTime: data.blackRemainingTime

            })
        })

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("JOIN_ROOM");
            socket.off("START_GAME")
            socket.off("OPPONENT_MOVE")
            socket.off("REJ_MOVE")
            socket.off("END_GAME")
            socket.off("ACK_MOVE")
            socket.off("REJ_FLAG")
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

    function onMove(from: SquareType, to: SquareType, selectedCard: CardType) {
        send({ type: "MOVE", from, to })
        socket.emit("MOVE", { playerId: socket.id, roomId, from, to, selectedCard })
    }

    function onFlag() {
        send({ type: "FLAG_REQUEST" })
        socket.emit("PLAYER_FLAG", roomId)
    }

    return (
        <PlayContext.Provider value={{
            joinRoom,
            onCardSelected,
            onPieceSelected,
            onMove,
            onFlag,
            ryujinService
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
