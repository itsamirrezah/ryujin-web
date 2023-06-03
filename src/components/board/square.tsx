import { ReactNode } from "react"
import { Squares } from "./types"

type SquareProps = {
    square: Squares,
    children: ReactNode
}

export default function Square({ square, children}: SquareProps) {
    return (
        <div style={{ width: 124, height: 124, border: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {children}
        </div>
    )
}
