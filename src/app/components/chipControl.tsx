"use client";

import { useState } from "react";

interface TokenAdderProps {
  chips: number;
  setChips: (amount: number) => void;
}

export default function TokenAdder({ chips, setChips }: TokenAdderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const addTokens = (amount: number) => {
    setChips(chips + amount);
    setIsOpen(false); // close popup after adding
  };

  return (
    <div className="absolute top-4 left-4 font-sans">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 bg-yellow-100 text-black rounded-lg hover:bg-blue-500 text-sm"
      >
        Chips💰: {chips}
      </button>

      {/* Popup Buttons */}
      <div
        className={`mt-2 flex flex-col space-y-2 bg-yellow-100 p-3 rounded-lg shadow-lg transform transition-all duration-300 ease-out
        ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {[10, 50, 100].map((amount) => (
          <button
            key={amount}
            onClick={() => addTokens(amount)}
            className="px-3 py-2 bg-white text-black rounded-lg hover:bg-green-500 text-sm"
          >
            +{amount} Tokens
          </button>
        ))}
      </div>
    </div>
  );
}
