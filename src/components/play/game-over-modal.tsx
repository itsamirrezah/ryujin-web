import { usePlay } from "@/lib/play/play-context"
import { BlackOrWhite, EndGame } from "@/lib/play/types"
import { useSelector } from "@xstate/react"
import LogoSecondary from "../icons/logo-secondary"
import MasterGreen from "../icons/master-green"
import MasterRed from "../icons/master-red"
import styles from "./game-over-modal.module.css"

function stringifyEndgame(gameOver: EndGame, selfColor: BlackOrWhite) {
    const { result, by } = gameOver
    if (result === "draw") return ["Draw!", `by ${by}`, null, 0.5, 0.5]
    const { playerWonColor } = gameOver
    const title = `You ${selfColor === playerWonColor ? "Won" : "Lost"}`
    const description = by === "abandon" ? "opponent left the game" : `by ${by}`
    const playerResult = selfColor === playerWonColor ? [1, 0] : [0, 1]
    return [title, description, playerWonColor, ...playerResult]
}

export default function GameOverModal() {
    const { ryujinService, onRematch, joinRoom } = usePlay()
    const gameOver = useSelector(ryujinService, (state) => state.context.endGame)
    const selfColor = useSelector(ryujinService, (state) => state.context.selfColor)
    const playerInfo = useSelector(ryujinService, (state) => state.context.playersInfo)
    if (!gameOver || !selfColor || !playerInfo) return null
    const [title, description, wonColor, selfPoint, oppPoint] = stringifyEndgame(gameOver, selfColor)

    return (
        <div className={styles.container}>
            <div className={`${styles.header} ${styles[`header-${wonColor}`]}`}>
                <div className={styles.title}>{title}</div>
                <div className={styles.description}>{description}</div>
            </div>
            <div className={styles.result}>
                <PlayerResult color={selfColor} name={playerInfo.self.username} />
                <div className={styles.middle}>
                    <div className={styles.logo}>
                        <LogoSecondary />
                    </div>
                    <span>{`${selfPoint} - ${oppPoint}`}</span>
                </div>
                <PlayerResult color={selfColor === "w" ? "b" : "w"} name={playerInfo.opponent.username} />
            </div>
            <div className={styles.action}>
                <button onClick={onRematch}>Rematch</button>
                <button onClick={() => joinRoom()}>New Game</button>
            </div>
        </div>
    )
}

function PlayerResult({ color, name }: { color: BlackOrWhite, name: string }) {
    return (
        <div className={`${styles.player}`}>
            <div className={styles[`player-${color}`]}>
                {color === "w" && <MasterRed />}
                {color === "b" && <MasterGreen />}
            </div>
            <span>{name}</span>
        </div>
    )
}
