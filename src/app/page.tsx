"use client";
import { useBlackjackGame } from "./hooks/useBlackJackGame";
import DealerHand from "./components/dealerHand";
import PlayerHand from "./components/playerHand";
import ChipControls from "./components/chipControl";
import BetControls from "./components/betControl";
import GameHistory from "./components/historyPanel";
import { fetchAIRecommendation } from "./utils/aiRecommendation";

export default function BlackjackGame() {
  const game = useBlackjackGame();

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
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <h1 className="text-2xl font-bold">MAC takehome-2025</h1>

      <ChipControls chips={game.chips} setChips={game.setChips} />

      <DealerHand
        dealerCards={game.dealerCards}
        score={game.dealerScore}
        resetSignal={game.resetSignal}
      />

      <PlayerHand
        playerCards={game.playerCards}
        score={game.playerScore}
        message={game.message}
        resetSignal={game.resetSignal}
      />

      <div className="flex flex-col items-center gap-2 mt-3">
        <div className="flex gap-3 justify-center">
          <button
            onClick={game.hit}
            disabled={game.isStand}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Hit
          </button>
          <button
            onClick={game.stand}
            disabled={game.isStand}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
          >
            Stand
          </button>
          <button
            onClick={game.reset}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Reset
          </button>
        </div>

        <button
          onClick={getRecommendation}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Recommend Move
        </button>
        {game.recommendation && (
          <div className="mt-2 p-2 border rounded bg-gray-50 text-sm">
            <strong>Suggestion:</strong> {game.recommendation}
          </div>
        )}
      </div>

      <BetControls bet={game.bet} setBet={game.setBet} chips={game.chips} />

      <GameHistory history={game.history} />
    </div>
  );
}
