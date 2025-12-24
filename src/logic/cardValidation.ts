/**
 * Card Validation Logic
 * Validates numbers entered into Bingo cards
 */

import { BingoCard } from './bingoGenerator';

const COLUMN_RANGES = {
  0: { min: 1, max: 15, letter: 'B' },   // Column 0 = B
  1: { min: 16, max: 30, letter: 'I' },  // Column 1 = I
  2: { min: 31, max: 45, letter: 'N' },  // Column 2 = N
  3: { min: 46, max: 60, letter: 'G' },  // Column 3 = G
  4: { min: 61, max: 75, letter: 'O' },  // Column 4 = O
};

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate a number for a specific column
 */
export function validateNumberForColumn(
  number: number,
  columnIndex: number
): ValidationResult {
  const range = COLUMN_RANGES[columnIndex as keyof typeof COLUMN_RANGES];

  if (!range) {
    return { isValid: false, error: 'Invalid column' };
  }

  if (number < range.min || number > range.max) {
    return {
      isValid: false,
      error: `${range.letter} column must be ${range.min}-${range.max}`,
    };
  }

  return { isValid: true };
}

/**
 * Check if a number is a duplicate in the card
 */
export function isDuplicateNumber(card: BingoCard, number: number): boolean {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const value = card.cells[row][col].value;
      if (value !== 'FREE' && value === number) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Validate a complete card
 */
export function validateCompleteCard(card: BingoCard): ValidationResult {
  const numbers = new Set<number>();

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const value = card.cells[row][col].value;

      // Skip FREE space
      if (value === 'FREE') continue;

      // Check if number is 0 (unset)
      if (value === 0) {
        return { isValid: false, error: 'All cells must be filled' };
      }

      // Check column range
      const validation = validateNumberForColumn(value, col);
      if (!validation.isValid) {
        return validation;
      }

      // Check for duplicates
      if (numbers.has(value)) {
        return { isValid: false, error: `Duplicate number: ${value}` };
      }

      numbers.add(value);
    }
  }

  return { isValid: true };
}

/**
 * Get the column letter for an index
 */
export function getColumnLetter(columnIndex: number): string {
  const range = COLUMN_RANGES[columnIndex as keyof typeof COLUMN_RANGES];
  return range ? range.letter : '';
}

/**
 * Get the valid range for a column
 */
export function getColumnRange(columnIndex: number): { min: number; max: number } | null {
  const range = COLUMN_RANGES[columnIndex as keyof typeof COLUMN_RANGES];
  return range ? { min: range.min, max: range.max } : null;
}

/**
 * Validate a number being entered (real-time validation)
 */
export function validateNumberEntry(
  card: BingoCard,
  number: number,
  row: number,
  col: number
): ValidationResult {
  // Check column range
  const rangeValidation = validateNumberForColumn(number, col);
  if (!rangeValidation.isValid) {
    return rangeValidation;
  }

  // Check for duplicates (excluding the current cell)
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (r === row && c === col) continue; // Skip current cell
      
      const value = card.cells[r][c].value;
      if (value !== 'FREE' && value === number) {
        return { isValid: false, error: `Number ${number} already used` };
      }
    }
  }

  return { isValid: true };
}
