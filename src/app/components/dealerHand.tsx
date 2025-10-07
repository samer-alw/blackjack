"use client";
import { useEffect, useState } from "react";

export default function DealerHand({ dealerCards, score, resetSignal }: any) {
  const [animatedDealerCards, setAnimatedDealerCards] = useState<
    { number: string; suit: string; show: boolean }[]
  >([]);

  useEffect(() => {
    const cardsWithShow = dealerCards.map((c) => ({ ...c, show: false }));
    setAnimatedDealerCards(cardsWithShow);

    cardsWithShow.forEach((_, i) => {
      setTimeout(() => {
        setAnimatedDealerCards((prev) => {
          const newCards = [...prev];
          newCards[i] = { ...newCards[i], show: true };
          return newCards;
        });
      }, i * 300);
    });
  }, [dealerCards]);

  // Clear on reset signal
  useEffect(() => {
    setAnimatedDealerCards([]);
  }, [resetSignal]);

  return (
    <div className="bg-gray-100 p-4 rounded-xl shadow w-80 text-center">
      <h2 className="text-lg font-semibold mb-2">Dealer</h2>
      <p>Score: {score}</p>
      <div className="flex justify-center gap-2 mt-2">
        {animatedDealerCards.map((card, i) => (
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
