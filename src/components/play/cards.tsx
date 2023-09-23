import styles from "../../pages/play.module.css"
import OpponentCards from "./opponentCards"
import SelfCards from "./selfCards"
export default function Cards() {
    return (
        <div className={styles.cards}>
            <div className={styles.cardsuser}>
                <OpponentCards />
            </div>
            <div className={styles.cardsuser}>
                <SelfCards />
            </div>
        </div>)
}
