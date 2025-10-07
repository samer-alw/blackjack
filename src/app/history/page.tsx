"use client";
import { useState } from "react";
import { useBlackjackGame } from "../hooks/useBlackJackGame";
import { format } from "date-fns";
import Link from "next/link";

const ITEMS_PER_PAGE = 5;

export default function HistoryPage() {
  const { history } = useBlackjackGame();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = history.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="grid place-items-center min-h-screen bg-black font-sans text-xl">
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
      <div className="w-[70vw] h-[60vh] flex flex-col gap-4 overflow-hidden">
        {/* History Cards */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-4">
          {currentItems.map((entry, index) => (
            <div
              key={index}
              className="bg-black border border-white rounded-lg shadow-xl p-4 text-white grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div>
                <div className="font-semibold">Date</div>
                <div>{format(new Date(entry.date), "yyyy-MM-dd HH:mm:ss")}</div>
              </div>
              <div>
                <div className="font-semibold">Bet</div>
                <div>{entry.bet}</div>
              </div>
              <div>
                <div className="font-semibold">Score</div>
                <div>
                  You: {entry.playerScore} | Dealer: {entry.dealerScore}
                </div>
              </div>
              <div>
                <div className="font-semibold">Result</div>
                <div>{entry.outcome}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white text-black rounded disabled:opacity-50 hover:bg-gray-300"
            >
              Prev
            </button>

            {/* ✅ Page number display */}
            <span className="text-white">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white text-black rounded disabled:opacity-50 hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
