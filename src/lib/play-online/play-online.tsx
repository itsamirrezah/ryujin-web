import { useCallback, useEffect, useState } from "react";
import { PlayWithProps } from "../play/types";
import usePlayOnline from "./use-play-online";

export default function PlayOnline({ ryujinService, gameInfo, setContext, setPlayingMode, children }: PlayWithProps) {
    const [isLeavingRoom, setIsLeavingRoom] = useState(false)
    const playOnline = usePlayOnline({ ryujinService, gameInfo })
    const { onResign, onClaimOpponentTimeout, onCancelJoin, onPassTurn, onRematch, onMove, isRoomActionInProgress } = playOnline

    useEffect(() => {
        async function onLeave() {
            await onCancelJoin()
            setIsLeavingRoom(false)
            setContext(prev => prev && ({ ...prev, isRoomActionInProgress: false }))
            setPlayingMode(0)
        }
        if (!isLeavingRoom) return;
        onLeave()
    }, [isLeavingRoom, onCancelJoin])

    const onLeaveRoom = useCallback(async () => {
        if (isLeavingRoom) return;
        setIsLeavingRoom(true)
    }, [isLeavingRoom])


    useEffect(() => {
        setContext({ ...playOnline, onCancelJoin: onLeaveRoom })
    }, [isRoomActionInProgress, onLeaveRoom, onMove, onResign, onClaimOpponentTimeout, onPassTurn, onRematch])

    return <>{children}</>
}
