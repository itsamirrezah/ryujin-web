import { socket } from "@/lib/socket";
import { useInterpret, useSelector } from "@xstate/react";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { InterpreterFrom } from "xstate";
import { useAuthContext } from "../auth";
import { ryujinMachine } from "./ryujin-machine";
import { CardType, PieceType, PlayerResponse, SquareType } from "./types";

type PlayValues = {
    onQuickMatch: (roomId?: string) => void,
    onCardSelected: (card: CardType) => void,
    onPieceSelected: (piece: PieceType, square: SquareType) => void,
    onMove: (from: SquareType, to: SquareType, selectedCard: CardType) => void,
    onPassTurn: () => void
    onClaimOpponentTimeout: () => void,
    onResign: () => void,
    onRematch: () => void
    onInviteFriend: () => void,
    onJoinFriend: (roomId: string) => void,
    onCancelJoin: () => void,
    prevOpponent?: PlayerResponse,
    ryujinService: InterpreterFrom<typeof ryujinMachine>
}

const PlayContext = createContext({} as PlayValues);

export default function PlayContextProvider({ children }: { children: ReactNode }) {
    const ryujinService = useInterpret(ryujinMachine)
    const { isAuth } = useAuthContext()
    const { send } = ryujinService
    const gameId = useSelector(ryujinService, (state) => state.context.gameId)
    const [prevOpponent, setPrevOpponent] = useState<PlayerResponse>()

    useEffect(() => {
        socket.on("connect", () => { })
        socket.on("disconnect", () => { })
        socket.on("UPDATE_PLAYERS", (payload) => {
            let playersInfo = {} as Record<"self" | "opponent", PlayerResponse>
            for (let i = 0; i < payload.players.length; i++) {
                const player = payload.players[i]
                if (player.socketId === socket.id)
                    playersInfo.self = player
                else
                    playersInfo.opponent = player
            }
            if (playersInfo?.opponent) {
                setPrevOpponent(playersInfo.opponent)
            }
            send({ type: "UPDATE_PLAYERS", players: playersInfo, roomId: payload.id })
        })

        socket.on("START_GAME", (payload) => {
            const [selfCards, opponentCards] = socket.id === payload.whiteId ? [payload.whiteCards, payload.blackCards] : [payload.blackCards, payload.whiteCards]
            send({
                type: "GAME_STARTED",
                id: payload.id,
                boardPosition: payload.boardPosition,
                selfColor: socket.id === payload.whiteId ? "w" : "b",
                hasTurn: socket.id === payload.turnId,
                selfCards: selfCards as [CardType, CardType],
                opponentCard: opponentCards as [CardType, CardType],
                time: payload.gameTime
            })
        })

        socket.on("MOVE_CONFIRMED", (payload) => {
            const { replacedCard, whiteRemaining, blackRemaining } = payload
            send({ type: "MOVE_CONFIRMED", replacedCard })
            send({ type: "UPDATE_TIME", white: whiteRemaining, black: blackRemaining })
        })

        socket.on("OPPONENT_MOVED", (payload) => {
            const { whiteRemaining, blackRemaining } = payload
            if (payload.type === "move")
                send({ type: "OPPONENT_MOVED", from: payload.from, to: payload.to, selectedCard: payload.selectedCard, replacedCard: payload.replacedCard })
            else if (payload.type === "pass")
                send({ type: "OPPONENT_PASS" })
            send({ type: "UPDATE_TIME", white: whiteRemaining, black: blackRemaining })
        })

        socket.on("MOVE_REJECTED", (payload) => {
            const { whiteId, whiteCards, blackCards, boardPosition, turnId, whiteRemaining, blackRemaining } = payload
            const [selfCards, opponentCards] = socket.id === whiteId ? [whiteCards, blackCards] : [blackCards, whiteCards]
            send({
                type: "MOVE_REJECTED",
                boardPosition: boardPosition,
                selfColor: socket.id === whiteId ? "w" : "b",
                hasTurn: socket.id === turnId,
                selfCards: selfCards as [CardType, CardType],
                opponentCards: opponentCards as [CardType, CardType],
            })
            send({ type: "UPDATE_TIME", white: whiteRemaining, black: blackRemaining })
        })

        socket.on("TIMEOUT_REJECTED", (payload) => {
            send({ type: "TIMEOUT_REJECTED" })
            send({ type: "UPDATE_TIME", white: payload.whiteRemaining, black: payload.blackRemaining })
        })

        socket.on("END_GAME", (payload) => {
            const [selfCards, opponentCards] = socket.id === payload.whiteId ? [payload.whiteCards, payload.blackCards] : [payload.blackCards, payload.whiteCards]
            send({
                type: "GAME_OVER",
                boardPosition: payload.boardPosition,
                selfColor: socket.id === payload.whiteId ? "w" : "b",
                selfCards: selfCards as [CardType, CardType],
                opponentCards: opponentCards as [CardType, CardType],
                endGame: payload.endGame,
                whiteRemainingTime: payload.whiteRemaining,
                blackRemainingTime: payload.blackRemaining
            })
        })

        socket.on("OPPONENT_REMATCH", () => {
            send({ type: "OPPONENT_REMATCH" })
        })

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("UPDATE_PLAYERS");
            socket.off("START_GAME")
            socket.off("OPPONENT_MOVED")
            socket.off("MOVE_REJECTED")
            socket.off("END_GAME")
            socket.off("MOVE_CONFIRMED")
            socket.off("TIMEOUT_REJECTED")
            socket.off("OPPONENT_REMATCH")
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        if (!socket.connected && isAuth) {
            socket.connect()
        }
    }, [isAuth, socket])

    async function onQuickMatch(roomId?: string) {
        const paylaod = roomId ? { roomId } : undefined
        await socket.emitWithAck("JOIN_ROOM", paylaod);
        send({ type: "QUICK_MATCH" })
    }

    async function onInviteFriend() {
        await socket.emitWithAck("CREATE_ROOM")
        send({ type: "INVITE_FRIEND" })
    }

    async function onCancelJoin() {
        await socket.emitWithAck("LEAVE_ROOM")
        send({ type: "LEAVE_ROOM" })
    }

    function onJoinFriend(roomId: string) {
        send({ type: "JOIN_FRIEND", roomId })
    }

    function onCardSelected(card: CardType) {
        send({ type: "SELECT_CARD", card })
    }

    function onPieceSelected(piece: PieceType, square: SquareType) {
        send({ type: "SELECT_PIECE", piece, square })
    }

    function onMove(from: SquareType, to: SquareType, selectedCard: CardType) {
        if (!gameId) return;
        send({ type: "MOVE", from, to })
        socket.emit("MOVE", { playerId: socket.id, gameId, from, to, selectedCard })
    }

    function onPassTurn() {
        if (!gameId) return
        send({ type: "PASS_TURN" })
        socket.emit("PASS_TURN", { playerId: socket.id, gameId })
    }

    function onClaimOpponentTimeout() {
        if (!gameId) return
        send({ type: "CLAIM_OPPONENT_TIMEOUT" })
        socket.emit("CLAIM_OPPONENT_TIMEOUT", gameId)
    }

    function onResign() {
        if (!gameId) return;
        socket.emit("RESIGNATION", { playerId: socket.id, gameId })
    }

    function onRematch() {
        if (!gameId) return
        socket.emit("REQUEST_REMATCH", { playerId: socket.id, gameId })
        send({ type: "QUICK_MATCH" })
    }

    return (
        <PlayContext.Provider value={{
            onQuickMatch,
            onCardSelected,
            onPieceSelected,
            onMove,
            onPassTurn,
            onClaimOpponentTimeout,
            onResign,
            onRematch,
            onInviteFriend,
            onJoinFriend,
            ryujinService,
            onCancelJoin,
            prevOpponent
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
