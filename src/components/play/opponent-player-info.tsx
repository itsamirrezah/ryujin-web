import { usePlay } from "@/lib/play/play-context"
import { useSelector } from "@xstate/react"
import { useEffect } from "react"
import PlayerInfo from "../player-info/player-info"

export default function OpponentPlayerInfo() {
    const { ryujinService, onFlag } = usePlay()
    const isGameStarted = useSelector(ryujinService, (state) => state.context.gameStarted)
    const opponentRemaining = useSelector(ryujinService, (state) => state.context.opponentRemainingTime)
    const opponentColor = useSelector(ryujinService, (state) => state.context.selfColor === "w" ? "b" : "w")
    const opponentHasTurn = useSelector(ryujinService, (state) => !state.context.hasTurn)
    const opponentInfo = useSelector(ryujinService, (state) => state.context.playersInfo?.opponent)

    useEffect(() => {
        if (opponentRemaining > 0 || !isGameStarted) return;
        onFlag()
    }, [opponentRemaining])

    return (
        <PlayerInfo
            name={opponentInfo?.username || "Opponent"}
            remainingTime={opponentRemaining}
            hasTurn={opponentHasTurn}
            isClockActive={isGameStarted}
            color={opponentColor}
        />
    )

}
