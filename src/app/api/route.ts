import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

interface Card {
  number: string;
  suit: string;
}

interface RequestBody {
  playerCards: Card[];
  dealerCard: Card;
  bet: number;
  chips: number;
}

export async function POST(req: Request) {
  try {
    console.log("🔹 Checking Gemini API Key...");
    console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

    const { playerCards, dealerCard, bet, chips } =
      (await req.json()) as RequestBody;

    console.log("🃏 Player Cards:", playerCards);
    console.log("🂠 Dealer Card:", dealerCard);
    console.log("💰 Bet:", bet, "Chips:", chips);

    const prompt = `
      You are a blackjack strategy advisor.
      Player cards: ${playerCards
        .map((c) => `${c.number}${c.suit}`)
        .join(", ")}.
      Dealer visible card: ${dealerCard.number}${dealerCard.suit}.
      What move should the player make? (Hit or Stand) reply with one word.
    `.trim();

    const result = await model.generateContent(prompt);

    console.log("✅ Gemini raw result:", result);

    const response = await result.response;
    const output = await response.text();

    console.log("✅ Gemini output text:", output);

    return NextResponse.json({ output });
  } catch (error: unknown) {
    console.error("❌ Gemini API error details:", error);

    // Narrow unknown error to Error type safely
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch AI recommendation";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
