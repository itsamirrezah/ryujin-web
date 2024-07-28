import { usePlay } from "@/lib/play/play-context"
import { useSelector } from "@xstate/react"
import { useEffect } from "react"
import PlayerInfo from "../player-info/player-info"

export default function OpponentPlayerInfo() {
    const { ryujinService, onClaimOpponentTimeout, prevOpponent } = usePlay()
    const opponentRemaining = useSelector(ryujinService, (state) => state.context.opponentRemainingTime)
    const opponentColor = useSelector(ryujinService, (state) => state.context.selfColor === "w" ? "b" : "w")
    const opponentHasTurn = useSelector(ryujinService, (state) => !state.context.hasTurn)
    const opponentInfo = useSelector(ryujinService, (state) => state.context.playersInfo?.opponent)
    const hasFlagInProgress = useSelector(ryujinService, (state) => state.context.hasFlagInProgress)
    const isPlaying = useSelector(ryujinService, (state) => state.matches('playing'))

    useEffect(() => {
        if (hasFlagInProgress || opponentRemaining > 0 || !isPlaying || !onClaimOpponentTimeout) return
        onClaimOpponentTimeout()
    }, [opponentRemaining, hasFlagInProgress, isPlaying])

    return (
        <PlayerInfo
            name={opponentInfo?.username || prevOpponent?.username || "Opponent"}
            remainingTime={opponentRemaining}
            hasTurn={opponentHasTurn}
            isClockActive={isPlaying}
            color={opponentColor}
        />
    )

}
