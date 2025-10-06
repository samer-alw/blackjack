"use client";

import { useState, useEffect } from "react";

function getRandomNumber(max: number = 13): number {
  return Math.floor(Math.random() * max);
}


function getRandomSuit(): string {
  const suits = ["♠", "♥", "♦", "♣"];
  return suits[getRandomNumber(suits.length)];
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

export default function BlackjackGame() {
  const [dealerCards, setDealerCards] = useState<{ number: string; suit: string }[]>([]);
  const [playerCards, setPlayerCards] = useState<{ number: string; suit: string }[]>([]);
  const [isStand, setIsStand] = useState(false);

  useEffect(() => {
    const initialPlayer = [CardGen(), CardGen()];
    const initialDealer = [CardGen()];
    setPlayerCards(initialPlayer);
    setDealerCards(initialDealer);
  }, []);

  const hit = () => {
    if (!isStand) setPlayerCards((prev) => [...prev, CardGen()]);
  };

  const stand = () => {
    setIsStand(true);
  };

  const reset = () => {
    setIsStand(false);
    setPlayerCards([CardGen(), CardGen()]);
    setDealerCards([CardGen()]);
  };

  const getSuitColor = (suit: string) =>
    suit === "♥" || suit === "♦" ? "text-red-600" : "text-black";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <h1 className="text-2xl font-bold">Blackjack Game</h1>

      <div className="bg-gray-100 p-4 rounded-xl shadow w-80 text-center">
        <h2 className="text-lg font-semibold mb-2">Dealer</h2>
        <ul className="space-y-1 text-lg mb-2">
          {dealerCards.map((card, i) => (
            <li key={i}>
              {card.number}{" "}
              <span className={getSuitColor(card.suit)}>{card.suit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-100 p-4 rounded-xl shadow w-80 text-center">
        <h2 className="text-lg font-semibold mb-2">Player</h2>
        <ul className="space-y-1 text-lg mb-2">
          {playerCards.map((card, i) => (
            <li key={i}>
              {card.number}{" "}
              <span className={getSuitColor(card.suit)}>{card.suit}</span>
            </li>
          ))}
        </ul>

        <div className="flex gap-3 justify-center">
          <button
            onClick={hit}
            disabled={isStand}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Hit
          </button>
          <button
            onClick={stand}
            disabled={isStand}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
          >
            Stand
          </button>
        </div>
      </div>
    </div>
  );
}
