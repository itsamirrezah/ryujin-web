import { useEffect } from "react"
import { PlayComponentArgs } from "./play-context"
import usePlayWithComputer from "./use-play-with-computer"

export default function PlayWithComputer({ ryujinService, gameInfo, setPlay, children }: PlayComponentArgs) {
    const playOffline = usePlayWithComputer({ ryujinService, gameInfo })

    useEffect(() => {
        setPlay(playOffline)
    }, [playOffline.onResign])

    return <>{children}</>
}
