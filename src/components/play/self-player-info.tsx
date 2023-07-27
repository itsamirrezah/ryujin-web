import { usePlay } from "@/lib/play/play-context"
import { useSelector } from "@xstate/react"
import PlayerInfo from "../player-info/player-info"

export default function SelfPlayerInfo() {
    const { ryujinService } = usePlay()
    const isGameStarted = useSelector(ryujinService, (state) => state.context.gameStarted)
    const selfRemaining = useSelector(ryujinService, (state) => state.context.selfRemainingTime)
    const selfColor = useSelector(ryujinService, (state) => state.context.selfColor)
    const selfHasTurn = useSelector(ryujinService, (state) => state.context.hasTurn)
    const selfInfo = useSelector(ryujinService, (state) => state.context.playersInfo?.self)

    return (
        <PlayerInfo
            name={selfInfo?.username || "You"}
            remainingTime={selfRemaining}
            hasTurn={selfHasTurn}
            isClockActive={isGameStarted}
            color={selfColor}
        />
    )

}
