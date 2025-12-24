/**
 * Waiting Number Analysis Service
 * Real-time analysis of which numbers a player needs to win
 */

import { BingoCard } from '../logic/bingoGenerator';
import { WinningPattern, checkPattern, getMissingNumbers, getWinningPaths, isOnPot } from './patternService';

export interface WaitingNumberAnalysis {
  cardId: string;
  patternId: string;
  patternName: string;
  isWinner: boolean;
  isOnPot: boolean;
  missingNumbers: number[];
  totalRequired: number;
  totalMarked: number;
  pathIndex?: number; // Index of this specific winning path (for patterns with multiple paths)
}

export interface GameAnalysis {
  cardAnalyses: WaitingNumberAnalysis[];
  potCards: WaitingNumberAnalysis[]; // Cards that are one number away
  winningCards: WaitingNumberAnalysis[]; // Cards that have won
  nextNumbersToWatch: number[]; // All unique numbers that could lead to a win
}

/**
 * Analyze a single card against a pattern
 */
export function analyzeCardForPattern(
  card: BingoCard,
  pattern: WinningPattern
): WaitingNumberAnalysis {
  const isWinner = checkPattern(card, pattern);
  const missing = getMissingNumbers(card, pattern);
  const onPot = isOnPot(card, pattern);

  // Special handling for Dikit and Patong patterns
  let totalRequired = 2; // Default for Dikit/Patong (always need 2 adjacent)
  let totalMarked = 0;
  
  if (pattern.name === 'Dikit' || pattern.name === 'Patong') {
    // For these patterns, totalRequired is always 2
    totalRequired = 2;
    // Calculate how many are marked: if we have any missing numbers, 
    // it means at least one cell in the best pair is marked
    // If missing.length is 0, both cells are marked (won)
    // If missing.length is 1, one cell is marked
    // If missing.length > 1, we have multiple incomplete pairs, so at least 1 marked
    if (missing.length === 0) {
      totalMarked = 2; // Both cells marked (winner)
    } else if (missing.length === 1) {
      totalMarked = 1; // One cell marked (on pot)
    } else {
      totalMarked = 1; // Multiple incomplete pairs, at least one marked total
    }
  } else {
    // Count total required squares for standard patterns
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (pattern.grid[row][col]) {
          totalRequired++;
        }
      }
    }
    totalMarked = totalRequired - missing.length;
  }

  return {
    cardId: card.id,
    patternId: pattern.id,
    patternName: pattern.name,
    isWinner,
    isOnPot: onPot,
    missingNumbers: missing,
    totalRequired,
    totalMarked,
  };
}

/**
 * Analyze all cards against all patterns
 */
export function analyzeGame(
  cards: BingoCard[],
  patterns: WinningPattern[]
): GameAnalysis {
  const cardAnalyses: WaitingNumberAnalysis[] = [];
  const potCards: WaitingNumberAnalysis[] = [];
  const winningCards: WaitingNumberAnalysis[] = [];
  const nextNumbersSet = new Set<number>();

  // Analyze each card against each pattern
  for (const card of cards) {
    for (const pattern of patterns) {
      const isWinner = checkPattern(card, pattern);
      
      if (isWinner) {
        // Card already won this pattern
        const analysis = analyzeCardForPattern(card, pattern);
        cardAnalyses.push(analysis);
        winningCards.push(analysis);
        continue;
      }
      
      // Get all individual winning paths for this pattern
      const paths = getWinningPaths(card, pattern);
      
      // Create a separate analysis for each winning path
      for (let i = 0; i < paths.length; i++) {
        const pathMissing = paths[i];
        
        // Skip if no progress on this path
        if (pathMissing.length === 0) continue;
        
        // Determine totalRequired based on pattern type
        let totalRequired = 2; // Default for Dikit/Patong
        if (pattern.name === 'Horizontal Line' || pattern.name === 'Vertical Line' || pattern.name === 'Diagonal Line') {
          // Horizontal/Vertical/Diagonal Line: 5 cells per line (but FREE is auto-marked)
          totalRequired = 5;
        } else if (pattern.name !== 'Dikit' && pattern.name !== 'Patong') {
          // Count total required squares for standard patterns
          totalRequired = 0;
          for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
              if (pattern.grid[row][col]) {
                totalRequired++;
              }
            }
          }
        }
        
        const totalMarked = totalRequired - pathMissing.length;
        const onPot = pathMissing.length === 1;
        
        // Only include if at least one cell is marked
        if (totalMarked > 0) {
          const analysis: WaitingNumberAnalysis = {
            cardId: card.id,
            patternId: pattern.id,
            patternName: pattern.name,
            isWinner: false,
            isOnPot: onPot,
            missingNumbers: pathMissing,
            totalRequired,
            totalMarked,
            pathIndex: paths.length > 1 ? i : undefined,
          };
          
          cardAnalyses.push(analysis);
          
          if (onPot) {
            potCards.push(analysis);
          }
          
          // Add missing numbers to watch list
          pathMissing.forEach(num => nextNumbersSet.add(num));
        }
      }
    }
  }

  return {
    cardAnalyses,
    potCards,
    winningCards,
    nextNumbersToWatch: Array.from(nextNumbersSet).sort((a, b) => a - b),
  };
}

