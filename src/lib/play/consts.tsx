import { assign, AssignAction } from "xstate";
import { GameInfo } from "../socket";
import {
    BlackOrWhite,
    CardType,
    Delta,
    GameContext,
    GameOverEvent,
    GameStartedEvent,
    MoveConfirmedEvent,
    MoveEvent,
    MoveRejectedEvent,
    NavigateBackEvent,
    NavigateForwardEvent,
    OpponentMoveEvent,
    PieceType,
    PlayerResponse,
    Position,
    SelectCardEvent,
    SelectPieceEvent,
    SquareType,
    TickEvent,
    UpdateTimeEvent
} from "./types";

const BOARD_WIDTH = 5

export const DEFAULT_POSITION: Position = {
    a1: "wP", b1: "wP", c1: "wK", d1: "wP", e1: "wP",
    a5: "bP", b5: "bP", c5: "bK", d5: "bP", e5: "bP"
}

function getDelta(options: number[]) {
    const delta = [] as Delta[]
    for (let i = 0; i < options.length; i++) {
        const opt = options[i]
        const y = Math.floor(opt / BOARD_WIDTH) - 2
        const x = (opt % BOARD_WIDTH) - 2
        delta.push({ x, y })
    }
    return { options, delta }
}

export const ALL_CARDS: CardType[] = [
    { name: "tiger", ...getDelta([2, 17]) },
    { name: "cobra", ...getDelta([8, 11, 18]) },
    { name: "dragon", ...getDelta([5, 9, 16, 18]) },
    { name: "rabbit", ...getDelta([8, 14, 16]) },
    { name: "crab", ...getDelta([7, 10, 14]) },
    { name: "elephant", ...getDelta([6, 8, 11, 13]) },
    { name: "frog", ...getDelta([6, 10, 18]) },
    { name: "goose", ...getDelta([6, 11, 13, 18]) },
    { name: "rooster", ...getDelta([8, 11, 13, 16]) },
    { name: "monkey", ...getDelta([6, 8, 16, 18]) },
    { name: "mantis", ...getDelta([6, 8, 17]) },
    { name: "ox", ...getDelta([7, 13, 17]) },
    { name: "horse", ...getDelta([7, 11, 17]) },
    { name: "crane", ...getDelta([7, 16, 18]) },
    { name: "boar", ...getDelta([7, 11, 13]) },
    { name: "eel", ...getDelta([6, 13, 16]) },
]

function shuffleCards(allCards: CardType[], numberOfCards: number) {
    const tempDeck = [...allCards]
    let deck = [] as CardType[]
    for (let i = 0; i < numberOfCards && tempDeck.length > 0; i++) {
        const selectedIdx = Math.floor(Math.random() * tempDeck.length)
        const card = tempDeck[selectedIdx]
        deck.push(card)
        tempDeck.splice(selectedIdx, 1)
    }
    const wCards = deck.splice(0, 2)
    const bCards = deck.splice(0, 2)

    if (deck.length < 1 || deck.length > allCards.length || wCards.length !== 2 || bCards.length !== 2) {
        throw new Error("card shuffling error!")
    }

    return [
        wCards as [CardType, CardType],
        bCards as [CardType, CardType],
        deck
    ] as const
}

export function updateBoard(board: Position, from: SquareType, to: SquareType): Position {
    const mutableBoard = { ...board }
    mutableBoard[to] = mutableBoard[from]
    delete mutableBoard[from]
    return mutableBoard
}

