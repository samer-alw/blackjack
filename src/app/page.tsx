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
    if (n === "A") total += 1;
    else if (["J", "Q", "K"].includes(n)) total += 10;
    else total += Number(n);
  }
  return total;
}

function dealerTurn(cards: { number: string; suit: string }[]) {
  const hand = [...cards, CardGen()];
  while (calculateScore(hand) < 16) {
    hand.push(CardGen());
  }
  return hand;
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
  const [history, setHistory] = useState<any[]>([]);
  const [recommendation, setRecommendation] = useState<string>("");

  // Inside BlackjackGame
  const [animatedDealerCards, setAnimatedDealerCards] = useState<
    { number: string; suit: string; show: boolean }[]
  >([]);

  useEffect(() => {
    // Initialize animated cards with show=false
    const cardsWithShow = dealerCards.map((c) => ({ ...c, show: false }));
    setAnimatedDealerCards(cardsWithShow);

    // Staggered animation
    cardsWithShow.forEach((_, i) => {
      setTimeout(() => {
        setAnimatedDealerCards((prev) => {
          const newCards = [...prev];
          newCards[i] = { ...newCards[i], show: true };
          return newCards;
        });
      }, i * 300); // 300ms stagger; increase to slow down
    });
  }, [dealerCards]);

  // Add a state for animated player cards
  const [animatedPlayerCards, setAnimatedPlayerCards] = useState<
    { number: string; suit: string; show: boolean }[]
  >([]);

  // Whenever playerCards changes, animate only the newest card
  useEffect(() => {
    // If no cards, initialize
    if (animatedPlayerCards.length === 0) {
      setAnimatedPlayerCards(playerCards.map((c) => ({ ...c, show: true })));
      return;
    }

    // Animate only the newest card
    const lastIndex = playerCards.length - 1;
    const lastCard = playerCards[lastIndex];

    setAnimatedPlayerCards((prev) => [
      ...prev,
      { ...lastCard, show: false }, // add with show=false
    ]);

    setTimeout(() => {
      setAnimatedPlayerCards((prev) => {
        const newCards = [...prev];
        newCards[lastIndex] = { ...newCards[lastIndex], show: true }; // reveal newest card
        return newCards;
      });
    }, 50); // small delay to trigger transition
  }, [playerCards]);

  // Load chips and history from session storage
  useEffect(() => {
    const savedChips = sessionStorage.getItem("chips");
    const savedHistory = sessionStorage.getItem("history");
    if (savedChips) setChips(Number(savedChips));
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    setPlayerCards([CardGen(), CardGen()]);
    setDealerCards([CardGen()]);
  }, []);

  // Save chips and history to session storage
  useEffect(() => sessionStorage.setItem("chips", chips.toString()), [chips]);
  useEffect(
    () => sessionStorage.setItem("history", JSON.stringify(history)),
    [history]
  );

  const getSuitColor = (suit: string) =>
    suit === "♥" || suit === "♦" ? "text-red-600" : "text-black";
  const playerScore = calculateScore(playerCards);
  const dealerScore = calculateScore(dealerCards);

  const hit = () => {
    if (!isStand) setPlayerCards((prev) => [...prev, CardGen()]);
    setRecommendation("");
  };

  const stand = () => {
    if (isStand) return;
    setIsStand(true);
    setDealerCards((prev) => dealerTurn(prev));
    setRoundOver(true);
  };

  const reset = () => {
    setIsStand(false);
    setRoundOver(false);
    setMessage("");
    setPlayerCards([CardGen(), CardGen()]);
    setDealerCards([CardGen()]);
    setRecommendation("");
    setAnimatedPlayerCards([]);
    setAnimatedDealerCards([]);
  };

  useEffect(() => {
    if (playerScore > 21) {
      setIsStand(true);
      setRoundOver(true);
    }
  }, [playerScore]);

  useEffect(() => {
    if (!roundOver || message) return;

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
        { dealerCards, playerCards, outcome: result, betChange },
      ]);
    }, 300);

    return () => clearTimeout(timeout);
  }, [roundOver, dealerCards, playerCards, message, bet]);

  async function fetchRecommendation() {
    const response = await fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerCards,
        dealerCard: dealerCards[0],
        bet,
        chips,
      }),
    });
    const body = await response.json();
    setRecommendation(body.output);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <h1 className="text-2xl font-bold">MAC takehome-2025</h1>

      {/* 💰 Chips */}
      <div className="absolute top-4 left-4 bg-gray-100 p-3 rounded-lg shadow text-sm">
        <p className="font-semibold mb-1">💰 Chips: {chips}</p>
        <div className="flex gap-2">
          {[10, 50, 100, 500].map((a) => (
            <button
              key={a}
              onClick={() => setChips((prev) => prev + a)}
              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              +{a}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-xl shadow w-80 text-center">
        <h2 className="text-lg font-semibold mb-2">Dealer</h2>
        <p>Score: {dealerScore}</p>
        <ul className="space-y-1 text-lg mb-2">
          <div className="flex justify-center gap-2">
            {animatedDealerCards.map((card, i) => (
              <div
                key={i}
                className={`w-18 h-24 rounded-lg flex flex-col justify-center items-center p-1 bg-white
        ${
          card.suit === "♥" || card.suit === "♦" ? "text-red-600" : "text-black"
        }
        transition-all duration-1000 ease-out
        ${card.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                <div className="text-2xl font-extrabold">{card.number}</div>
                <div className="text-3xl font-bold">{card.suit}</div>
              </div>
            ))}
          </div>
        </ul>
      </div>

      {/* Player */}
      <div className="bg-gray-100 p-4 rounded-xl shadow w-80 text-center">
        <h2 className="text-lg font-semibold mb-2">Player</h2>
        <p>Score: {playerScore}</p>
        {message && (
          <div className="mt-4 p-3 bg-gray-200 rounded-lg text-lg font-semibold">
            {message}
          </div>
        )}

        <ul className="space-y-1 text-lg mb-2">
          <div className="flex justify-center gap-2">
            {animatedPlayerCards.map((card, i) => (
              <div
                key={i}
                className={`w-18 h-24 rounded-lg flex flex-col justify-center items-center p-1 bg-white
        ${
          card.suit === "♥" || card.suit === "♦" ? "text-red-600" : "text-black"
        }
        transition-all duration-1000 ease-out
        ${card.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                <div className="text-2xl font-extrabold">{card.number}</div>
                <div className="text-3xl font-bold">{card.suit}</div>
              </div>
            ))}
          </div>
        </ul>

        <div className="flex flex-col items-center gap-2 mt-3">
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
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Reset
            </button>
          </div>

          {/* AI Recommendation */}
          <button
            onClick={fetchRecommendation}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Recommend Move
          </button>
          {recommendation && (
            <div className="mt-2 p-2 border rounded bg-gray-50 text-sm">
              <strong>Suggestion:</strong> {recommendation}
            </div>
          )}
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
            {[10, 50, 100].map((a) => (
              <button
                key={a}
                onClick={() => setBet((prev) => prev + a)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                +{a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Game History */}
      <div className="absolute right-4 top-4 bg-gray-100 p-4 rounded-lg shadow w-64 h-[90vh] overflow-y-auto text-sm">
        <h2 className="font-bold text-lg mb-2 text-center">Game History</h2>
        {history.length === 0 && (
          <p className="text-center text-gray-500">No games yet</p>
        )}
        {history.map((game, i) => (
          <div key={i} className="mb-4 border-b pb-2">
            <p className="font-semibold">Game {i + 1}</p>
            <p>
              Dealer:{" "}
              {game.dealerCards
                .map((c: any) => `${c.number}${c.suit}`)
                .join(" ")}
            </p>
            <p>
              Player:{" "}
              {game.playerCards
                .map((c: any) => `${c.number}${c.suit}`)
                .join(" ")}
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
