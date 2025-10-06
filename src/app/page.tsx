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

function calculateScore(cards: { number: string; suit: string }[]): number {
  let total = 0;

  for (const card of cards) {
    const n = card.number;

    if (n === "A") {
      total += 1;
    } else if (n === "J" || n === "Q" || n === "K") {
      total += 10;
    } else {
      total += Number(n);
    }
  }

  return total;
}

function dealerTurn(
  currentCards: { number: string; suit: string }[]
): { number: string; suit: string }[] {
  let cards = [...currentCards];

  cards.push(CardGen());

  while (calculateScore(cards) < 16) {
    cards.push(CardGen());
  }

  return cards;
}

export default function BlackjackGame() {
  const [dealerCards, setDealerCards] = useState<
    { number: string; suit: string }[]
  >([]);
  const [playerCards, setPlayerCards] = useState<
    { number: string; suit: string }[]
  >([]);
  const [isStand, setIsStand] = useState(false);

  const [chips, setChips] = useState(100);
  const [bet, setBet] = useState(100);
  const [message, setMessage] = useState("");
  const [roundOver, setRoundOver] = useState(false);

  const [history, setHistory] = useState<
    {
      dealerCards: { number: string; suit: string }[];
      playerCards: { number: string; suit: string }[];
      outcome: string;
      betChange: number;
    }[]
  >([]);

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
    if (isStand) return;

    setIsStand(true);

    setDealerCards((prev) => {
      const finalHand = dealerTurn(prev);
      return finalHand;
    });
    setRoundOver(true);
  };

  const reset = () => {
    setIsStand(false);
    setRoundOver(false);
    setMessage("");
    setPlayerCards([CardGen(), CardGen()]);
    setDealerCards([CardGen()]);
  };

  const getSuitColor = (suit: string) =>
    suit === "♥" || suit === "♦" ? "text-red-600" : "text-black";

  const playerScore = calculateScore(playerCards);
  const dealerScore = calculateScore(dealerCards);

  useEffect(() => {
    if (playerScore > 21) {
      setIsStand(true);
      setRoundOver(true);
    }
  }, [playerScore]);

  useEffect(() => {
    if (!roundOver) return;
    if (message) return;

    const playerTotal = calculateScore(playerCards);
    const dealerTotal = calculateScore(dealerCards);

    const timeout = setTimeout(() => {
      let result = "";
      let betChange = 0;

      if (playerTotal > 21) {
        result = "💥 Player busts! You lose!";
        betChange = -bet;
        setChips((prev) => prev - bet);
      } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
        result = "🎉 You win!";
        betChange = +bet;
        setChips((prev) => prev + bet);
      } else if (dealerTotal === playerTotal) {
        result = "🤝 It's a draw!";
        betChange = 0;
      } else {
        result = "😞 Dealer wins!";
        betChange = -bet;
        setChips((prev) => prev - bet);
      }

      setMessage(result);

      setHistory((prev) => [
        ...prev,
        {
          dealerCards,
          playerCards,
          outcome: result,
          betChange,
        },
      ]);
    }, 300);

    return () => clearTimeout(timeout);
  }, [roundOver, dealerCards, playerCards, message, bet]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <h1 className="text-2xl font-bold">MAC takehome-2025</h1>
      {/* 💰 Chip Counter */}
      <div className="absolute top-4 left-4 bg-gray-100 p-3 rounded-lg shadow text-sm">
        <p className="font-semibold mb-1">💰 Chips: {chips}</p>

        <div className="flex gap-2">
          {[10, 50, 100, 500].map((amount) => (
            <button
              key={amount}
              onClick={() => setChips((prev) => prev + amount)}
              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              +{amount}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-xl shadow w-80 text-center">
        <h2 className="text-lg font-semibold mb-2">Dealer</h2>
        <p>Score: {dealerScore}</p>
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
        <p>Score: {playerScore}</p>
        {message && (
          <div className="mt-4 p-3 bg-gray-200 rounded-lg text-center text-lg font-semibold">
            {message}
          </div>
        )}

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
          <button
            onClick={reset}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            Reset
          </button>
        </div>
        {/* Bet Controls */}
        <div className="mt-4 text-center">
          <label className="mr-2 font-semibold">Bet:</label>
          <input
            type="number"
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            min={1}
            max={chips}
            className="border rounded text-center w-20"
          />

          <div className="flex gap-2 justify-center mt-2">
            {[10, 50, 100].map((amount) => (
              <button
                key={amount}
                onClick={() => setBet((prev) => prev + amount)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                +{amount}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* 🧾 Game History Sidebar */}
      <div className="absolute right-4 top-4 bg-gray-100 p-4 rounded-lg shadow w-64 h-[90vh] overflow-y-auto text-sm">
        <h2 className="font-bold text-lg mb-2 text-center">Game History</h2>
        {history.length === 0 && (
          <p className="text-center text-gray-500">No games yet</p>
        )}
        {history.map((game, index) => (
          <div key={index} className="mb-4 border-b pb-2">
            <p className="font-semibold">Game {index + 1}</p>
            <p>
              Dealer:{" "}
              {game.dealerCards.map((c) => `${c.number}${c.suit}`).join(" ")}
            </p>
            <p>
              Player:{" "}
              {game.playerCards.map((c) => `${c.number}${c.suit}`).join(" ")}
            </p>
            <p>{game.outcome}</p>
            <p
              className={`font-semibold ${
                game.betChange > 0
                  ? "text-green-600"
                  : game.betChange < 0
                  ? "text-red-600"
                  : "text-gray-700"
              }`}
            >
              {game.betChange > 0 ? `+${game.betChange}` : game.betChange}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
