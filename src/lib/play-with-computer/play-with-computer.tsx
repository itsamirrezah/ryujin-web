import { useEffect } from "react"
import { PlayWithProps } from "../play/types"
import usePlayWithComputer from "./use-play-with-computer"

export default function PlayWithComputer({ ryujinService, gameInfo, setContext, children }: PlayWithProps) {
    const playOffline = usePlayWithComputer({ ryujinService, gameInfo })

    useEffect(() => {
        setContext(playOffline)
    }, [playOffline.onResign])

    return <>{children}</>
}
