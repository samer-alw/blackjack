function getRandomNumber(max: number = 12): number {
  return Math.floor(Math.random() * max);
}

export default function CardGenPage() {
  const cardNumbers = [
    getRandomNumber(),
    getRandomNumber(),
    getRandomNumber(),
    getRandomNumber(),
  ];

  const cardSuits = [
    getRandomNumber(3),
    getRandomNumber(3),
    getRandomNumber(3),
    getRandomNumber(3),
  ];

  return (
    <div>
        {cardNumbers.map((num, i) => (
          <li key={i}>
            Card Num: {num} &nbsp; S: {cardSuits[i]}
          </li>
        ))}
    </div>
  );
}
