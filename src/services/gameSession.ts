/**
 * Game Session Management
 * Manages active game state with manual number calling
 */

import { BingoCard } from "../logic/bingoGenerator";
import {
    clearGameState,
    GameState,
    getGameState,
    saveGameState,
} from "../services/storageService";

export interface GameSession {
  activeCardIds: string[];
  activePatternIds: string[];
  calledNumbers: number[];
  sessionStartTime: number;
  isActive: boolean;
}

export interface CallHistoryEntry {
  number: number;
  timestamp: number;
  column: "B" | "I" | "N" | "G" | "O";
}

/**
 * Get column letter for a number
 */
export function getNumberColumn(
  num: number
): "B" | "I" | "N" | "G" | "O" | null {
  if (num >= 1 && num <= 15) return "B";
  if (num >= 16 && num <= 30) return "I";
  if (num >= 31 && num <= 45) return "N";
  if (num >= 46 && num <= 60) return "G";
  if (num >= 61 && num <= 75) return "O";
  return null;
}

/**
 * Validate a Bingo number
 */
export function isValidBingoNumber(num: number): boolean {
  return Number.isInteger(num) && num >= 1 && num <= 75;
}

/**
 * Create a new game session
 */
export function createGameSession(
  cardIds: string[],
  patternIds: string[]
): GameSession {
  return {
    activeCardIds: cardIds,
    activePatternIds: patternIds,
    calledNumbers: [],
    sessionStartTime: Date.now(),
    isActive: true,
  };
}

/**
 * Add a number to the call history
 */
export function addCalledNumber(
  session: GameSession,
  number: number
): GameSession {
  if (!isValidBingoNumber(number)) {
    throw new Error("Invalid Bingo number");
  }

  if (session.calledNumbers.includes(number)) {
    throw new Error("Number already called");
  }

  return {
    ...session,
    calledNumbers: [...session.calledNumbers, number],
  };
}

/**
 * Remove a number from the call history (undo)
 */
export function removeCalledNumber(
  session: GameSession,
  number: number
): GameSession {
  return {
    ...session,
    calledNumbers: session.calledNumbers.filter((n) => n !== number),
  };
}

/**
 * Get call history with metadata
 */
export function getCallHistory(session: GameSession): CallHistoryEntry[] {
  return session.calledNumbers.map((number, index) => ({
    number,
    timestamp: session.sessionStartTime + index * 1000, // Approximate
    column: getNumberColumn(number)!,
  }));
}

/**
 * Check if a number has been called
 */
export function hasBeenCalled(session: GameSession, number: number): boolean {
  return session.calledNumbers.includes(number);
}

/**
 * Get uncalled numbers
 */
export function getUncalledNumbers(session: GameSession): number[] {
  const allNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
  return allNumbers.filter((n) => !session.calledNumbers.includes(n));
}

/**
 * Get statistics
 */
export interface GameSessionStats {
  totalCalled: number;
  remaining: number;
  percentComplete: number;
  lastCalled: number | null;
}

export function getSessionStats(session: GameSession): GameSessionStats {
  const totalCalled = session.calledNumbers.length;
  const remaining = 75 - totalCalled;
  const percentComplete = (totalCalled / 75) * 100;
  const lastCalled =
    session.calledNumbers.length > 0
      ? session.calledNumbers[session.calledNumbers.length - 1]
      : null;

  return {
    totalCalled,
    remaining,
    percentComplete,
    lastCalled,
  };
}

/**
 * Save session to storage
 */
export async function saveSession(session: GameSession): Promise<void> {
  const gameState: GameState = {
    calledNumbers: session.calledNumbers,
    activeCardIds: session.activeCardIds,
    activePatternIds: session.activePatternIds,
    lastUpdated: Date.now(),
  };
  await saveGameState(gameState);
}

/**
 * Load session from storage
 */
export async function loadSession(): Promise<GameSession | null> {
  const gameState = await getGameState();
  if (!gameState) return null;

  return {
    activeCardIds: gameState.activeCardIds || [],
    activePatternIds: gameState.activePatternIds || [],
    calledNumbers: gameState.calledNumbers || [],
    sessionStartTime: gameState.lastUpdated,
    isActive: true,
  };
}

/**
 * Clear the active session
 */
export async function clearSession(): Promise<void> {
  await clearGameState();
}

/**
 * Apply called numbers to cards (mark them)
 */
export function applyCalledNumbersToCards(
  cards: BingoCard[],
  calledNumbers: number[]
): BingoCard[] {
  return cards.map((card) => {
    const updatedCard = { ...card };
    updatedCard.cells = card.cells.map((row) =>
      row.map((cell) => ({
        ...cell,
        marked:
          cell.value === "FREE" ||
          (cell.value !== 0 && calledNumbers.includes(cell.value as number)),
      }))
    );
    return updatedCard;
  });
}