function updatePlayerCards(
    selectedCard: CardType,
    replacedCard: CardType,
    playerCards: [CardType, CardType]
): [CardType, CardType] {
    const mutablePlayerCards = [...playerCards] as [CardType, CardType]
    const idx = mutablePlayerCards.findIndex(c => c.name === selectedCard.name)
    if (idx < 0) return playerCards
    mutablePlayerCards.splice(idx, 1)
    mutablePlayerCards.push(replacedCard)
    return mutablePlayerCards
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

export function hasMoves(boardPosition: Position, playerCards: [CardType, CardType], turnColor: BlackOrWhite) {
    const sourceSquares = Object.entries(boardPosition)
    for (let i = 0; i < sourceSquares.length; i++) {
        const [square, piece] = sourceSquares[i] as [SquareType, PieceType]
        if (piece[0] !== turnColor) continue
        for (let j = 0; j < playerCards.length; j++) {
            const card = playerCards[j]
            const options = getCardOptions(square, card.delta, turnColor, boardPosition)
            if (options.length > 0) return true
        }
    }
    return false
}

export function getPlayersForPlayOffline(): Record<"self" | "opponent", PlayerResponse> {
    let playersInfo = {} as Record<"self" | "opponent", PlayerResponse>
    playersInfo.self = { socketId: "111", userId: "111", username: "You" }
    playersInfo.opponent = { socketId: "999", userId: "999", username: "Computer" }
    return playersInfo
}

export function NewGameWithComputer(players: Record<"self" | "opponent", PlayerResponse>, gameInfo: GameInfo) {
    const turnColor = Math.random() > .5 ? "w" : "b"
    const { self, opponent } = players;
    const whiteId = Math.random() > .5 ? self.socketId : opponent.socketId
    const blackId = whiteId === self.socketId ? opponent.socketId : self.socketId
    const turnId = turnColor === "w" ? whiteId : blackId
    const boardPosition = DEFAULT_POSITION
    const [wCards, bCards, deck] = shuffleCards(ALL_CARDS, gameInfo.numberOfCards)
    const whiteCards = wCards
    const blackCards = bCards
    const gameTime = gameInfo.time
    const [selfCards, opponentCards] =
        self.socketId === whiteId
            ? [whiteCards, blackCards]
            : [blackCards, whiteCards]
    return {
        id: "999",
        boardPosition,
        selfColor: self.socketId === whiteId ? "w" : "b" as BlackOrWhite,
        hasTurn: self.socketId === turnId,
        selfCards: selfCards as [CardType, CardType],
        opponentCards: opponentCards as [CardType, CardType],
        time: gameTime,
        deck
    }
}

export const startGame = assign((_, e) => {
    return {
        gameId: e.id,
        boardPosition: e.boardPosition,
        selfColor: e.selfColor,
        hasTurn: e.hasTurn,
        selfCards: e.selfCards,
        opponentCards: e.opponentCard,
        selfRemainingTime: e.time,
        opponentRemainingTime: e.time,
        selfTemple: e.selfColor === "w" ? "c1" : "c5",
        opponentTemple: e.selfColor === "w" ? "c5" : "c1",
        lastTracked: new Date().getTime(),
        history: [{ selfCards: e.selfCards, opponentCards: e.opponentCard, boardPosition: e.boardPosition }],
        currentHistory: 0
    }
}) as AssignAction<GameContext, GameStartedEvent>

export const selectCard = assign((ctx, e) => {
    const { card } = e
    const {
        history,
        currentHistory,
        selfCards,
        selectedPiece,
        selfColor,
        boardPosition,
    } = ctx
    if (currentHistory < history.length - 1 || !selfColor) return ctx
    else if (!selfCards?.find(c => c.name === card.name)) return ctx
    return {
        selectedCard: card,
        moveOptions: !selectedPiece ? [] : getCardOptions(selectedPiece.square, card.delta, selfColor, boardPosition)
    }
}) as AssignAction<GameContext, SelectCardEvent>

export const selectPiece = assign((ctx, e) => {
    const { piece, square } = e
    const {
        history,
        currentHistory,
        selfColor,
        selectedCard,
        boardPosition
    } = ctx

    if (currentHistory < history.length - 1 || piece[0] !== selfColor) return ctx

    return {
        selectedPiece: { piece, square },
        moveOptions: !selectedCard ? [] : getCardOptions(square, selectedCard.delta, selfColor, boardPosition)
    }

}) as AssignAction<GameContext, SelectPieceEvent>

export const move = assign((ctx, e) => {
    const { from, to } = e
    const {
        boardPosition,
        history,
        selfCards,
        opponentCards,
        selectedCard,
    } = ctx
    if (!selfCards || !opponentCards || !selectedCard) return ctx

    const updatedBoard = updateBoard(boardPosition, from, to)
    const updatedHistory = history.slice()
    updatedHistory[updatedHistory.length - 1].selectedCard = selectedCard
    updatedHistory.push({ selfCards, opponentCards, boardPosition: updatedBoard })

    return {
        boardPosition: updatedBoard,
        hasTurn: false,
        selectedPiece: undefined,
        moveOptions: [],
        history: updatedHistory,
        currentHistory: updatedHistory.length - 1
    }
}) as AssignAction<GameContext, MoveEvent>

export const moveConfirmed = assign((ctx, e) => {
    const { replacedCard } = e

    const {
        history,
        opponentCards,
    } = ctx
    if (!opponentCards) return ctx
    const updatedHistory = history.slice()
    const { selfCards, selectedCard } = updatedHistory[updatedHistory.length - 2]

    if (!selectedCard) return ctx

    const updatedSelfCards = updatePlayerCards(selectedCard, replacedCard, selfCards)
    updatedHistory[updatedHistory.length - 1].selfCards = updatedSelfCards

    return {
        selfCards: updatedSelfCards,
        selectedCard: undefined,
        history: updatedHistory,
    }

}) as AssignAction<GameContext, MoveConfirmedEvent>

export const moveRejected = assign((ctx, e) => {
    const {
        selfCards,
        boardPosition,
        opponentCards,
        hasTurn,
        selfColor
    } = e
    const { history } = ctx
    const updatedHistory = history.slice()
    updatedHistory.pop()
    updatedHistory[updatedHistory.length - 1] = { boardPosition, opponentCards, selfCards, selectedCard: undefined }

    return {
        selfCards,
        boardPosition,
        opponentCards,
        hasTurn,
        selfColor,
        history: updatedHistory,
        currentHistory: updatedHistory.length - 1
    }
}) as AssignAction<GameContext, MoveRejectedEvent>

export const tick = assign((ctx, e) => {
    const { hasTurn, selfRemainingTime, opponentRemainingTime, lastTracked } = ctx
    const { interval } = e
    const now = new Date().getTime()
    const diff = !lastTracked ? interval : now - lastTracked
    const updatedSelfRemainingTime = hasTurn && selfRemainingTime > 0 ? selfRemainingTime - diff : selfRemainingTime
    const updatedOpponentRemainingTime = !hasTurn && opponentRemainingTime > 0 ? opponentRemainingTime - diff : opponentRemainingTime
    return {
        selfRemainingTime: updatedSelfRemainingTime,
        opponentRemainingTime: updatedOpponentRemainingTime,
        lastTracked: now,
    }
}) as AssignAction<GameContext, TickEvent>

export const opponentMove = assign((ctx, e) => {
    const { from, to, selectedCard, replacedCard } = e
    const { history } = ctx
    const { selfCards, opponentCards, boardPosition } = history[history.length - 1]
    if (!opponentCards || !selectedCard || !selfCards || from === to) return ctx

    const updatedOpponentCards = updatePlayerCards(selectedCard, replacedCard, opponentCards)
    const updatedBoard = updateBoard(boardPosition, from, to)
    const updatedHistory = history.slice()
    updatedHistory[updatedHistory.length - 1].selectedCard = selectedCard
    updatedHistory.push({ selfCards, opponentCards: updatedOpponentCards, boardPosition: updatedBoard })
    return {
        boardPosition: updatedBoard,
        hasTurn: true,
        opponentCards: updatedOpponentCards,
        history: updatedHistory,
        currentHistory: updatedHistory.length - 1,
        selfCards
    }
}) as AssignAction<GameContext, OpponentMoveEvent>

export const updateTime = assign((ctx, e) => {
    const { selfColor } = ctx;
    const updatedSelfTime = selfColor === "w" ? e.white : e.black
    const updatedOpponentTime = selfColor === "w" ? e.black : e.white

    return {
        selfRemainingTime: updatedSelfTime,
        opponentRemainingTime: updatedOpponentTime,
        //FIXME: get lastTracked from server
        lastTracked: new Date().getTime(),
    }
}) as AssignAction<GameContext, UpdateTimeEvent>

export const gameOver = assign((_, e) => {
    const {
        boardPosition,
        endGame,
        selfColor,
        selfCards,
        opponentCards,
        whiteRemainingTime,
        blackRemainingTime
    } = e
    return {
        boardPosition,
        selfColor,
        selfCards,
        opponentCards,
        endGame,
        selfRemainingTime: selfColor === "w" ? whiteRemainingTime : blackRemainingTime,
        opponentRemainingTime: selfColor === "w" ? blackRemainingTime : whiteRemainingTime,
        hasFlagInProgress: false,
    }
}) as AssignAction<GameContext, GameOverEvent>

export const navigateBack = assign((ctx, _) => {
    const { currentHistory, history } = ctx
    const updatedCurrentHistory = currentHistory - 1
    if (updatedCurrentHistory < 0) return ctx
    const currHistory = history[updatedCurrentHistory]
    return {
        selfCards: currHistory.selfCards,
        opponentCards: currHistory.opponentCards,
        boardPosition: currHistory.boardPosition,
        currentHistory: updatedCurrentHistory,
        moveOptions: [],
        selectedCard: currHistory.selectedCard,
        selectedPiece: undefined
    }
}) as AssignAction<GameContext, NavigateBackEvent>

export const navigateForward = assign((ctx, _) => {
    const { currentHistory, history } = ctx
    const updatedCurrentHistory = currentHistory + 1
    if (updatedCurrentHistory >= history.length) return ctx
    const currHistory = history[updatedCurrentHistory]
    return {
        selfCards: currHistory.selfCards,
        opponentCards: currHistory.opponentCards,
        boardPosition: currHistory.boardPosition,
        currentHistory: updatedCurrentHistory,
        moveOptions: [],
        selectedCard: currHistory.selectedCard,
        selectedPiece: undefined
    }
}) as AssignAction<GameContext, NavigateForwardEvent>
