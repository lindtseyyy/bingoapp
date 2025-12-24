/**
 * Bingo Card Generator
 * Generates 5x5 Bingo cards following standard rules:
 * B: 1-15 | I: 16-30 | N: 31-45 (middle is FREE) | G: 46-60 | O: 61-75
 */

export interface BingoCell {
  column: 'B' | 'I' | 'N' | 'G' | 'O';
  value: number | 'FREE' | '';
  marked: boolean;
}

export interface BingoCard {
  id: string;
  name?: string;
  cells: BingoCell[][];
  createdAt: number;
}

const COLUMN_RANGES = {
  B: { min: 1, max: 15 },
  I: { min: 16, max: 30 },
  N: { min: 31, max: 45 },
  G: { min: 46, max: 60 },
  O: { min: 61, max: 75 },
};

const COLUMNS: Array<'B' | 'I' | 'N' | 'G' | 'O'> = ['B', 'I', 'N', 'G', 'O'];

/**
 * Generate random unique numbers for a specific column
 */
function generateColumnNumbers(
  column: 'B' | 'I' | 'N' | 'G' | 'O',
  count: number
): number[] {
  const range = COLUMN_RANGES[column];
  const numbers: Set<number> = new Set();

  while (numbers.size < count) {
    const num = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    numbers.add(num);
  }

  return Array.from(numbers);
}

/**
 * Generate a complete 5x5 Bingo card
 */
export function generateBingoCard(): BingoCard {
  const cells: BingoCell[][] = [];

  // Generate 5 rows
  for (let row = 0; row < 5; row++) {
    const rowCells: BingoCell[] = [];

    for (let col = 0; col < 5; col++) {
      const column = COLUMNS[col];

      // Middle square (row 2, col 2) is FREE space
      if (row === 2 && col === 2) {
        rowCells.push({
          column: 'N',
          value: 'FREE',
          marked: true, // FREE space is always marked
        });
      } else {
        rowCells.push({
          column,
          value: 0, // Placeholder, will be filled later
          marked: false,
        });
      }
    }

    cells.push(rowCells);
  }

  // Generate unique numbers for each column
  for (let col = 0; col < 5; col++) {
    const column = COLUMNS[col];
    const numbers = generateColumnNumbers(column, 5);

    // Assign numbers to each row in this column
    let numIndex = 0;
    for (let row = 0; row < 5; row++) {
      // Skip the FREE space
      if (row === 2 && col === 2) continue;

      cells[row][col].value = numbers[numIndex];
      numIndex++;
    }
  }

  return {
    id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    cells,
    createdAt: Date.now(),
  };
}

/**
 * Validate that a Bingo card has no duplicate numbers
 */
export function validateBingoCard(card: BingoCard): boolean {
  const numbers = new Set<number>();

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const value = card.cells[row][col].value;

      if (value === 'FREE') continue;

      if (numbers.has(value)) {
        return false; // Duplicate found
      }

      numbers.add(value);
    }
  }

  return true;
}

/**
 * Get all numbers from a card as an array
 */
export function getCardNumbers(card: BingoCard): number[] {
  const numbers: number[] = [];

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const value = card.cells[row][col].value;
      if (value !== 'FREE') {
        numbers.push(value);
      }
    }
  }

  return numbers;
}

/**
 * Mark a number on the card if it exists
 */
export function markNumber(card: BingoCard, number: number): BingoCard {
  const updatedCard = JSON.parse(JSON.stringify(card)); // Deep clone

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (updatedCard.cells[row][col].value === number) {
        updatedCard.cells[row][col].marked = true;
      }
    }
  }

  return updatedCard;
}

/**
 * Reset all marks on a card (except FREE space)
 */
export function resetCard(card: BingoCard): BingoCard {
  const resetCard = JSON.parse(JSON.stringify(card)); // Deep clone

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (resetCard.cells[row][col].value !== 'FREE') {
        resetCard.cells[row][col].marked = false;
      }
    }
  }

  return resetCard;
}
