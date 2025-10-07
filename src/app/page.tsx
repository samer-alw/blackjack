"use client";

import { useBlackjackGame } from "./hooks/useBlackJackGame";
import DealerHand from "./components/dealerHand";
import PlayerHand from "./components/playerHand";
import ChipControls from "./components/chipControl";
import BetControls from "./components/betControl";
import { fetchAIRecommendation } from "./utils/aiRecommendation";
import Link from "next/link";
import { Controls } from "./components/controls"; // Named import

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

  const handleReset = () => {
    game.reset(); // reset game state, cards, scores, etc.
    game.setBet(0); // reset bet to go back to betting section
    game.setRecommendation(""); // clear AI recommendation
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 relative">
      {/* Top Right History Button */}
      <div className="absolute top-4 right-4">
        <Link
          href="/history"
          className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm"
        >
          View History
        </Link>
      </div>

      <h1 className="text-2xl font-bold">MAC takehome-2025</h1>

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
        faceDown={game.bet === 0} // flips to face-down automatically
      />

      {/* BET CONTROLS: Show only if no bet is placed */}
      {game.bet === 0 && (
        <BetControls bet={game.bet} setBet={game.setBet} chips={game.chips} />
      )}

      {/* GAME CONTROLS: Show only if a bet has been placed */}
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
            game.setBet(0); // flips cards back to face-down
            game.setRecommendation("");
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Play Again
        </button>
      )}
    </div>
  );
}
