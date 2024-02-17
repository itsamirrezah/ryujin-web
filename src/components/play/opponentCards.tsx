import { usePlay } from "@/lib/play/play-context";
import { useSelector } from "@xstate/react";
import Card from "../card/card";

export default function OpponentCards() {
    const { ryujinService } = usePlay()
    const opponentCards = useSelector(ryujinService, (state) => state.context.opponentCards)
    const optionColors = useSelector(ryujinService, (state) => state.context.selfColor === "w" ? "b" : "w")
    return (
        <div style={{ display: "flex", gap: "2%" }}>
            {opponentCards?.map(c => (
                <Card
                    key={c.name}
                    card={c}
                    isSelected={false}
                    optionColor={optionColors}
                />)
            )}
        </div>
    )
}
