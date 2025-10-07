"use client";
import { useState } from "react";

interface BetControlsProps {
  chips: number;
  bet: number;
  setBet: (amount: number) => void;
}

export default function BetControls({ chips, bet, setBet }: BetControlsProps) {
  const [tempBet, setTempBet] = useState(100);

  const addToBet = (amount: number) => {
    setTempBet((prev) => Math.min(prev + amount, chips));
  };

  const handleSubmit = () => {
    if (tempBet <= 0) {
      alert("Bet must be greater than 0");
      return;
    }
    if (tempBet > chips) {
      alert("Bet cannot exceed your chips");
      return;
    }
    setBet(tempBet);
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-4 font-sans text-white">
      <input
        type="number"
        value={tempBet}
        onChange={(e) => setTempBet(Number(e.target.value))}
        min={0}
        max={chips}
        className="px-4 py-2 border rounded w-32 text-center"
      />

      <div className="flex gap-2">
        {[5, 25, 100].map((amt) => (
          <button
            key={amt}
            onClick={() => addToBet(amt)}
            className="px-3 py-2 bg-white text-black rounded hover:bg-gray-600"
          >
            +{amt}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-white text-black rounded-lg hover:bg-blue-700"
      >
        Place Bet
      </button>
    </div>
  );
}
