"use client";
import { useState, useEffect } from "react";
import { CardGen, calculateScore, dealerTurn } from "../utils/helperFunctions";

//Define types
type Card = { number: string; suit: string };

type HistoryEntry = {
  dealerCards: Card[];
  playerCards: Card[];
  outcome: string;
  betChange: number;
  playerScore: number;
  dealerScore: number;
  date: string;
  bet: number;
};

export function useBlackjackGame() {
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [isStand, setIsStand] = useState(false);
  const [chips, setChips] = useState(100);
  const [bet, setBet] = useState(0);
  const [message, setMessage] = useState("");
  const [roundOver, setRoundOver] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("blackjack-history");
      if (saved) {
        try {
          return JSON.parse(saved) as HistoryEntry[];
        } catch (e) {
          console.error("Failed to parse blackjack history:", e);
        }
      }
    }
    return [];
  });
  const [recommendation, setRecommendation] = useState("");
  const [resetSignal, setResetSignal] = useState(0);

  // Calculate scores once
  const playerScore = calculateScore(playerCards);
  const dealerScore = calculateScore(dealerCards);

  // Load chips and initial cards
  useEffect(() => {
    const savedChips = sessionStorage.getItem("chips");
    if (savedChips) setChips(Number(savedChips));

    setPlayerCards([CardGen(), CardGen()]);
    setDealerCards([CardGen()]);
  }, []);

  // Save chips to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("chips", chips.toString());
  }, [chips]);

  // Save history to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("blackjack-history", JSON.stringify(history));
    }
  }, [history]);

  // Auto-stand if player busts
  useEffect(() => {
    if (playerScore > 21) {
      setIsStand(true);
      setRoundOver(true);
    }
  }, [playerScore]);

  // Resolve round outcome
  useEffect(() => {
    if (!roundOver || message) return;

    const timeout = setTimeout(() => {
      let result = "";
      let betChange = 0;

      if (playerScore > 21) {
        result = "💥 Player busts! You lose!";
        betChange = -bet;
        setChips((prev) => prev - bet);
      } else if (dealerScore > 21 || playerScore > dealerScore) {
        result = "🎉 You win!";
        betChange = bet;
        setChips((prev) => prev + bet);
      } else if (dealerScore === playerScore) {
        result = "🤝 It's a draw!";
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
          playerScore,
          dealerScore,
          date: new Date().toISOString(),
          bet,
        },
      ]);
    }, 300);

    return () => clearTimeout(timeout);
  }, [
    roundOver,
    message,
    bet,
    dealerCards,
    playerCards,
    playerScore,
    dealerScore,
  ]);

  // Player hits
  const hit = () => {
    if (!isStand) setPlayerCards((prev) => [...prev, CardGen()]);
    setRecommendation("");
  };

  // Player stands
  const stand = () => {
    if (isStand) return;
    setIsStand(true);
    setDealerCards((prev) => dealerTurn(prev));
    setRoundOver(true);
  };

  // Reset round
  const reset = () => {
    setIsStand(false);
    setRoundOver(false);
    setMessage("");
    setResetSignal((prev) => prev + 1);

    setPlayerCards([]);
    setDealerCards([]);

    setTimeout(() => {
      setPlayerCards([CardGen(), CardGen()]);
      setDealerCards([CardGen()]);
    }, 50);

    setRecommendation("");
  };

  return {
    dealerCards,
    playerCards,
    dealerScore,
    playerScore,
    chips,
    bet,
    message,
    history,
    recommendation,
    isStand,
    resetSignal,
    setBet,
    setChips,
    setRecommendation,
    hit,
    stand,
    reset,
  };
}
