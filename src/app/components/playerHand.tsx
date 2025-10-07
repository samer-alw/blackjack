"use client";
import { useEffect, useState } from "react";

export default function PlayerHand({
  playerCards,
  score,
  message,
  resetSignal,
  faceDown = false,
}: any) {
  const [animatedPlayerCards, setAnimatedPlayerCards] = useState<
    { number: string; suit: string; show: boolean }[]
  >([]);

  useEffect(() => {
    if (faceDown) {
      // Hide all cards if faceDown
      setAnimatedPlayerCards(playerCards.map((c) => ({ ...c, show: false })));
    } else {
      // Show all cards immediately if faceUp
      setAnimatedPlayerCards(playerCards.map((c) => ({ ...c, show: true })));
    }
  }, [playerCards, faceDown]);

  useEffect(() => {
    setAnimatedPlayerCards([]);
  }, [resetSignal]);

  return (
    <div className="bg-gray-100 p-4 rounded-xl shadow w-80 text-center">
      <h2 className="text-lg font-semibold mb-2">Player</h2>
      <p>Score: {!faceDown ? score : "?"}</p>
      {message && (
        <div className="mt-4 p-3 bg-gray-200 rounded-lg text-lg font-semibold">
          {message}
        </div>
      )}
      <div className="flex justify-center gap-2 mt-2">
        {animatedPlayerCards.map((card, i) => (
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
