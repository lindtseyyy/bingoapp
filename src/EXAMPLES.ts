/**
 * Example Usage Guide
 * This file demonstrates how to use the Bingo app services
 * Copy these code snippets into your components as needed
 */

// ==================== CARD GENERATION EXAMPLES ====================

import { BingoCard, generateBingoCard, markNumber, resetCard, validateBingoCard } from './logic/bingoGenerator';

// Example 1: Generate a new card
function exampleGenerateCard() {
  const card = generateBingoCard();
  console.log('Generated card:', card);
  // Card has: id, cells (5x5 array), createdAt
}

// Example 2: Mark a number on a card
function exampleMarkNumber() {
  const card = generateBingoCard();
  const updatedCard = markNumber(card, 42);
  console.log('Marked number 42');
  // All cells with value 42 are now marked
}

// Example 3: Reset all marks on a card
function exampleResetCard() {
  const card = generateBingoCard();
  const freshCard = resetCard(card);
  console.log('Card reset - all marks cleared');
}

// Example 4: Validate a card (check for duplicates)
function exampleValidateCard() {
  const card = generateBingoCard();
  const isValid = validateBingoCard(card);
  console.log('Card is valid:', isValid); // Should always be true
}

// ==================== STORAGE EXAMPLES ====================

import {
    deleteCard,
    getAllCards,
    getAllPatterns,
    getCardById,
    saveCard,
    savePattern,
} from './services/storageService';

// Example 5: Save a card to storage
async function exampleSaveCard() {
  const card = generateBingoCard();
  await saveCard(card);
  console.log('Card saved!');
}

// Example 6: Load all cards
async function exampleLoadCards() {
  const cards = await getAllCards();
  console.log(`Loaded ${cards.length} cards`);
}

// Example 7: Get specific card by ID
async function exampleGetCard() {
  const card = await getCardById('card_123');
  if (card) {
    console.log('Found card:', card);
  }
}

// Example 8: Delete a card
async function exampleDeleteCard() {
  await deleteCard('card_123');
  console.log('Card deleted');
}

// ==================== PATTERN EXAMPLES ====================

import {
    checkPattern,
    createFourCornersPattern,
    createFullHousePattern,
    createPattern,
    createXPattern,
    getMissingNumbers,
    isOnPot,
    WinningPattern,
} from './services/patternService';

// Example 9: Create a custom pattern
function exampleCreatePattern() {
  const grid = [
    [true, false, false, false, true],
    [false, true, false, true, false],
    [false, false, true, false, false],
    [false, true, false, true, false],
    [true, false, false, false, true],
  ];
  
  const pattern = createPattern('Diamond Shape', grid);
  console.log('Created pattern:', pattern);
}

// Example 10: Use predefined patterns
function examplePredefinedPatterns() {
  const xPattern = createXPattern();
  const cornersPattern = createFourCornersPattern();
  const fullHouse = createFullHousePattern();
  
  console.log('Created 3 predefined patterns');
}

// Example 11: Check if card matches pattern
function exampleCheckPattern() {
  const card = generateBingoCard();
  const pattern = createPattern('Four Corners', createFourCornersPattern());
  
  const isWinner = checkPattern(card, pattern);
  console.log('Is winner:', isWinner);
}

// Example 12: Get missing numbers for a pattern
function exampleMissingNumbers() {
  const card = generateBingoCard();
  const pattern = createPattern('X-Shape', createXPattern());
  
  const missing = getMissingNumbers(card, pattern);
  console.log('Missing numbers:', missing);
  console.log(`Need ${missing.length} more numbers to win`);
}

// Example 13: Check if "on pot" (one away from winning)
function exampleOnPot() {
  const card = generateBingoCard();
  const pattern = createPattern('Four Corners', createFourCornersPattern());
  
  const onPot = isOnPot(card, pattern);
  if (onPot) {
    console.log('🔥 ON POT!');
  }
}

// ==================== ANALYSIS EXAMPLES ====================

import {
    analyzeCardForPattern,
    analyzeGame,
    generateAnalysisSummary,
    getClosestPatterns,
} from './services/waitingNumberService';

// Example 14: Analyze entire game
async function exampleAnalyzeGame() {
  const cards = await getAllCards();
  const patterns = await getAllPatterns();
  
  const analysis = analyzeGame(cards, patterns);
  
  console.log('Total analyses:', analysis.cardAnalyses.length);
  console.log('Cards on pot:', analysis.potCards.length);
  console.log('Winners:', analysis.winningCards.length);
  console.log('Numbers to watch:', analysis.nextNumbersToWatch);
}

// Example 15: Analyze single card against pattern
function exampleAnalyzeCard() {
  const card = generateBingoCard();
  const pattern = createPattern('X-Shape', createXPattern());
  
  const analysis = analyzeCardForPattern(card, pattern);
  console.log('Analysis:', {
    isWinner: analysis.isWinner,
    isOnPot: analysis.isOnPot,
    missing: analysis.missingNumbers,
    progress: `${analysis.totalMarked}/${analysis.totalRequired}`,
  });
}

// Example 16: Get closest patterns (least missing numbers)
async function exampleClosestPatterns() {
  const card = generateBingoCard();
  const patterns = await getAllPatterns();
  
  const closest = getClosestPatterns(card, patterns, 3);
  console.log('3 closest patterns:');
  closest.forEach(p => {
    console.log(`- ${p.patternName}: ${p.missingNumbers.length} numbers away`);
  });
}

