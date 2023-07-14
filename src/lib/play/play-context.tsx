import { createContext, useState, ReactNode, useEffect, useContext } from "react";
import { socket } from "@/lib/socket";
import { Game, Player, Room } from "./types";
import { ryujinMachine } from "./ryujin-machine";
import { useMachine } from "@xstate/react";
import { PieceType, Position, SquareType } from "./types";
import { Card } from "./consts";


type PlayValues = {
    joinRoom: () => void,
    hasRoom: boolean
    roomId?: string
    playersInfo?: Record<"self" | "opponent", Player>
    hasTurn: boolean,
    boardPosition: Position | undefined
    selfColor?: "w" | "b",
    isGameStarted: boolean,
    selfCards: [Card, Card] | undefined,
    opponentCards: [Card, Card] | undefined,
    reserveCards: Card[] | undefined
    selectedCard: Card | undefined,
    selectCard: (card: Card) => void,
    selectPiece: (piece: PieceType, square: SquareType) => void,
    selectedPiece: { piece: PieceType, square: SquareType } | undefined,
    moveOptions: SquareType[] | undefined,
    movePiece: (from: SquareType, to: SquareType) => void
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

    function selectCard(card: Card) {
        send({ type: "SELECT_CARD", selectedCard: card })
    }

    function selectPiece(piece: PieceType, square: SquareType) {
        send({ type: "SELECT_PIECE", selectedPiece: piece, square })
    }

    function movePiece(from: SquareType, to: SquareType) {
        send({ type: "MOVE", from, to })
    }


    return (
        <PlayContext.Provider value={{
            joinRoom,
            hasRoom: !!state.context?.roomId,
            roomId: state.context?.roomId,
            selfColor: state.context.selfColor,
            hasTurn: state.context.hasTurn,
            playersInfo: state.context.playersInfo,
            boardPosition: state.context.boardPosition,
            isGameStarted: state.context.gameStarted,
            selfCards: state.context.selfCards,
            opponentCards: state.context.opponentCards,
            reserveCards: state.context.reserveCards,
            selectedCard: state.context.selectedCard,
            selectCard,
            selectPiece,
            selectedPiece: state.context.selectedPiece,
            moveOptions: state.context.moveOptions,
            movePiece
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
