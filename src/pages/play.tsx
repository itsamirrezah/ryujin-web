import { usePlay } from "@/lib/play/play-context";
import styles from "./play.module.css";
import SelfPlayerInfo from "@/components/play/self-player-info";
import OpponentPlayerInfo from "@/components/play/opponent-player-info";
import PlayBoard from "@/components/play/play-board";
import { useSelector } from "@xstate/react";
import SelfCards from "@/components/play/selfCards";
import OpponentCards from "@/components/play/opponentCards";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import GameOverModal from "@/components/play/game-over-modal";
import Lobby from "@/components/play/lobby";

export default function PlayPage() {
    const {
        onResign,
        onPass,
        ryujinService
    } = usePlay()
    const isPlaying = useSelector(ryujinService, (state) => state.matches('playing'))
    const isGameOver = useSelector(ryujinService, (state) => state.matches('game_over'))
    const gameId = useSelector(ryujinService, (state) => state.context.gameId)
    const hasNoMoves = useSelector(ryujinService, (state) => state.matches('playing.no_moves'))
    const navigate = useNavigate()

    useEffect(() => {
        if (!isPlaying || !gameId) return;
        navigate({ to: "/play/$gameId", params: { gameId } })
    }, [isPlaying, gameId])

    return (
        <div className={styles.main}>
            <div className={styles.game}>
                <div className={styles.boardlyt}>
                    <OpponentPlayerInfo />
                    <PlayBoard />
                    <SelfPlayerInfo />
                    {hasNoMoves && <button style={{ color: "#fff", padding: 4 }} onClick={onPass}>Pass Turn</button>}
                    {isGameOver && <GameOverModal />}
                </div>
                <Lobby />
                {isPlaying && <div className={styles.cards}>
                    <div className={styles.cardsuser}>
                        <OpponentCards />
                    </div>
                    <div className={styles.cardsuser}>
                        <SelfCards />
                    </div>
                    {isPlaying && <button style={{ backgroundColor: "#fff" }} onClick={onResign}>Resign</button>}
                </div>}
            </div>
        </div>
    )
}

