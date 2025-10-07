import { Card } from "./helperFunctions"; // if you exported a Card type

export async function fetchAIRecommendation(params: {
  playerCards: Card[];
  dealerCard: Card;
  bet: number;
  chips: number;
}): Promise<string> {
  const response = await fetch("/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch AI recommendation");
  }

  const data = await response.json();
  return data.output; // the suggestion string
}
