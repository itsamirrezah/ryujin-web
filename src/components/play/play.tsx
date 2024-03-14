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

export default function Play() {
    const {
        onResign,
        onPassTurn,
        ryujinService
    } = usePlay()
    const isLobby = useSelector(ryujinService, (state) => state.matches('lobby'))
    const isPlaying = useSelector(ryujinService, (state) => state.matches('playing'))
    const isGameOver = useSelector(ryujinService, (state) => state.matches('gameOver'))
    const hasNoMoves = useSelector(ryujinService, (state) => state.matches('playing.noMove'))
    const shouldLoadCards = isPlaying || isGameOver

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
                    <button onClick={onResign}>
                        <FlagIcon />
                    </button>
                    {hasNoMoves && (<button onClick={onPassTurn}>
                        <HandIcon />
                    </button>)}
                </div>
            )}
        </div>
    )
}
