"use client";

export default function ChipControls({ chips, setChips }: any) {
  return (
    <div className="absolute top-4 left-4 bg-gray-100 p-3 rounded-lg shadow text-sm">
      <p className="font-semibold mb-1">💰 Chips: {chips}</p>
      <div className="flex gap-2">
        {[10, 50, 100, 500].map((a) => (
          <button
            key={a}
            onClick={() => setChips((prev: number) => prev + a)}
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            +{a}
          </button>
        ))}
      </div>
    </div>
  );
}
