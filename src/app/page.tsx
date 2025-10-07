"use client";

import { useBlackjackGame } from "./hooks/useBlackJackGame";
import DealerHand from "./components/dealerHand";
import PlayerHand from "./components/playerHand";
import ChipControls from "./components/chipControl";
import BetControls from "./components/betControl";
import { fetchAIRecommendation } from "./utils/aiRecommendation";
import Link from "next/link";
import { Controls } from "./components/controls";

export default function BlackjackGame() {
  const game = useBlackjackGame();
  const isGameOver = !!game.message;

  const getRecommendation = async () => {
    try {
      if (game.dealerCards.length === 0) return;
      const output = await fetchAIRecommendation({
        playerCards: game.playerCards,
        dealerCard: game.dealerCards[0],
        bet: game.bet,
        chips: game.chips,
      });
      game.setRecommendation(output);
    } catch (err) {
      console.error(err);
      game.setRecommendation("Error fetching recommendation");
    }
  };

  return (
    <div className="grid place-items-center min-h-screen bg-black font-sans text-xl relative p-4">
      {/* Top Right Buttons */}
      <div className="absolute top-4 right-4 flex gap-4">
        <Link href="/">
          <button className="px-4 py-2 bg-white rounded border border-white hover:bg-gray-300">
            Home
          </button>
        </Link>
        <Link href="/history">
          <button className="px-4 py-2 bg-white rounded border border-white hover:bg-gray-300">
            History
          </button>
        </Link>
      </div>

      <div className="w-[70vw] flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold text-white">MAC takehome-2025</h1>

        <ChipControls chips={game.chips} setChips={game.setChips} />

        <DealerHand
          dealerCards={game.dealerCards}
          score={game.dealerScore}
          resetSignal={game.resetSignal}
          faceDown={game.bet === 0}
        />

        <PlayerHand
          playerCards={game.playerCards}
          score={game.playerScore}
          message={game.message}
          resetSignal={game.resetSignal}
          faceDown={game.bet === 0}
        />

        {/* BET CONTROLS */}
        {game.bet === 0 && (
          <BetControls bet={game.bet} setBet={game.setBet} chips={game.chips} />
        )}

        {/* GAME CONTROLS */}
        {game.bet > 0 && !isGameOver && (
          <Controls
            hit={game.hit}
            stand={game.stand}
            fetchRecommendation={getRecommendation}
            recommendation={game.recommendation}
            isStand={game.isStand}
          />
        )}

        {isGameOver && (
          <button
            onClick={() => {
              game.reset();
              game.setBet(0);
              game.setRecommendation("");
            }}
            className="px-4 py-2 bg-white text-black rounded border border-white hover:bg-gray-300"
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
}
