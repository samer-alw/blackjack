"use client";
import { useState, useEffect } from "react";
import { CardGen, calculateScore, dealerTurn } from "../utils/helperFunctions";

export function useBlackjackGame() {
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
  const [recommendation, setRecommendation] = useState("");
  const [resetSignal, setResetSignal] = useState(0);

  const playerScore = calculateScore(playerCards);
  const dealerScore = calculateScore(dealerCards);

  // Load from session
  useEffect(() => {
    const savedChips = sessionStorage.getItem("chips");
    const savedHistory = sessionStorage.getItem("history");
    if (savedChips) setChips(Number(savedChips));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    setPlayerCards([CardGen(), CardGen()]);
    setDealerCards([CardGen()]);
  }, []);

  // Save to session
  useEffect(() => sessionStorage.setItem("chips", chips.toString()), [chips]);
  useEffect(
    () => sessionStorage.setItem("history", JSON.stringify(history)),
    [history]
  );

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

    // Send reset signal to hands to clear animations
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
