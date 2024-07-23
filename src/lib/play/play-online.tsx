import { useEffect } from "react";
import { PlayComponentArgs } from "./play-context";
import usePlayOnline from "./use-play-online";

export default function PlayOnline({ ryujinService, gameInfo, setPlay, children }: PlayComponentArgs) {
    const playOnline = usePlayOnline({ ryujinService, gameInfo })

    useEffect(() => {
        setPlay(playOnline)
    }, [])

    return <>{children}</>
}
