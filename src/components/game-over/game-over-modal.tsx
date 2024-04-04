import { usePlay } from "@/lib/play/play-context"
import { BlackOrWhite, EndGame } from "@/lib/play/types"
import { useSelector } from "@xstate/react"
import GameOverButton from "./game-over-button"
import LogoSecondary from "../icons/logo-secondary"
import MasterGreen from "../icons/master-green"
import MasterRed from "../icons/master-red"
import styles from "./game-over-modal.module.css"
import CheckIcon from "../icons/check"

function stringifyEndgame(gameOver: EndGame, selfColor: BlackOrWhite) {
    const { result: strResult, by } = gameOver
    if (strResult === "draw") return ["Draw!", `by ${by}`, null, 0.5, 0.5]
    const { playerWonColor } = gameOver
    const title = `You ${selfColor === playerWonColor ? "Won" : "Lost"}`
    const description = by === "abandon" ? "opponent left the game" : `by ${by}`
    const result = selfColor === playerWonColor ? [1, 0] : [0, 1]
    return [title, description, playerWonColor, ...result]
}

export default function GameOverModal() {
    const {
        ryujinService,
        onRematch,
        onQuickMatch,
        onCancelJoin,
        prevOpponent,
        isRoomActionInProgress
    } = usePlay()
    const gameOver = useSelector(ryujinService, (state) => state.context.endGame)
    const hasOpponentRequestRematch = useSelector(ryujinService, (state) => state.matches("gameOver.opponentRematchRequest"))
    const selfColor = useSelector(ryujinService, (state) => state.context.selfColor)
    const playerInfo = useSelector(ryujinService, (state) => state.context.playersInfo)
    if (!gameOver || !selfColor || !playerInfo) return null
    const [title, description, wonColor, selfPoint, oppPoint] = stringifyEndgame(gameOver, selfColor)
    const visibleRematchStyle = hasOpponentRequestRematch && !!playerInfo.opponent ? styles.visible : ""

    return (
        <div className={styles.container}>
            <div className={`${styles.header} ${styles[`header-${wonColor}`]}`}>
                <div className={styles.resultTitle}>{title}</div>
                <div className={styles.resultDescription}>{description}</div>
            </div>
            <div className={styles.main}>
                <PlayerResult color={selfColor} name={playerInfo.self.username} />
                <div className={styles.score}>
                    <div className={styles.logo}>
                        <LogoSecondary />
                    </div>
                    <span>{`${selfPoint} - ${oppPoint}`}</span>
                </div>
                <PlayerResult
                    color={selfColor === "w" ? "b" : "w"}
                    name={playerInfo?.opponent?.username || prevOpponent?.username || "Opponent"}
                />
            </div>
            <div
                className={`${styles.alert} ${visibleRematchStyle}`}>
                Good game! Rematch?
                <button disabled={isRoomActionInProgress} className={styles.alertBtn} onClick={onRematch}>
                    <CheckIcon />
                </button>
            </div>
            <div className={styles.playActions}>
                <div className={styles.action}>
                    <GameOverButton disabled={isRoomActionInProgress} onClick={() => onQuickMatch()}>New Opponent</GameOverButton>
                </div>
                <div className={styles.action}>
                    <GameOverButton
                        onClick={onRematch} disabled={!playerInfo?.opponent || isRoomActionInProgress}>
                        Rematch
                    </GameOverButton>
                </div>
                <div className={styles.action}>
                    <GameOverButton onClick={onCancelJoin} disabled={isRoomActionInProgress}>Back to lobby</GameOverButton>
                </div>
            </div>
        </div >
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
