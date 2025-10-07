import { Card, CardGen, calculateScore, dealerTurn } from "./helperFunctions";

// Define the shape of the game state
export interface GameState {
  dealerCards: Card[];
  playerCards: Card[];
  isStand: boolean;
  roundOver: boolean;
  message: string;
  bet: number;
}

// Initialize a new game state
export function initializeGame(chips: number, bet: number): GameState {
  return {
    dealerCards: [CardGen()],
    playerCards: [CardGen(), CardGen()],
    isStand: false,
    roundOver: false,
    message: "",
    bet,
  };
}

// Hit function
export function hit(gameState: GameState): GameState {
  if (gameState.isStand) return gameState;

  const newPlayerCards = [...gameState.playerCards, CardGen()];
  const score = calculateScore(newPlayerCards);
  return {
    ...gameState,
    playerCards: newPlayerCards,
    isStand: score > 21 ? true : gameState.isStand,
    roundOver: score > 21 ? true : gameState.roundOver,
  };
}

// Stand function
export function stand(gameState: GameState): GameState {
  if (gameState.isStand) return gameState;

  const newDealerCards = dealerTurn(gameState.dealerCards);
  return {
    ...gameState,
    dealerCards: newDealerCards,
    isStand: true,
    roundOver: true,
  };
}

// Reset function
export function reset(chips: number, bet: number): GameState {
  return initializeGame(chips, bet);
}

// Calculate outcome
export function calculateOutcome(gameState: GameState) {
  const playerTotal = calculateScore(gameState.playerCards);
  const dealerTotal = calculateScore(gameState.dealerCards);

  let message = "";
  let chipsChange = 0;

  if (playerTotal > 21) {
    message = "Bust !";
    chipsChange = -gameState.bet;
  } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
    message = "You win!";
    chipsChange = gameState.bet;
  } else if (dealerTotal === playerTotal) {
    message = "It's a draw!";
    chipsChange = 0;
  } else {
    message = "Dealer wins!";
    chipsChange = -gameState.bet;
  }

  return { message, chipsChange };
}
