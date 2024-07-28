import { usePlay } from "@/lib/play/play-context"
import { useSelector } from "@xstate/react"
import FlagIcon from "../icons/flag"
import GameOverModal from "../game-over/game-over-modal"
import Lobby from "../lobby/lobby"
import OpponentPlayerInfo from "./opponent-player-info"
import OpponentCards from "./opponentCards"
import PlayBoard from "./play-board"
import styles from "./play.module.css"
import SelfPlayerInfo from "./self-player-info"
import SelfCards from "./selfCards"
import HandIcon from "../icons/hand"
import { useEffect, useState } from "react"
import useOutsideClick from "@/lib/use-outside-click"
import CircleArrowLeft from "../icons/circle-arrow-left"
import CircleArrowRight from "../icons/circle-arrow-right"

export default function Play() {
    const [resign, setResign] = useState<number>(0)
    const {
        onResign,
        onPassTurn,
        onNavigateBack,
        onNavigateForward,
        ryujinService
    } = usePlay()
    const outsideRef = useOutsideClick<HTMLButtonElement>(() => setResign(0))
    const isLobby = useSelector(ryujinService, (state) => state.matches('lobby'))
    const isPlaying = useSelector(ryujinService, (state) => state.matches('playing'))
    const isGameOver = useSelector(ryujinService, (state) => state.matches('gameOver'))
    const hasNoMoves = useSelector(ryujinService, (state) => state.matches('playing.noMove'))
    const gameHistory = useSelector(ryujinService, (state) => ({ history: state.context.history, currentHistory: state.context.currentHistory }))
    const shouldLoadCards = isPlaying || isGameOver

    function onResignHandler() {
        if (!onResign) return;
        setResign(prev => {
            if (prev + 1 >= 2) {
                onResign()
                return 0
            }
            return prev + 1
        })
    }

    useEffect(() => {
        if (!isGameOver) return;
        setResign(0)
    }, [isGameOver])

    return (
        <div className={styles.container}>
            {shouldLoadCards && (
                <div className={styles.mobileCards}>
                    <OpponentCards />
                </div>
            )}
            <div className={styles.board}>
                <OpponentPlayerInfo />
                <PlayBoard />
                <SelfPlayerInfo />
                {isGameOver && <GameOverModal />}
            </div>
            {shouldLoadCards && (
                <div className={styles.mobileCards}>
                    <SelfCards />
                </div>
            )}
            {isLobby && <Lobby />}
            {shouldLoadCards && (
                <div className={styles.cards}>
                    <OpponentCards />
                    <SelfCards />
                </div>
            )}
            {isPlaying && (
                <div className={styles.playerActions}>
                    <button
                        className={styles.actionBtn}
                        onClick={onNavigateBack}
                        disabled={gameHistory.currentHistory <= 0}>
                        <CircleArrowLeft />
                    </button>
                    <button
                        ref={outsideRef}
                        className={`${styles.actionBtn} ${resign === 1 ? styles.selected : ""}`}
                        onClick={onResignHandler}
                    >
                        <FlagIcon />
                    </button>
                    {hasNoMoves && (
                        <button className={styles.actionBtn} onClick={onPassTurn}>
                            <HandIcon />
                        </button>
                    )}
                    <button
                        className={styles.actionBtn}
                        onClick={onNavigateForward}
                        disabled={gameHistory.currentHistory === gameHistory.history.length - 1}>
                        <CircleArrowRight />
                    </button>
                </div>
            )}
        </div>
    )
}
