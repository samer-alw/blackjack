"use client";

interface ControlsProps {
  hit: () => void;
  stand: () => void;
  fetchRecommendation: () => void;
  recommendation: string;
  isStand: boolean;
}

export function Controls({
  hit,
  stand,
  fetchRecommendation,
  recommendation,
  isStand,
}: ControlsProps) {
  return (
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
      </div>

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
  );
}
