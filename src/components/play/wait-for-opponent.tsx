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
        <div className={styles.waitforopponent}>
            <span>{`${waitForOpponentMsg}${dot}`}</span>
            <div className={styles.ripple}>
                <Ripple />
            </div>
            <button className={styles.cancelbtn}>cancel</button>
        </div>
    )
}
