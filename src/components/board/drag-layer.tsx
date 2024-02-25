import { CSSProperties } from "react";
import { useDragLayer, XYCoord } from "react-dnd";
import { useBoard } from "./board-context";
import { DEFAULT_PIECES } from "./consts";
import { DndItem } from "./types";

type IDragLayer = {
    isDragging: boolean,
    item: DndItem
    clientOffset: XYCoord | null,
}
export default function DragLayer() {
    const { boardWidth } = useBoard()
    const { isDragging, item, clientOffset } = useDragLayer<IDragLayer>((monitor) => ({
        item: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        isDragging: monitor.isDragging(),
    }));


    function transformDragPiece(clientOffset: XYCoord | null): CSSProperties {
        if (!clientOffset) return { display: "none" };
        //set cursor on middle of the dragged piece
        const halfSquare = boardWidth / 5 / 2;
        const updatedX = clientOffset.x - halfSquare;
        const updatedY = clientOffset.y - halfSquare;
        const transform = `translate(${updatedX}px, ${updatedY}px)`
        return {
            width: boardWidth / 5,
            height: boardWidth / 5,
            transform: transform,
            WebkitTransform: transform,
        };
    }

    if (!isDragging || !boardWidth || !clientOffset!! || !item?.piece) return null

    const PieceComponent = DEFAULT_PIECES[item.piece]

    return (
        <div style={{
            position: "fixed",
            pointerEvents: "none",
            zIndex: 10,
            left: 0,
            top: 0,
        }}>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                ...transformDragPiece(clientOffset)
            }}>
                <PieceComponent />
            </div>
        </div>
    )
}
