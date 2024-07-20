import { GameInfo, JoinRoom, socket } from "@/lib/socket";
import { useSelector } from "@xstate/react";
import { useEffect, useState } from "react";
import { InterpreterFrom } from "xstate";
import { useAuthContext } from "../auth";
import { ryujinMachine } from "./ryujin-machine";
import { CardType, PlayerResponse, SquareType } from "./types";

export type PlayImp = {
    onMove: (from: SquareType, to: SquareType, selectedCard: CardType) => void,
    onPassTurn: () => void,
    onClaimOpponentTimeout: () => void,
    onResign: () => void,
    onRematch: () => void
    onCancelJoin: () => void,
    isRoomActionInProgress: boolean,
    prevOpponent?: PlayerResponse
}

export type PlayArgs = {
    ryujinService: InterpreterFrom<typeof ryujinMachine>,
    gameInfo: GameInfo,
}

export default function usePlayOnline({ ryujinService, gameInfo }: PlayArgs): PlayImp {
    const { isAuth, openAuth } = useAuthContext()
    const { send } = ryujinService
    const gameId = useSelector(ryujinService, (state) => state.context.gameId)
    const roomId = useSelector(ryujinService, (state) => state.context.roomId)
    const isWaitForOpponent = useSelector(ryujinService, (state) => state.matches('lobby.waitingForOpponent'))
    const isWaitForFriend = useSelector(ryujinService, (state) => state.matches('lobby.waitingForFriend'))
    const isJoinFriend = useSelector(ryujinService, (state) => state.matches('lobby.friendInJoinLobby'))
    const [isRoomActionInProgress, setIsRoomActionInProgress] = useState(false)
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
            const [selfCards, opponentCards] =
                socket.id === payload.whiteId
                    ? [payload.whiteCards, payload.blackCards]
                    : [payload.blackCards, payload.whiteCards]
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
                send({
                    type: "OPPONENT_MOVED",
                    from: payload.from,
                    to: payload.to,
                    selectedCard: payload.selectedCard,
                    replacedCard: payload.replacedCard
                })
            else if (payload.type === "pass")
                send({ type: "OPPONENT_PASS" })
            send({ type: "UPDATE_TIME", white: whiteRemaining, black: blackRemaining })
        })

        socket.on("MOVE_REJECTED", (payload) => {
            const { whiteId, whiteCards, blackCards, boardPosition, turnId, whiteRemaining, blackRemaining } = payload
            const [selfCards, opponentCards] = socket.id === whiteId
                ? [whiteCards, blackCards]
                : [blackCards, whiteCards]
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
            const [selfCards, opponentCards] = socket.id === payload.whiteId
                ? [payload.whiteCards, payload.blackCards]
                : [payload.blackCards, payload.whiteCards]
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
        }
    }, [])

    useEffect(() => {
        if (!socket.connected && isAuth) {
            socket.connect()
        } else if (socket.connected && !isAuth) {
            socket.disconnect()
            send({ type: "LEAVE_ROOM" })
            openAuth()
        }
    }, [isAuth, socket])

    useEffect(() => {
        async function onQuickMatch(payload: JoinRoom) {
            try {
                setIsRoomActionInProgress(true)
                const res = await socket.emitWithAck("JOIN_ROOM", payload);
                if (res.error) {
                    throw new Error("client did not acknowledge the event")
                }
            } catch (err) {
                send({ type: "LEAVE_ROOM" })
            }
            finally {
                setIsRoomActionInProgress(false)
            }
        }
        if (!isWaitForOpponent || isRoomActionInProgress) return;
        onQuickMatch({ roomId, gameInfo })

    }, [isWaitForOpponent, isJoinFriend])


    useEffect(() => {
        async function onInviteFriend() {
            if (isRoomActionInProgress) return;
            const payload = gameInfo
            try {
                setIsRoomActionInProgress(true)
                const res = await socket.emitWithAck("CREATE_ROOM", payload)
                if (res.error) {
                    throw new Error("client did not acknowledge the event")
                }
            } catch (err) {
                send({ type: "LEAVE_ROOM" })
            } finally {
                setIsRoomActionInProgress(false)
            }
        }
        if (!isWaitForFriend) return;
        onInviteFriend()
    }, [isWaitForFriend])


    async function onCancelJoin() {
        if (isRoomActionInProgress) return;
        try {
            setIsRoomActionInProgress(true)
            const res = await socket.emitWithAck("LEAVE_ROOM")
            if (res.error) {
                throw new Error("client did not acknowledge the event")
            }
            send({ type: "LEAVE_ROOM" })
        } finally {
            setIsRoomActionInProgress(false)
        }
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
        send({ type: "REMATCH" })
    }

    return {
        onRematch,
        onMove,
        onResign,
        onPassTurn,
        onCancelJoin,
        isRoomActionInProgress,
        onClaimOpponentTimeout,
        prevOpponent
    }
}
