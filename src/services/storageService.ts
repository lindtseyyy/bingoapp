/**
 * Storage Service
 * Abstracted storage layer for Bingo app data
 * This service can be easily swapped from AsyncStorage to Firebase/Supabase
 * without refactoring the UI components.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { BingoCard } from '../logic/bingoGenerator';
import { WinningPattern, createDiagonalLinePattern, createDikitPattern, createFullHousePattern, createHorizontalLinePattern, createPatongPattern, createPattern, createVerticalLinePattern } from './patternService';

// Storage keys
const STORAGE_KEYS = {
  CARDS: '@bingo_cards',
  PATTERNS: '@bingo_patterns',
  GAME_STATE: '@bingo_game_state',
} as const;

// Game State interface
export interface GameState {
  calledNumbers: number[];
  activeCardIds: string[];
  activePatternIds: string[];
  lastUpdated: number;
}

// ==================== CARD OPERATIONS ====================

/**
 * Save a single Bingo card
 */
export async function saveCard(card: BingoCard): Promise<void> {
  try {
    const existingCards = await getAllCards();
    const updatedCards = [...existingCards.filter(c => c.id !== card.id), card];
    await AsyncStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(updatedCards));
  } catch (error) {
    console.error('Error saving card:', error);
    throw new Error('Failed to save card');
  }
}

/**
 * Get all saved Bingo cards
 */
export async function getAllCards(): Promise<BingoCard[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CARDS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting cards:', error);
    return [];
  }
}

/**
 * Get a specific card by ID
 */
export async function getCardById(id: string): Promise<BingoCard | null> {
  try {
    const cards = await getAllCards();
    return cards.find(card => card.id === id) || null;
  } catch (error) {
    console.error('Error getting card by ID:', error);
    return null;
  }
}

/**
 * Delete a card by ID
 */
export async function deleteCard(id: string): Promise<void> {
  try {
    const cards = await getAllCards();
    const updatedCards = cards.filter(card => card.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(updatedCards));
  } catch (error) {
    console.error('Error deleting card:', error);
    throw new Error('Failed to delete card');
  }
}

/**
 * Delete all cards
 */
export async function deleteAllCards(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify([]));
  } catch (error) {
    console.error('Error deleting all cards:', error);
    throw new Error('Failed to delete all cards');
  }
}

// ==================== PATTERN OPERATIONS ====================

/**
 * Save a winning pattern
 */
export async function savePattern(pattern: WinningPattern): Promise<void> {
  try {
    // Prevent saving over built-in pattern IDs
    if (pattern.id === 'builtin_dikit' || pattern.id === 'builtin_patong' || pattern.id === 'builtin_horizontal_line' || pattern.id === 'builtin_vertical_line' || pattern.id === 'builtin_diagonal_line' || pattern.id === 'builtin_full_house') {
      throw new Error('Cannot modify built-in patterns');
    }
    
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PATTERNS);
    const savedPatterns = data ? JSON.parse(data) : [];
    
    // Only work with user patterns (exclude built-in)
    const userPatterns = savedPatterns.filter(
      (p: WinningPattern) => p.name !== 'Dikit' && p.name !== 'Patong' && p.name !== 'Horizontal Line' && p.name !== 'Vertical Line' && p.name !== 'Diagonal Line' && p.name !== 'Full House'
    );
    
    const updatedPatterns = [...userPatterns.filter((p: WinningPattern) => p.id !== pattern.id), pattern];
    await AsyncStorage.setItem(STORAGE_KEYS.PATTERNS, JSON.stringify(updatedPatterns));
  } catch (error) {
    console.error('Error saving pattern:', error);
    throw new Error('Failed to save pattern');
  }
}

/**
 * Get all saved patterns
 */
