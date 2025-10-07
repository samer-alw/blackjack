export function getRandomNumber(max: number = 13): number {
  return Math.floor(Math.random() * max);
}

export function getRandomSuit(): string {
  const suits = ["♠", "♥", "♦", "♣"];
  return suits[getRandomNumber(suits.length)];
}

export function CardGen() {
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

export function calculateScore(
  cards: { number: string; suit: string }[]
): number {
  let total = 0;
  for (const card of cards) {
    const n = card.number;
    if (n === "A") total += 1;
    else if (["J", "Q", "K"].includes(n)) total += 10;
    else total += Number(n);
  }
  return total;
}

export function dealerTurn(cards: { number: string; suit: string }[]) {
  const hand = [...cards, CardGen()];
  while (calculateScore(hand) < 16) {
    hand.push(CardGen());
  }
  return hand;
}
