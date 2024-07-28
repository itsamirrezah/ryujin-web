import { useCallback, useEffect, useState } from "react";
import { GameContext, PlayWithProps } from "../play/types";
import usePlayOnline from "./use-play-online";

export default function PlayOnline({ ryujinService, gameInfo, setContext, setPlayingMode, children }: PlayWithProps) {
    const [isLeavingRoom, setIsLeavingRoom] = useState(false)
    const {
        onResign,
        onClaimOpponentTimeout,
        onCancelJoin,
        onPassTurn,
        onRematch,
        onMove,
        isRoomActionInProgress,
        prevOpponent,
        roomId
    } = usePlayOnline({ ryujinService, gameInfo })

    useEffect(() => {
        if (!isLeavingRoom) return;
        onCancelJoin()
    }, [isLeavingRoom, onCancelJoin])

    useEffect(() => {
        if (!isLeavingRoom || roomId) return;
        setIsLeavingRoom(false)
        setContext(prev => prev && ({ ...prev, isRoomActionInProgress: false }))
        setPlayingMode(0)

    }, [roomId, isLeavingRoom])

    const onLeaveRoom = useCallback(async () => {
        if (isLeavingRoom) return;
        setIsLeavingRoom(true)
    }, [isLeavingRoom])


    useEffect(() => {
        setContext({
            isRoomActionInProgress,
            onMove,
            onResign,
            onClaimOpponentTimeout,
            onPassTurn,
            onRematch,
            prevOpponent,
            onCancelJoin: onLeaveRoom
        })
    }, [isRoomActionInProgress, onLeaveRoom, onMove, onResign, onClaimOpponentTimeout, onPassTurn, onRematch, prevOpponent])

    return <>{children}</>
}
