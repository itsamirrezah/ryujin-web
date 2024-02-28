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

export default function Play() {
    const {
        onResign,
        onPassTurn,
        ryujinService
    } = usePlay()
    const isPlaying = useSelector(ryujinService, (state) => state.matches('playing'))
    const isGameOver = useSelector(ryujinService, (state) => state.matches('gameOver'))
    const hasNoMoves = useSelector(ryujinService, (state) => state.matches('playing.noMove'))
    const shouldLoadCards = isPlaying || isGameOver

    return (
        <div className={styles.game}>
            {shouldLoadCards && <div className={styles.cardmobile}>
                <OpponentCards />
            </div>}
            <div className={styles.boardlyt}>
                <OpponentPlayerInfo />
                <PlayBoard />
                <SelfPlayerInfo />
                {hasNoMoves && <button style={{ color: "#fff", padding: 4 }} onClick={onPassTurn}>Pass Turn</button>}
                {isGameOver && <GameOverModal />}
            </div>
            {shouldLoadCards && <div className={styles.cardmobile}>
                <SelfCards />
            </div>}
            <Lobby />
            {shouldLoadCards && <div className={styles.cards}>
                <OpponentCards />
                <SelfCards />
            </div>}
            {isPlaying && <button style={{ width: "2rem" }} onClick={onResign}>
                <FlagIcon />
            </button>}
        </div >
    )
}
