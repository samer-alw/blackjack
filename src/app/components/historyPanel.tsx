"use client";

export default function GameHistory({ history }: any) {
  return (
    <div className="absolute right-4 top-4 bg-gray-100 p-4 rounded-lg shadow w-64 h-[90vh] overflow-y-auto text-sm">
      <h2 className="font-bold text-lg mb-2 text-center">Game History</h2>
      {history.length === 0 && (
        <p className="text-center text-gray-500">No games yet</p>
      )}
      {history.map((game: any, i: number) => (
        <div key={i} className="mb-4 border-b pb-2">
          <p className="font-semibold">Game {i + 1}</p>
          <p>
            Dealer:{" "}
            {game.dealerCards.map((c: any) => `${c.number}${c.suit}`).join(" ")}
          </p>
          <p>
            Player:{" "}
            {game.playerCards.map((c: any) => `${c.number}${c.suit}`).join(" ")}
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
  );
}
