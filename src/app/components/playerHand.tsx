"use client";
import { useEffect, useState } from "react";

export default function PlayerHand({
  playerCards,
  score,
  message,
  resetSignal,
}: any) {
  const [animatedPlayerCards, setAnimatedPlayerCards] = useState<
    { number: string; suit: string; show: boolean }[]
  >([]);

  useEffect(() => {
    if (animatedPlayerCards.length === 0) {
      setAnimatedPlayerCards(playerCards.map((c) => ({ ...c, show: true })));
      return;
    }

    const lastIndex = playerCards.length - 1;
    const lastCard = playerCards[lastIndex];

    setAnimatedPlayerCards((prev) => [...prev, { ...lastCard, show: false }]);

    setTimeout(() => {
      setAnimatedPlayerCards((prev) => {
        const newCards = [...prev];
        newCards[lastIndex] = { ...newCards[lastIndex], show: true };
        return newCards;
      });
    }, 50);
  }, [playerCards]);

  // Clear animation on reset
  useEffect(() => {
    setAnimatedPlayerCards([]);
  }, [resetSignal]);

  return (
    <div className="bg-gray-100 p-4 rounded-xl shadow w-80 text-center">
      <h2 className="text-lg font-semibold mb-2">Player</h2>
      <p>Score: {score}</p>
      {message && (
        <div className="mt-4 p-3 bg-gray-200 rounded-lg text-lg font-semibold">
          {message}
        </div>
      )}
      <div className="flex justify-center gap-2 mt-2">
        {animatedPlayerCards.map((card, i) => (
          <div
            key={i}
            className={`w-18 h-24 rounded-lg flex flex-col justify-center items-center p-1 bg-white
              ${
                card.suit === "♥" || card.suit === "♦"
                  ? "text-red-600"
                  : "text-black"
              }
              transition-all duration-1000 ease-out
              ${
                card.show
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
          >
            <div className="text-2xl font-extrabold">{card.number}</div>
            <div className="text-3xl font-bold">{card.suit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
