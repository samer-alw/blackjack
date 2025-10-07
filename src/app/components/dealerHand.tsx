"use client";
import { useEffect, useState } from "react";

// ✅ Define card and props types
type Card = { number: string; suit: string };

interface AnimatedCard extends Card {
  show: boolean;
}

interface DealerHandProps {
  dealerCards: Card[];
  score: number;
  resetSignal: number;
  faceDown?: boolean;
}

export default function DealerHand({
  dealerCards,
  score,
  resetSignal,
  faceDown = false,
}: DealerHandProps) {
  const [animatedDealerCards, setAnimatedDealerCards] = useState<
    AnimatedCard[]
  >([]);

  // Animate cards based on faceDown prop
  useEffect(() => {
    setAnimatedDealerCards(dealerCards.map((c) => ({ ...c, show: !faceDown })));
  }, [dealerCards, faceDown]);

  // Reset cards on resetSignal
  useEffect(() => {
    setAnimatedDealerCards([]);
  }, [resetSignal]);

  return (
    <div className="bg-gray-100 p-4 rounded-xl shadow w-80 text-center">
      <h2 className="text-lg font-semibold mb-2">Dealer</h2>
      <p>Score: {!faceDown ? score : "?"}</p>
      <div className="flex justify-center gap-2 mt-2">
        {animatedDealerCards.map((card, i) => (
          <div
            key={i}
            className={`w-18 h-24 rounded-lg flex flex-col justify-center items-center p-1
              bg-white border shadow
              ${
                card.suit === "♥" || card.suit === "♦"
                  ? "text-red-600"
                  : "text-black"
              }
              transition-transform duration-500 ease-in-out
              transform ${
                faceDown || !card.show ? "rotate-y-180" : "rotate-y-0"
              }`}
            style={{ perspective: "600px" }}
          >
            {faceDown || !card.show ? (
              <div className="w-full h-full bg-gray-800 rounded-lg"></div>
            ) : (
              <>
                <div className="text-2xl font-extrabold">{card.number}</div>
                <div className="text-3xl font-bold">{card.suit}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
