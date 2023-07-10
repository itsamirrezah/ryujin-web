
export type Card = {
    name: string,
    options: number[];
}

export const cards: Card[] = [
    { name: "tiger", options: [2, 17] },
    { name: "cobra", options: [8, 11, 18] },
    { name: "dragon", options: [5, 9, 16, 18] },
    { name: "rabbit", options: [8, 14, 16] },
    { name: "crab", options: [7, 10, 14] },
    { name: "elephant", options: [6, 8, 11, 13] },
    { name: "frog", options: [6, 10, 18] },
    { name: "goose", options: [6, 11, 13, 18] },
    { name: "rooster", options: [8, 11, 13, 16] },
    { name: "monkey", options: [6, 8, 16, 18] },
    { name: "mantis", options: [6, 8, 17] },
    { name: "ox", options: [7, 13, 17] },
    { name: "horse", options: [7, 11, 17] },
    { name: "crane", options: [7, 16, 18] },
    { name: "boar", options: [7, 11, 13] },
    { name: "eel", options: [6, 13, 16] },
]
