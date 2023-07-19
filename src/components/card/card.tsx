import styles from "./card.module.css"
import LogoSecondary from "../icons/logo-secondary"
import CardBoard from "./card-board"
import { BlackOrWhite, CardType } from "@/lib/play/types"

type CardProps = {
    card?: CardType,
    isSelected?: boolean,
    onSelected?: (card: CardType) => void
    optionColor?: BlackOrWhite
}

export default function Card({ card, isSelected, onSelected, optionColor }: CardProps) {
    return (
        <div onClick={onSelected && card ? () => onSelected(card) : undefined}
            className={`${styles.card} ${isSelected ? styles.selected : ""}`}>
            {card && <div className={styles.board}>
                <CardBoard options={card.options} color={optionColor!!} />
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
