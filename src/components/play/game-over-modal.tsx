import { usePlay } from "@/lib/play/play-context"
import { BlackOrWhite } from "@/lib/play/types"
import { useSelector } from "@xstate/react"
import LogoSecondary from "../icons/logo-secondary"
import MasterGreen from "../icons/master-green"
import MasterRed from "../icons/master-red"
import styles from "./game-over-modal.module.css"

export default function GameOverModal() {
    const { ryujinService } = usePlay()
    const gameOver = useSelector(ryujinService, (state) => state.context.endGame)
    const selfColor = useSelector(ryujinService, (state) => state.context.selfColor)

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>{`You Won`}</div>
                <div className={styles.description}>{`opponent left the game`}</div>
            </div>
            <div className={styles.result}>
                <PlayerResult color="w" name="itsamirrezaah" />
                <div className={styles.middle}>
                    <div className={styles.logo}>
                        <LogoSecondary />
                    </div>
                    <span>1 - 0</span>
                </div>
                <PlayerResult color="b" name="itsmeursault@gmail.com" />
            </div>
            <div className={styles.action}>
                <button>Rematch</button>
                <button>New Game</button>
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
        </div >
    )
}