/**
 * Get the closest patterns (least missing numbers)
 */
export function getClosestPatterns(
  card: BingoCard,
  patterns: WinningPattern[],
  limit: number = 3
): WaitingNumberAnalysis[] {
  const analyses = patterns
    .map(pattern => analyzeCardForPattern(card, pattern))
    .filter(analysis => !analysis.isWinner) // Exclude already won patterns
    .sort((a, b) => a.missingNumbers.length - b.missingNumbers.length);

  return analyses.slice(0, limit);
}

/**
 * Check if a number would help any card
 */
export function isNumberImportant(
  number: number,
  cards: BingoCard[],
  patterns: WinningPattern[]
): boolean {
  for (const card of cards) {
    for (const pattern of patterns) {
      const missing = getMissingNumbers(card, pattern);
      if (missing.includes(number)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Get cards that would win if a specific number is called
 */
export function getCardsWaitingForNumber(
  number: number,
  cards: BingoCard[],
  patterns: WinningPattern[]
): Array<{ card: BingoCard; pattern: WinningPattern; analysis: WaitingNumberAnalysis }> {
  const results: Array<{ card: BingoCard; pattern: WinningPattern; analysis: WaitingNumberAnalysis }> = [];

  for (const card of cards) {
    for (const pattern of patterns) {
      const analysis = analyzeCardForPattern(card, pattern);

      if (!analysis.isWinner && analysis.missingNumbers.includes(number)) {
        results.push({ card, pattern, analysis });
      }
    }
  }

  return results;
}

/**
 * Get probability insights
 */
export interface ProbabilityInsight {
  numbersRemaining: number;
  numbersNeeded: number;
  probability: number; // Simple probability (numbers needed / numbers remaining)
}

export function getProbabilityInsight(
  calledNumbers: number[],
  missingNumbers: number[]
): ProbabilityInsight {
  const totalNumbers = 75;
  const numbersRemaining = totalNumbers - calledNumbers.length;
  const numbersNeeded = missingNumbers.filter(num => !calledNumbers.includes(num)).length;

  const probability = numbersRemaining > 0 ? numbersNeeded / numbersRemaining : 0;

  return {
    numbersRemaining,
    numbersNeeded,
    probability,
  };
}

/**
 * Generate a summary message for UI display
 */
export function generateAnalysisSummary(analysis: WaitingNumberAnalysis): string {
  if (analysis.isWinner) {
    return `🎉 WINNER! Pattern: ${analysis.patternName}`;
  }

  if (analysis.isOnPot) {
    const number = analysis.missingNumbers[0];
    return `🔥 ON POT! Need ${number} to win ${analysis.patternName}`;
  }

  const count = analysis.missingNumbers.length;
  if (count <= 3) {
    return `Almost there! Need ${analysis.missingNumbers.join(', ')} for ${analysis.patternName}`;
  }

  return `Need ${count} numbers for ${analysis.patternName}`;
}

/**
 * Sort cards by how close they are to winning
 */
export function sortCardsByCloseness(
  analyses: WaitingNumberAnalysis[]
): WaitingNumberAnalysis[] {
  return [...analyses].sort((a, b) => {
    // Winners first
    if (a.isWinner && !b.isWinner) return -1;
    if (!a.isWinner && b.isWinner) return 1;

    // Then pot cards
    if (a.isOnPot && !b.isOnPot) return -1;
    if (!a.isOnPot && b.isOnPot) return 1;

    // Then by missing numbers (ascending)
    return a.missingNumbers.length - b.missingNumbers.length;
  });
}
