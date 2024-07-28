import { DEFAULT_POSITION } from "../play/consts"
import { BlackOrWhite, CardType, Delta, PlayerResponse, GameInfo } from "../play/types"

const BOARD_WIDTH = 5

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
