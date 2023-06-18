import styles from "./card.module.css"
import LogoSecondary from "../icons/logo-secondary"
import CardBoard from "./card-board"
import { Card as CardType } from "../play/consts"

type CardProps = {
    card: CardType
}
export default function Card({ card }: CardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.board}>
                <CardBoard options={card.options} />
            </div>
            <div className={styles.title}>
                <div className={styles.logo}>
                    <LogoSecondary />
                </div>
                <h4>{card.name}</h4>
            </div>
        </div>
    )
}
