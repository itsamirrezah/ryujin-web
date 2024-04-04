import { usePlay } from "@/lib/play/play-context"
import { useSelector } from "@xstate/react"
import { useEffect, useState } from "react"
import Ripple from "../ripple/ripple"
import styles from "./wait-for-opponent.module.css"

const waitForOpponentMessages = [
    "Waiting for an oppnent",
    "Starting soon",
    "Still searching",
    "Waiting",
    "To be born again",
    "Wanting",
    "The saddest kind of pain",
    "Waiting",
    "For a day",
    "That I will crawl away",
    "♪ Guitar Solo ♪"
]

export default function WaitForOpponent() {
    const {
        onCancelJoin,
        ryujinService,
        isRoomActionInProgress
    } = usePlay()
    const roomId = useSelector(ryujinService, (state) => state.context.roomId)

    const [waitForOpponentMsg, setWaitForOpponentMsg] = useState(waitForOpponentMessages[0])
    const [dot, setDot] = useState("")
    const [counter, setCounter] = useState(0)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setWaitForOpponentMsg(waitForOpponentMessages[counter])
            setCounter(prev => prev >= waitForOpponentMessages.length - 1 ? 0 : ++prev)
        }, 5000)
        return () => clearTimeout(timeout)
    }, [counter])

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDot((prev) => prev === "..." ? "" : prev + ".")
        }, 500)
        return () => clearTimeout(timeout)
    }, [dot])

    return (
        <div className={styles.container}>
            <span>{`${waitForOpponentMsg}${dot}`}</span>
            <div className={styles.rippleEffect}>
                <Ripple />
            </div>
            {!!roomId && !isRoomActionInProgress && (
                <button onClick={onCancelJoin} className={styles.cancelBtn}>cancel</button>
            )}
        </div>
    )
}
