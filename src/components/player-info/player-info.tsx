import { BlackOrWhite } from "@/lib/play/types"
import StopwatchIcon from "../icons/stopwatch"
import styles from "./player-info.module.css"

type IPlayerInfo = {
    name: string,
    remainingTime: number
    hasTurn: boolean
    isClockActive: boolean,
    color?: BlackOrWhite
}

export default function PlayerInfo({ name, remainingTime, hasTurn, isClockActive, color }: IPlayerInfo) {
    const minutes = remainingTime / 1000 / 60
    const minute = Math.floor(minutes)
    const decimal = minutes - minute
    const remainingAsSeconds = decimal ? Math.floor(decimal * 60) : 0
    const second = remainingAsSeconds < 10 ? "0" + remainingAsSeconds : remainingAsSeconds
    const clockStyles = `${styles.clock} ${styles[`clock-${color}`]} ${!hasTurn ? styles.clocknotactive : ""}`
    return (
        <div className={styles.info}>
            <span>{name}</span>
            <div className={clockStyles}>
                <div className={styles.icon}>
                    <StopwatchIcon />
                </div>
                <span>{`${minute}:${second}`}</span>
            </div>
        </div>
    )
}
