function getRandomNumber(max: number = 13): number {
  return Math.floor(Math.random() * max);
}

function getRandomSuit(): string {
  const suits = ["♠", "♥", "♦", "♣"];
  const index = getRandomNumber(suits.length);
  return suits[index];
}

function CardGen() {
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

export default function RandomThreeCards() {
  const cards = Array.from({ length: 3 }, CardGen);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Random Card Gen</h1>
      <ul className="text-xl space-y-2">
        {cards.map((card, i) => (
          <li key={i}>
            {card.number} {card.suit}
          </li>
        ))}
      </ul>
    </div>
  );
}
