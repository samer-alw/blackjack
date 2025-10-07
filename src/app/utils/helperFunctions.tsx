// Define and export Card type
export type Card = { number: string; suit: string };

export function getRandomNumber(max: number = 13): number {
  return Math.floor(Math.random() * max);
}

export function getRandomSuit(): string {
  const suits = ["♠", "♥", "♦", "♣"];
  return suits[getRandomNumber(suits.length)];
}

// CardGen returns a Card
export function CardGen(): Card {
  const num = getRandomNumber(13) + 1;
  const suit = getRandomSuit();
  const number =
    num === 1
      ? "A"
      : num === 11
      ? "J"
      : num === 12
      ? "Q"
      : num === 13
      ? "K"
      : num.toString();
  return { number, suit };
}

// Calculate blackjack score
export function calculateScore(cards: Card[]): number {
  let total = 0;
  for (const card of cards) {
    const n = card.number;
    if (n === "A") total += 1;
    else if (["J", "Q", "K"].includes(n)) total += 10;
    else total += Number(n);
  }
  return total;
}

// Dealer plays until 16+
export function dealerTurn(cards: Card[]): Card[] {
  const hand = [...cards, CardGen()];
  while (calculateScore(hand) < 16) {
    hand.push(CardGen());
  }
  return hand;
}