export async function getAllPatterns(): Promise<WinningPattern[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PATTERNS);
    const savedPatterns = data ? JSON.parse(data) : [];
    
    // Always include built-in patterns at the beginning
    const builtInPatterns: WinningPattern[] = [
      { ...createPattern('Dikit', createDikitPattern()), id: 'builtin_dikit' },
      { ...createPattern('Patong', createPatongPattern()), id: 'builtin_patong' },
      { ...createPattern('Horizontal Line', createHorizontalLinePattern()), id: 'builtin_horizontal_line' },
      { ...createPattern('Vertical Line', createVerticalLinePattern()), id: 'builtin_vertical_line' },
      { ...createPattern('Diagonal Line', createDiagonalLinePattern()), id: 'builtin_diagonal_line' },
      { ...createPattern('Full House', createFullHousePattern()), id: 'builtin_full_house' },
    ];
    
    // Filter out any saved patterns with built-in names to prevent duplicates
    const userPatterns = savedPatterns.filter(
      (p: WinningPattern) => p.name !== 'Dikit' && p.name !== 'Patong' && p.name !== 'Horizontal Line' && p.name !== 'Vertical Line' && p.name !== 'Diagonal Line' && p.name !== 'Full House'
    );
    
    return [...builtInPatterns, ...userPatterns];
  } catch (error) {
    console.error('Error getting patterns:', error);
    return [];
  }
}

/**
 * Get a specific pattern by ID
 */
export async function getPatternById(id: string): Promise<WinningPattern | null> {
  try {
    const patterns = await getAllPatterns();
    return patterns.find(pattern => pattern.id === id) || null;
  } catch (error) {
    console.error('Error getting pattern by ID:', error);
    return null;
  }
}

/**
 * Delete a pattern by ID
 */
export async function deletePattern(id: string): Promise<void> {
  try {
    // Prevent deletion of built-in patterns
    if (id === 'builtin_dikit' || id === 'builtin_patong' || id === 'builtin_horizontal_line' || id === 'builtin_vertical_line' || id === 'builtin_diagonal_line' || id === 'builtin_full_house') {
      throw new Error('Cannot delete built-in patterns');
    }
    
    const patterns = await getAllPatterns();
    const updatedPatterns = patterns.filter(pattern => 
      pattern.id !== id && pattern.id !== 'builtin_dikit' && pattern.id !== 'builtin_patong' && pattern.id !== 'builtin_horizontal_line' && pattern.id !== 'builtin_vertical_line' && pattern.id !== 'builtin_diagonal_line' && pattern.id !== 'builtin_full_house'
    );
    // Only save user patterns (exclude built-in)
    const userPatterns = updatedPatterns.filter(
      p => p.id !== 'builtin_dikit' && p.id !== 'builtin_patong' && p.id !== 'builtin_horizontal_line' && p.id !== 'builtin_vertical_line' && p.id !== 'builtin_diagonal_line' && p.id !== 'builtin_full_house'
    );
    await AsyncStorage.setItem(STORAGE_KEYS.PATTERNS, JSON.stringify(userPatterns));
  } catch (error) {
    console.error('Error deleting pattern:', error);
    throw new Error('Failed to delete pattern');
  }
}

// ==================== GAME STATE OPERATIONS ====================

/**
 * Save the current game state
 */
export async function saveGameState(gameState: GameState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(gameState));
  } catch (error) {
    console.error('Error saving game state:', error);
    throw new Error('Failed to save game state');
  }
}

/**
 * Get the current game state
 */
export async function getGameState(): Promise<GameState | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.GAME_STATE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting game state:', error);
    return null;
  }
}

/**
 * Clear the game state (reset game)
 */
export async function clearGameState(): Promise<void> {
  try {
    const emptyState: GameState = {
      calledNumbers: [],
      activeCardIds: [],
      activePatternIds: [],
      lastUpdated: Date.now(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(emptyState));
  } catch (error) {
    console.error('Error clearing game state:', error);
    throw new Error('Failed to clear game state');
  }
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Clear all app data (useful for development/testing)
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.CARDS,
      STORAGE_KEYS.PATTERNS,
      STORAGE_KEYS.GAME_STATE,
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw new Error('Failed to clear all data');
  }
}

/**
 * Export all data (for backup or migration)
 */
export async function exportAllData(): Promise<string> {
  try {
    const cards = await getAllCards();
    const patterns = await getAllPatterns();
    const gameState = await getGameState();

    return JSON.stringify({
      cards,
      patterns,
      gameState,
      exportedAt: Date.now(),
    }, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data');
  }
}

/**
 * Import data from a backup
 */
export async function importData(jsonData: string): Promise<void> {
  try {
    const data = JSON.parse(jsonData);

    if (data.cards) {
      await AsyncStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(data.cards));
    }

    if (data.patterns) {
      await AsyncStorage.setItem(STORAGE_KEYS.PATTERNS, JSON.stringify(data.patterns));
    }

    if (data.gameState) {
      await AsyncStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(data.gameState));
    }
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error('Failed to import data');
  }
}
