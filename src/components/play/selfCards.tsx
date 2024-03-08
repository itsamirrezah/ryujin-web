import { usePlay } from "@/lib/play/play-context"
import { useSelector } from "@xstate/react"
import Card from "../card/card"

export default function SelfCards() {
    const { ryujinService, onCardSelected } = usePlay()
    const selfCards = useSelector(ryujinService, (state) => state.context.selfCards)
    const selectedCard = useSelector(ryujinService, (state) => state.context.selectedCard)
    const optionColors = useSelector(ryujinService, (state) => state.context.selfColor)
    if (!selfCards) return null
    return (
        <div>
            {selfCards.map(c => (
                <Card card={c}
                    key={c.name}
                    onSelected={(card) => onCardSelected(card)}
                    isSelected={selectedCard?.name === c.name}
                    optionColor={optionColors}
                />)
            )}
        </div>
    )
}
