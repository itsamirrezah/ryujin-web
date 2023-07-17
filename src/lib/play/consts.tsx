import { BlackOrWhite, CardType, Delta, Position, SquareType } from "./types";

export const DEFAULT_POSITION: Position = {
    a1: "wP", b1: "wP", c1: "wK", d1: "wP", e1: "wP",
    a5: "bP", b5: "bP", c5: "bK", d5: "bP", e5: "bP"
}

export function updateBoard(board: Position, from: SquareType, to: SquareType) {
    const mutableBoard = { ...board }
    mutableBoard[to] = mutableBoard[from]
    delete mutableBoard[from]
    return mutableBoard
}

export function swapWithDeck(
    selectedCard: CardType,
    deckCards: CardType[],
    playerCards: [CardType, CardType]
): [[CardType, CardType], CardType[]] {
    const mutablePlayerCards = [...playerCards] as [CardType, CardType]
    const idx = mutablePlayerCards.findIndex(c => c.name === selectedCard.name)
    if (idx < 0) return [playerCards, deckCards]
    mutablePlayerCards.splice(idx, 1)
    mutablePlayerCards.push(deckCards[0])

    const mutableDeckCards = [...deckCards]
    mutableDeckCards.splice(0, 1)
    mutableDeckCards.push(selectedCard)
    return [mutablePlayerCards, mutableDeckCards]
}
export function getCardOptions(
    sourceSquare: SquareType,
    deltaOptions: Delta[],
    moveAs: BlackOrWhite,
    board: Position
): SquareType[] {
    const COLUMNS = "abcde".split("")
    const options = [] as SquareType[]

    for (let i = 0; i < deltaOptions.length; i++) {
        const delta = deltaOptions[i]
        const currentCol = COLUMNS.findIndex(col => col === sourceSquare[0])
        const currentRow = parseInt(sourceSquare[1])
        const destCol = COLUMNS[currentCol + (moveAs === "w" ? delta.x : delta.x * -1)]
        const destRow = currentRow + (moveAs === "w" ? delta.y * -1 : delta.y);
        const outOfBound = !destCol || !destRow || destRow < 1 || destRow > 5
        if (outOfBound) continue
        const destSquare = destCol + destRow as SquareType
        const piece = board[destSquare]
        const friendlyFire = !!piece && piece[0] === moveAs
        if (friendlyFire) continue
        options.push(destSquare)
    }
    return options
}