// Example 17: Generate user-friendly summary
function exampleSummary() {
  const card = generateBingoCard();
  const pattern = createPattern('Four Corners', createFourCornersPattern());
  
  const analysis = analyzeCardForPattern(card, pattern);
  const summary = generateAnalysisSummary(analysis);
  
  console.log(summary);
  // Output examples:
  // "🎉 WINNER! Pattern: Four Corners"
  // "🔥 ON POT! Need 42 to win Four Corners"
  // "Almost there! Need 12, 35, 58 for Four Corners"
}

// ==================== COMPLETE GAME FLOW EXAMPLE ====================

async function exampleCompleteGameFlow() {
  // 1. Generate and save a card
  const card = generateBingoCard();
  await saveCard(card);
  
  // 2. Create and save a pattern
  const pattern = createPattern('Four Corners', createFourCornersPattern());
  await savePattern(pattern);
  
  // 3. Simulate calling numbers
  const calledNumbers = [1, 15, 61, 75]; // Corner numbers
  
  let currentCard = card;
  for (const num of calledNumbers) {
    currentCard = markNumber(currentCard, num);
    await saveCard(currentCard); // Save after each mark
    
    // Check if winner
    const analysis = analyzeCardForPattern(currentCard, pattern);
    console.log(`Called ${num}: ${generateAnalysisSummary(analysis)}`);
  }
}

// ==================== REACT COMPONENT EXAMPLES ====================

import { useEffect, useState } from 'react';

// Example 18: React component using the services
function ExampleGameComponent() {
  const [cards, setCards] = useState<BingoCard[]>([]);
  const [patterns, setPatterns] = useState<WinningPattern[]>([]);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      const loadedCards = await getAllCards();
      const loadedPatterns = await getAllPatterns();
      setCards(loadedCards);
      setPatterns(loadedPatterns);
    }
    loadData();
  }, []);

  // Call a random number
  const callNumber = () => {
    const available = Array.from({ length: 75 }, (_, i) => i + 1)
      .filter(n => !calledNumbers.includes(n));
    
    const random = available[Math.floor(Math.random() * available.length)];
    
    setCalledNumbers([...calledNumbers, random]);
    
    // Mark on all cards
    const updatedCards = cards.map(card => markNumber(card, random));
    setCards(updatedCards);
    
    // Save updated cards
    updatedCards.forEach(card => saveCard(card));
  };

  // Analyze current state
  const analysis = analyzeGame(cards, patterns);

  return null; // Your JSX here
}

// ==================== UTILITY EXAMPLES ====================

// Example 19: Export game data for backup
import { exportAllData, importData } from './services/storageService';

async function exampleBackup() {
  const backup = await exportAllData();
  console.log('Backup JSON:', backup);
  // Save this to a file or send to server
}

// Example 20: Restore from backup
async function exampleRestore() {
  const backupJson = '...'; // Your backup JSON
  await importData(backupJson);
  console.log('Data restored!');
}

// ==================== ADVANCED PATTERNS ====================

// Example 21: Create multiple cards at once
async function exampleBulkCreateCards() {
  const count = 5;
  for (let i = 0; i < count; i++) {
    const card = generateBingoCard();
    await saveCard(card);
  }
  console.log(`Created ${count} cards`);
}

// Example 22: Find which number would help the most
import { getCardsWaitingForNumber } from './services/waitingNumberService';

async function exampleFindImportantNumber() {
  const cards = await getAllCards();
  const patterns = await getAllPatterns();
  
  const number = 42;
  const waiting = getCardsWaitingForNumber(number, cards, patterns);
  
  console.log(`Number ${number} would help ${waiting.length} card/pattern combinations`);
}

// Example 23: Calculate probability of winning
import { getProbabilityInsight } from './services/waitingNumberService';

function exampleProbability() {
  const calledNumbers = [1, 2, 3, 4, 5]; // 5 numbers called
  const missingNumbers = [42, 58]; // Need these 2 to win
  
  const insight = getProbabilityInsight(calledNumbers, missingNumbers);
  console.log(`Probability: ${(insight.probability * 100).toFixed(2)}%`);
  console.log(`Need ${insight.numbersNeeded} out of ${insight.numbersRemaining} remaining`);
}

// ==================== PATTERN VALIDATION ====================

import { getPatternPositions, validatePattern } from './services/patternService';

// Example 24: Validate custom pattern
function exampleValidatePattern() {
  const grid = createXPattern();
  const isValid = validatePattern(grid);
  console.log('Pattern is valid:', isValid);
}

// Example 25: Get pattern positions
function examplePatternPositions() {
  const pattern = createPattern('X-Shape', createXPattern());
  const positions = getPatternPositions(pattern);
  
  console.log('Pattern requires these positions:');
  positions.forEach(pos => {
    console.log(`Row ${pos.row}, Col ${pos.col}`);
  });
}

export default {
  // Export all examples for reference
  exampleGenerateCard,
  exampleMarkNumber,
  exampleResetCard,
  exampleValidateCard,
  exampleSaveCard,
  exampleLoadCards,
  exampleGetCard,
  exampleDeleteCard,
  exampleCreatePattern,
  examplePredefinedPatterns,
  exampleCheckPattern,
  exampleMissingNumbers,
  exampleOnPot,
  exampleAnalyzeGame,
  exampleAnalyzeCard,
  exampleClosestPatterns,
  exampleSummary,
  exampleCompleteGameFlow,
  ExampleGameComponent,
  exampleBackup,
  exampleRestore,
  exampleBulkCreateCards,
  exampleFindImportantNumber,
  exampleProbability,
  exampleValidatePattern,
  examplePatternPositions,
};
