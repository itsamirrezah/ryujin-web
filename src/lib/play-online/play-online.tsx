import { useCallback, useEffect, useState } from "react";
import { PlayComponentArgs } from "../play/play-context";
import usePlayOnline from "./use-play-online";

export default function PlayOnline({ ryujinService, gameInfo, setPlay, setPlayingMode, children }: PlayComponentArgs) {
    const [isLeavingRoom, setIsLeavingRoom] = useState(false)
    const playOnline = usePlayOnline({ ryujinService, gameInfo })
    const { onResign, onClaimOpponentTimeout, onCancelJoin, onPassTurn, onRematch, onMove, isRoomActionInProgress } = playOnline

    useEffect(() => {
        async function onLeave() {
            await onCancelJoin()
            setIsLeavingRoom(false)
            setPlay(prev => prev && ({ ...prev, isRoomActionInProgress: false }))
            setPlayingMode(0)
        }
        if (!isLeavingRoom) return;
        onLeave()
    }, [isLeavingRoom, onCancelJoin])

    const onLeaveRoom = useCallback(() => {
        if (isLeavingRoom) return;
        setIsLeavingRoom(true)
    }, [isLeavingRoom])


    useEffect(() => {
        setPlay({ ...playOnline, onCancelJoin: onLeaveRoom })
    }, [isRoomActionInProgress, onLeaveRoom, onMove, onResign, onClaimOpponentTimeout, onPassTurn, onRematch])

    return <>{children}</>
}
