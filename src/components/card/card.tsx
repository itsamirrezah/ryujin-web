import styles from "./card.module.css"
import LogoSecondary from "../icons/logo-secondary"
import CardBoard from "./card-board"
import { Card as CardType } from "@/lib/play/consts"

type CardProps = {
    card?: CardType
}
export default function Card({ card }: CardProps) {
    return (
        <div className={styles.card}>
            {card && <div className={styles.board}>
                <CardBoard options={card.options} />
            </div>}
            <div className={styles.title}>
                <div className={styles.logo}>
                    <LogoSecondary />
                </div>
                <h4>{card ? card.name : "Ryujin"}</h4>
            </div>
        </div>
    )
}
