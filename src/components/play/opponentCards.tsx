import { usePlay } from "@/lib/play/play-context";
import { useSelector } from "@xstate/react";
import Card from "../card/card";

export default function OpponentCards() {
    const { ryujinService } = usePlay()
    const opponentCards = useSelector(ryujinService, (state) => state.context.opponentCards)
    const selectedCard = useSelector(ryujinService, (state) => state.context.selectedCard)
    const optionColors = useSelector(ryujinService, (state) => state.context.selfColor === "w" ? "b" : "w")
    return (
        <div>
            {opponentCards?.map(c => (
                <Card
                    key={c.name}
                    card={c}
                    isSelected={selectedCard?.name === c.name}
                    optionColor={optionColors}
                />)
            )}
        </div>
    )
}
