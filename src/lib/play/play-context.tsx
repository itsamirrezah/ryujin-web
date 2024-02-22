import { socket } from "@/lib/socket";
import { useInterpret, useSelector } from "@xstate/react";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { InterpreterFrom } from "xstate";
import { useAuthContext } from "../auth";
import { ryujinMachine } from "./ryujin-machine";
import { CardType, PieceType, PlayerResponse, SquareType } from "./types";

type PlayValues = {
    onQuickMatch: (roomId?: string) => void,
    onCardSelected: (card: CardType) => void,
    onPieceSelected: (piece: PieceType, square: SquareType) => void,
    onMove: (from: SquareType, to: SquareType, selectedCard: CardType) => void,
    onPass: () => void
    onFlag: () => void,
    onResign: () => void,
    onRematch: () => void
    onInviteFriend: () => void,
    onJoinFriend: (roomId: string) => void,
    onCancelJoin: () => void,
    ryujinService: InterpreterFrom<typeof ryujinMachine>
}

const PlayContext = createContext({} as PlayValues);

export default function PlayContextProvider({ children }: { children: ReactNode }) {
    const ryujinService = useInterpret(ryujinMachine)
    const { isAuth } = useAuthContext()
    const { send } = ryujinService
    const gameId = useSelector(ryujinService, (state) => state.context.gameId)

    useEffect(() => {
        socket.on("connect", () => { })
        socket.on("disconnect", () => { })
        socket.on("JOIN_ROOM", (room) => {
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

        socket.on("START_GAME", (game) => {
            const [selfCards, opponentCards] = socket.id === game.whiteId ? [game.whiteCards, game.blackCards] : [game.blackCards, game.whiteCards]
            send({
                type: "GAME_STARTED",
                id: game.id,
                boardPosition: game.boardPosition,
                selfColor: socket.id === game.whiteId ? "w" : "b",
                hasTurn: socket.id === game.turnId,
                selfCards: selfCards as [CardType, CardType],
                opponentCard: opponentCards as [CardType, CardType],
                time: game.gameTime
            })
        })

        socket.on("ACK_MOVE", (payload) => {
            const { replacedCard, whiteRemaining, blackRemaining } = payload
            send({ type: "MOVE_CONFIRMED", replacedCard })
            send({ type: "UPDATE_TIME", white: whiteRemaining, black: blackRemaining })
        })

        socket.on("OPPONENT_MOVED", (move) => {
            const { whiteRemaining, blackRemaining } = move
            if (move.type === "move")
                send({ type: "OPPONENT_MOVED", from: move.from, to: move.to, selectedCard: move.selectedCard, replacedCard: move.replacedCard })
            else if (move.type === "pass")
                send({ type: "OPPONENT_PASS" })
            send({ type: "UPDATE_TIME", white: whiteRemaining, black: blackRemaining })
        })

        socket.on("REJ_MOVE", (rejMove) => {
            const { whiteId, whiteCards, blackCards, boardPosition, turnId, whiteRemaining, blackRemaining } = rejMove
            const [selfCards, opponentCards] = socket.id === whiteId ? [whiteCards, blackCards] : [blackCards, whiteCards]
            send({
                type: "INVALID_MOVE",
                boardPosition: boardPosition,
                selfColor: socket.id === whiteId ? "w" : "b",
                hasTurn: socket.id === turnId,
                selfCards: selfCards as [CardType, CardType],
                opponentCards: opponentCards as [CardType, CardType],
            })
            send({ type: "UPDATE_TIME", white: whiteRemaining, black: blackRemaining })
        })

        socket.on("REJ_FLAG", (time) => {
            send({ type: "REJECT_FLAG" })
            send({ type: "UPDATE_TIME", white: time.whiteRemaining, black: time.blackRemaining })
        })

        socket.on("END_GAME", (game) => {
            const [selfCards, opponentCards] = socket.id === game.whiteId ? [game.whiteCards, game.blackCards] : [game.blackCards, game.whiteCards]
            send({
                type: "GAME_OVER",
                boardPosition: game.boardPosition,
                selfColor: socket.id === game.whiteId ? "w" : "b",
                selfCards: selfCards as [CardType, CardType],
                opponentCards: opponentCards as [CardType, CardType],
                endGame: game.endGame,
                whiteRemainingTime: game.whiteRemaining,
                blackRemainingTime: game.blackRemaining
            })
        })

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("JOIN_ROOM");
            socket.off("START_GAME")
            socket.off("OPPONENT_MOVED")
            socket.off("REJ_MOVE")
            socket.off("END_GAME")
            socket.off("ACK_MOVE")
            socket.off("REJ_FLAG")
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
        await socket.emitWithAck("CANCEL_JOIN")
        send({ type: "CANCEL_JOIN" })
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

    function onPass() {
        if (!gameId) return
        send({ type: "PASS" })
        socket.emit("PASS", { playerId: socket.id, gameId })
    }

    function onFlag() {
        if (!gameId) return
        send({ type: "FLAG_REQUEST" })
        socket.emit("OPPONENT_FLAG", gameId)
    }

    function onResign() {
        if (!gameId) return;
        socket.emit("RESIGNATION", { playerId: socket.id, gameId })
    }

    function onRematch() {
        if (!gameId) return
        socket.emit("REMATCH", { playerId: socket.id, gameId })
    }

    return (
        <PlayContext.Provider value={{
            onQuickMatch,
            onCardSelected,
            onPieceSelected,
            onMove,
            onPass,
            onFlag,
            onResign,
            onRematch,
            onInviteFriend,
            onJoinFriend,
            ryujinService,
            onCancelJoin
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
