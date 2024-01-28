import { usePlay } from "@/lib/play/play-context";
import styles from "./play.module.css";
import { useSelector } from "@xstate/react";
import { useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import Play from "@/components/play/play";
import { playRoute } from "@/lib/router";

export default function PlayPage() {
    const {
        ryujinService
    } = usePlay()
    const isPlaying = useSelector(ryujinService, (state) => state.matches('playing'))
    const gameId = useSelector(ryujinService, (state) => state.context.gameId)
    const navigate = useNavigate()
    const { join } = useSearch({ from: playRoute.fullPath })
    const { onJoinFriend } = usePlay()

    useEffect(() => {
        if (!join) return;
        onJoinFriend(join)
    }, [join])

    useEffect(() => {
        if (!isPlaying || !gameId) return;
        navigate({ to: "/play/$gameId", params: { gameId } })
    }, [isPlaying, gameId])

    return (
        <div className={styles.main}>
            <div className={styles.game}>
                <Play />
            </div>
        </div>
    )
}

