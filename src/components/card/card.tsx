import styles from "./card.module.css"
import LogoSecondary from "../icons/logo-secondary"

export default function Card() {
    return (
        <div className={styles.card}>
            <div className={styles.board}>
                BOARD
            </div>
            <div className={styles.title}>
                <div className={styles.logo}>
                    <LogoSecondary />
                </div>
                <h4>Tiger</h4>
            </div>
        </div>
    )
}
