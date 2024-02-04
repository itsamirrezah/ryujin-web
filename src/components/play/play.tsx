import { usePlay } from "@/lib/play/play-context"
import { useSelector } from "@xstate/react"
import Card from "../card/card"
import GameOverModal from "./game-over-modal"
import Lobby from "./lobby"
import OpponentPlayerInfo from "./opponent-player-info"
import OpponentCards from "./opponentCards"
import PlayBoard from "./play-board"
import styles from "./play.module.css"
import SelfPlayerInfo from "./self-player-info"
import SelfCards from "./selfCards"

export default function Play() {
    const {
        onResign,
        onPass,
        ryujinService
    } = usePlay()
    const isPlaying = useSelector(ryujinService, (state) => state.matches('playing'))
    const isGameOver = useSelector(ryujinService, (state) => state.matches('game_over'))
    const hasNoMoves = useSelector(ryujinService, (state) => state.matches('playing.no_moves'))

    return (
        <>
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
                {/*{isPlaying && <button style={{ backgroundColor: "#fff" }} onClick={onResign}>Resign</button>}*/}
            </div>}
        </>
    )
}
