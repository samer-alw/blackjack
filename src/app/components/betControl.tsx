"use client";

export default function BetControls({ bet, setBet, chips }: any) {
  return (
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
            onClick={() => setBet((prev: number) => prev + a)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            +{a}
          </button>
        ))}
      </div>
    </div>
  );
}
