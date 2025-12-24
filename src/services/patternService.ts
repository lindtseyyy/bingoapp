/**
 * Pattern Service
 * Manages winning pattern definitions and validation
 */

import { BingoCard } from '../logic/bingoGenerator';

export interface WinningPattern {
  id: string;
  name: string;
  grid: boolean[][]; // 5x5 grid where true = required square
  createdAt: number;
}

/**
 * Check if a card matches a winning pattern
 * Special handling for Dikit and Patong patterns
 */
export function checkPattern(card: BingoCard, pattern: WinningPattern): boolean {
  // Special handling for Dikit pattern (any two horizontal adjacent cells)
  if (pattern.name === 'Dikit') {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 4; col++) {
        const leftCell = card.cells[row][col];
        const rightCell = card.cells[row][col + 1];
        
        // Skip pairs that include FREE space
        if (leftCell.value === 'FREE' || rightCell.value === 'FREE') {
          continue;
        }
        
        // Check if both cells are marked
        if (leftCell.marked && rightCell.marked) {
          return true;
        }
      }
    }
    return false;
  }
  
  // Special handling for Patong pattern (any two vertical adjacent cells)
  if (pattern.name === 'Patong') {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 5; col++) {
        const topCell = card.cells[row][col];
        const bottomCell = card.cells[row + 1][col];
        
        // Skip pairs that include FREE space
        if (topCell.value === 'FREE' || bottomCell.value === 'FREE') {
          continue;
        }
        
        // Check if both cells are marked
        if (topCell.marked && bottomCell.marked) {
          return true;
        }
      }
    }
    return false;
  }
  
  // Special handling for Horizontal Line pattern (any complete row)
  if (pattern.name === 'Horizontal Line') {
    // Check each row - all cells must be marked (including FREE)
    for (let row = 0; row < 5; row++) {
      let rowComplete = true;
      for (let col = 0; col < 5; col++) {
        if (!card.cells[row][col].marked) {
          rowComplete = false;
          break;
        }
      }
      if (rowComplete) {
        return true;
      }
    }
    return false;
  }
  
  // Special handling for Vertical Line pattern (any complete column)
  if (pattern.name === 'Vertical Line') {
    // Check each column - all cells must be marked (including FREE)
    for (let col = 0; col < 5; col++) {
      let colComplete = true;
      for (let row = 0; row < 5; row++) {
        if (!card.cells[row][col].marked) {
          colComplete = false;
          break;
        }
      }
      if (colComplete) {
        return true;
      }
    }
    return false;
  }
  
  // Special handling for Diagonal Line pattern (either main or anti-diagonal)
  if (pattern.name === 'Diagonal Line') {
    // Check main diagonal (top-left to bottom-right)
    let mainDiagonalComplete = true;
    for (let i = 0; i < 5; i++) {
      if (!card.cells[i][i].marked) {
        mainDiagonalComplete = false;
        break;
      }
    }
    if (mainDiagonalComplete) {
      return true;
    }
    
    // Check anti-diagonal (top-right to bottom-left)
    let antiDiagonalComplete = true;
    for (let i = 0; i < 5; i++) {
      if (!card.cells[i][4 - i].marked) {
        antiDiagonalComplete = false;
        break;
      }
    }
    if (antiDiagonalComplete) {
      return true;
    }
    
    return false;
  }
  
  // Standard pattern checking for other patterns
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (pattern.grid[row][col] && !card.cells[row][col].marked) {
        return false; // Required square not marked
      }
    }
  }
  return true;
}

/**
 * Get missing numbers for a pattern
 * Returns the numbers needed to complete the pattern
 * Special handling for Dikit and Patong patterns
 */
export function getMissingNumbers(card: BingoCard, pattern: WinningPattern): number[] {
  const missing: number[] = [];
  
  // Special handling for Dikit pattern (any two horizontal adjacent cells)
  if (pattern.name === 'Dikit') {
    const missingSet = new Set<number>();
    let bestPairMarkedCount = 0;
    
    // Find all horizontal pairs and track the best ones
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 4; col++) {
        const leftCell = card.cells[row][col];
        const rightCell = card.cells[row][col + 1];
        
        // Skip pairs that include FREE space
        if (leftCell.value === 'FREE' || rightCell.value === 'FREE') {
          continue;
        }
        
        const isLeftMarked = leftCell.marked;
        const isRightMarked = rightCell.marked;
        
        const markedCount = (isLeftMarked ? 1 : 0) + (isRightMarked ? 1 : 0);
        
        // Only consider pairs with at least one marked cell
        if (markedCount > 0) {
          // If we found a better pair, reset and use only this pair
          if (markedCount > bestPairMarkedCount) {
            missingSet.clear();
            bestPairMarkedCount = markedCount;
          }
          
          // If this pair is as good as the best, add its missing numbers
          if (markedCount === bestPairMarkedCount) {
            if (!isLeftMarked) {
              missingSet.add(leftCell.value as number);
            }
            if (!isRightMarked) {
              missingSet.add(rightCell.value as number);
            }
          }
        }
      }
    }
    
    return Array.from(missingSet);
  }
  
  // Special handling for Patong pattern (any two vertical adjacent cells)
  if (pattern.name === 'Patong') {
    const missingSet = new Set<number>();
    let bestPairMarkedCount = 0;
    
    // Find all vertical pairs and track the best ones
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 5; col++) {
        const topCell = card.cells[row][col];
        const bottomCell = card.cells[row + 1][col];
        
        // Skip pairs that include FREE space
        if (topCell.value === 'FREE' || bottomCell.value === 'FREE') {
          continue;
        }
        
        const isTopMarked = topCell.marked;
        const isBottomMarked = bottomCell.marked;
        
        const markedCount = (isTopMarked ? 1 : 0) + (isBottomMarked ? 1 : 0);
        
        // Only consider pairs with at least one marked cell
        if (markedCount > 0) {
          // If we found a better pair, reset and use only this pair
          if (markedCount > bestPairMarkedCount) {
            missingSet.clear();
            bestPairMarkedCount = markedCount;
          }
          
          // If this pair is as good as the best, add its missing numbers
          if (markedCount === bestPairMarkedCount) {
            if (!isTopMarked) {
              missingSet.add(topCell.value as number);
            }
            if (!isBottomMarked) {
              missingSet.add(bottomCell.value as number);
            }
          }
        }
      }
    }
    
    return Array.from(missingSet);
  }
  
  // Special handling for Horizontal Line pattern (any complete row)
  if (pattern.name === 'Horizontal Line') {
    const missingSet = new Set<number>();
    let bestRowMarkedCount = 0;
    
    // Find all rows and track the best ones
    for (let row = 0; row < 5; row++) {
      let markedCount = 0;
      const rowMissing: number[] = [];
      
      for (let col = 0; col < 5; col++) {
        const cell = card.cells[row][col];
        if (cell.marked) {
          markedCount++;
        } else if (cell.value !== 'FREE') {
          rowMissing.push(cell.value as number);
        }
      }
      
      // Only consider rows with at least one marked cell
      if (markedCount > 0) {
        // If we found a better row, reset and use only this row
        if (markedCount > bestRowMarkedCount) {
          missingSet.clear();
          bestRowMarkedCount = markedCount;
        }
        
        // If this row is as good as the best, add its missing numbers
        if (markedCount === bestRowMarkedCount) {
          rowMissing.forEach(num => missingSet.add(num));
        }
      }
    }
    
    return Array.from(missingSet);
  }
  
  // Special handling for Vertical Line pattern (any complete column)
  if (pattern.name === 'Vertical Line') {
    const missingSet = new Set<number>();
    let bestColMarkedCount = 0;
    
    // Find all columns and track the best ones
    for (let col = 0; col < 5; col++) {
      let markedCount = 0;
      const colMissing: number[] = [];
      
      for (let row = 0; row < 5; row++) {
        const cell = card.cells[row][col];
        if (cell.marked) {
          markedCount++;
        } else if (cell.value !== 'FREE') {
          colMissing.push(cell.value as number);
        }
      }
      
      // Only consider columns with at least one marked cell
      if (markedCount > 0) {
        // If we found a better column, reset and use only this column
        if (markedCount > bestColMarkedCount) {
          missingSet.clear();
          bestColMarkedCount = markedCount;
        }
        
        // If this column is as good as the best, add its missing numbers
        if (markedCount === bestColMarkedCount) {
          colMissing.forEach(num => missingSet.add(num));
        }
      }
    }
    
    return Array.from(missingSet);
  }
  
  // Special handling for Diagonal Line pattern (either main or anti-diagonal)
  if (pattern.name === 'Diagonal Line') {
    const missingSet = new Set<number>();
    let bestDiagonalMarkedCount = 0;
    
    // Check main diagonal (top-left to bottom-right)
    let mainMarkedCount = 0;
    const mainMissing: number[] = [];
    for (let i = 0; i < 5; i++) {
      const cell = card.cells[i][i];
      if (cell.marked) {
        mainMarkedCount++;
      } else if (cell.value !== 'FREE') {
        mainMissing.push(cell.value as number);
      }
    }
    
    // Check anti-diagonal (top-right to bottom-left)
    let antiMarkedCount = 0;
    const antiMissing: number[] = [];
    for (let i = 0; i < 5; i++) {
      const cell = card.cells[i][4 - i];
      if (cell.marked) {
        antiMarkedCount++;
      } else if (cell.value !== 'FREE') {
        antiMissing.push(cell.value as number);
      }
    }
    
    // Find the best diagonal(s)
    bestDiagonalMarkedCount = Math.max(mainMarkedCount, antiMarkedCount);
    
    // Only consider diagonals with at least one marked cell
    if (bestDiagonalMarkedCount > 0) {
      if (mainMarkedCount === bestDiagonalMarkedCount) {
        mainMissing.forEach(num => missingSet.add(num));
      }
      if (antiMarkedCount === bestDiagonalMarkedCount) {
        antiMissing.forEach(num => missingSet.add(num));
      }
    }
    
    return Array.from(missingSet);
  }

  // Standard missing number calculation for other patterns
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (pattern.grid[row][col] && !card.cells[row][col].marked) {
        const value = card.cells[row][col].value;
        if (value !== 'FREE') {
          missing.push(value as number);
        }
      }
    }
  }

  return missing;
}

/**
 * Check if player is "on pot" (one number away from winning)
 */
export function isOnPot(card: BingoCard, pattern: WinningPattern): boolean {
  const missing = getMissingNumbers(card, pattern);
  return missing.length === 1;
}

/**
 * Get all individual winning paths for a pattern
 * Returns an array where each element is the missing numbers for one way to win
 */
export function getWinningPaths(card: BingoCard, pattern: WinningPattern): number[][] {
  // Special handling for Dikit pattern (any two horizontal adjacent cells)
  if (pattern.name === 'Dikit') {
    const paths: number[][] = [];
    let bestPairMarkedCount = 0;
    
    // Find all horizontal pairs
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 4; col++) {
        const leftCell = card.cells[row][col];
        const rightCell = card.cells[row][col + 1];
        
        // Skip pairs that include FREE space
        if (leftCell.value === 'FREE' || rightCell.value === 'FREE') {
          continue;
        }
        
        const isLeftMarked = leftCell.marked;
        const isRightMarked = rightCell.marked;
        const markedCount = (isLeftMarked ? 1 : 0) + (isRightMarked ? 1 : 0);
        
        // Only consider pairs with at least one marked cell
        if (markedCount > 0) {
          // If we found a better pair, reset
          if (markedCount > bestPairMarkedCount) {
            paths.length = 0;
            bestPairMarkedCount = markedCount;
          }
          
          // If this pair is as good as the best, add it as a path
          if (markedCount === bestPairMarkedCount) {
            const pathMissing: number[] = [];
            if (!isLeftMarked) {
              pathMissing.push(leftCell.value as number);
            }
            if (!isRightMarked) {
              pathMissing.push(rightCell.value as number);
            }
            if (pathMissing.length > 0) {
              paths.push(pathMissing);
            }
          }
        }
      }
    }
    
    return paths;
  }
  
  // Special handling for Patong pattern (any two vertical adjacent cells)
  if (pattern.name === 'Patong') {
    const paths: number[][] = [];
    let bestPairMarkedCount = 0;
    
    // Find all vertical pairs
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 5; col++) {
        const topCell = card.cells[row][col];
        const bottomCell = card.cells[row + 1][col];
        
        // Skip pairs that include FREE space
        if (topCell.value === 'FREE' || bottomCell.value === 'FREE') {
          continue;
        }
        
        const isTopMarked = topCell.marked;
        const isBottomMarked = bottomCell.marked;
        const markedCount = (isTopMarked ? 1 : 0) + (isBottomMarked ? 1 : 0);
        
        // Only consider pairs with at least one marked cell
        if (markedCount > 0) {
          // If we found a better pair, reset
          if (markedCount > bestPairMarkedCount) {
            paths.length = 0;
            bestPairMarkedCount = markedCount;
          }
          
          // If this pair is as good as the best, add it as a path
          if (markedCount === bestPairMarkedCount) {
            const pathMissing: number[] = [];
            if (!isTopMarked) {
              pathMissing.push(topCell.value as number);
            }
            if (!isBottomMarked) {
              pathMissing.push(bottomCell.value as number);
            }
            if (pathMissing.length > 0) {
              paths.push(pathMissing);
            }
          }
        }
      }
    }
    
    return paths;
  }
  
  // Special handling for Horizontal Line pattern (any complete row)
  if (pattern.name === 'Horizontal Line') {
    const paths: number[][] = [];
    let bestRowMarkedCount = 0;
    
    // Find all rows
    for (let row = 0; row < 5; row++) {
      let markedCount = 0;
      const rowMissing: number[] = [];
      
      for (let col = 0; col < 5; col++) {
        const cell = card.cells[row][col];
        if (cell.marked) {
          markedCount++;
        } else if (cell.value !== 'FREE') {
          rowMissing.push(cell.value as number);
        }
      }
      
      // Only consider rows with at least one marked cell
      if (markedCount > 0) {
        // If we found a better row, reset
        if (markedCount > bestRowMarkedCount) {
          paths.length = 0;
          bestRowMarkedCount = markedCount;
        }
        
        // If this row is as good as the best, add it as a path
        if (markedCount === bestRowMarkedCount && rowMissing.length > 0) {
          paths.push(rowMissing);
        }
      }
    }
    
    return paths;
  }
  
  // Special handling for Vertical Line pattern (any complete column)
  if (pattern.name === 'Vertical Line') {
    const paths: number[][] = [];
    let bestColMarkedCount = 0;
    
    // Find all columns
    for (let col = 0; col < 5; col++) {
      let markedCount = 0;
      const colMissing: number[] = [];
      
      for (let row = 0; row < 5; row++) {
        const cell = card.cells[row][col];
        if (cell.marked) {
          markedCount++;
        } else if (cell.value !== 'FREE') {
          colMissing.push(cell.value as number);
        }
      }
      
      // Only consider columns with at least one marked cell
      if (markedCount > 0) {
        // If we found a better column, reset
        if (markedCount > bestColMarkedCount) {
          paths.length = 0;
          bestColMarkedCount = markedCount;
        }
        
        // If this column is as good as the best, add it as a path
        if (markedCount === bestColMarkedCount && colMissing.length > 0) {
          paths.push(colMissing);
        }
      }
    }
    
    return paths;
  }
  
  // Special handling for Diagonal Line pattern (either main or anti-diagonal)
  if (pattern.name === 'Diagonal Line') {
    const paths: number[][] = [];
    let bestDiagonalMarkedCount = 0;
    
    // Check main diagonal (top-left to bottom-right)
    let mainMarkedCount = 0;
    const mainMissing: number[] = [];
    for (let i = 0; i < 5; i++) {
      const cell = card.cells[i][i];
      if (cell.marked) {
        mainMarkedCount++;
      } else if (cell.value !== 'FREE') {
        mainMissing.push(cell.value as number);
      }
    }
    
    // Check anti-diagonal (top-right to bottom-left)
    let antiMarkedCount = 0;
    const antiMissing: number[] = [];
    for (let i = 0; i < 5; i++) {
      const cell = card.cells[i][4 - i];
      if (cell.marked) {
        antiMarkedCount++;
      } else if (cell.value !== 'FREE') {
        antiMissing.push(cell.value as number);
      }
    }
    
    // Find the best diagonal(s)
    bestDiagonalMarkedCount = Math.max(mainMarkedCount, antiMarkedCount);
    
    // Only consider diagonals with at least one marked cell
    if (bestDiagonalMarkedCount > 0) {
      if (mainMarkedCount === bestDiagonalMarkedCount && mainMissing.length > 0) {
        paths.push(mainMissing);
      }
      if (antiMarkedCount === bestDiagonalMarkedCount && antiMissing.length > 0) {
        paths.push(antiMissing);
      }
    }
    
    return paths;
  }

  // Standard patterns: only one way to win (all required squares)
  const missing: number[] = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (pattern.grid[row][col] && !card.cells[row][col].marked) {
        const value = card.cells[row][col].value;
        if (value !== 'FREE') {
          missing.push(value as number);
        }
      }
    }
  }
  
  return missing.length > 0 ? [missing] : [];
}

/**
 * Get the position of required squares in a pattern
 */
export function getPatternPositions(pattern: WinningPattern): Array<{ row: number; col: number }> {
  const positions: Array<{ row: number; col: number }> = [];

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (pattern.grid[row][col]) {
        positions.push({ row, col });
      }
    }
  }

  return positions;
}

/**
 * Create an empty 5x5 pattern grid
 */
export function createEmptyPattern(): boolean[][] {
  return Array(5).fill(null).map(() => Array(5).fill(false));
}

/**
 * Create a new pattern
 */
export function createPattern(name: string, grid: boolean[][]): WinningPattern {
  return {
    id: `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    grid,
    createdAt: Date.now(),
  };
}

// ==================== PREDEFINED PATTERNS ====================

/**
 * Traditional Line Patterns
 */
export function createLinePattern(type: 'horizontal' | 'vertical' | 'diagonal'): boolean[][] {
  const grid = createEmptyPattern();

  switch (type) {
    case 'horizontal':
      // Top row
      for (let col = 0; col < 5; col++) {
        grid[0][col] = true;
      }
      break;

    case 'vertical':
      // First column
      for (let row = 0; row < 5; row++) {
        grid[row][0] = true;
      }
      break;

    case 'diagonal':
      // Top-left to bottom-right
      for (let i = 0; i < 5; i++) {
        grid[i][i] = true;
      }
      break;
  }

  return grid;
}

/**
 * Four Corners pattern
 */
export function createFourCornersPattern(): boolean[][] {
  const grid = createEmptyPattern();
  grid[0][0] = true;
  grid[0][4] = true;
  grid[4][0] = true;
  grid[4][4] = true;
  return grid;
}

/**
 * Postage Stamp pattern (2x2 in any corner)
 */
export function createPostageStampPattern(corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'): boolean[][] {
  const grid = createEmptyPattern();

  switch (corner) {
    case 'top-left':
      grid[0][0] = true;
      grid[0][1] = true;
      grid[1][0] = true;
      grid[1][1] = true;
      break;

    case 'top-right':
      grid[0][3] = true;
      grid[0][4] = true;
      grid[1][3] = true;
      grid[1][4] = true;
      break;

    case 'bottom-left':
      grid[3][0] = true;
      grid[3][1] = true;
      grid[4][0] = true;
      grid[4][1] = true;
      break;

    case 'bottom-right':
      grid[3][3] = true;
      grid[3][4] = true;
      grid[4][3] = true;
      grid[4][4] = true;
      break;
  }

  return grid;
}

/**
 * X-Shape pattern
 */
export function createXPattern(): boolean[][] {
  const grid = createEmptyPattern();

  // Diagonal from top-left to bottom-right
  for (let i = 0; i < 5; i++) {
    grid[i][i] = true;
  }

  // Diagonal from top-right to bottom-left
  for (let i = 0; i < 5; i++) {
    grid[i][4 - i] = true;
  }

  return grid;
}

/**
 * Plus Sign pattern
 */
export function createPlusPattern(): boolean[][] {
  const grid = createEmptyPattern();

  // Middle row
  for (let col = 0; col < 5; col++) {
    grid[2][col] = true;
  }

  // Middle column
  for (let row = 0; row < 5; row++) {
    grid[row][2] = true;
  }

  return grid;
}

/**
 * Full House (Blackout) pattern
 */
export function createFullHousePattern(): boolean[][] {
  return Array(5).fill(null).map(() => Array(5).fill(true));
}

/**
 * Horizontal Line pattern (any complete row from left to right)
 * Can cross the FREE space
 */
export function createHorizontalLinePattern(): boolean[][] {
  const grid = createEmptyPattern();
  // Show the first row as example
  for (let col = 0; col < 5; col++) {
    grid[0][col] = true;
  }
  return grid;
}

/**
 * Vertical Line pattern (any complete column from top to bottom)
 * Can cross the FREE space
 */
export function createVerticalLinePattern(): boolean[][] {
  const grid = createEmptyPattern();
  // Show the first column as example
  for (let row = 0; row < 5; row++) {
    grid[row][0] = true;
  }
  return grid;
}

/**
 * Diagonal Line pattern (either main or anti-diagonal)
 * Can cross the FREE space
 */
export function createDiagonalLinePattern(): boolean[][] {
  const grid = createEmptyPattern();
  // Show the main diagonal as example (top-left to bottom-right)
  for (let i = 0; i < 5; i++) {
    grid[i][i] = true;
  }
  return grid;
}

/**
 * Dikit pattern (two numbers beside each other - horizontal)
 * Returns the first possible instance (top-left)
 */
export function createDikitPattern(): boolean[][] {
  const grid = createEmptyPattern();
  grid[0][0] = true; // Two adjacent horizontal cells
  grid[0][1] = true;
  return grid;
}

/**
 * Patong pattern (two numbers placed above each other - vertical)
 * Returns the first possible instance (top-left)
 */
export function createPatongPattern(): boolean[][] {
  const grid = createEmptyPattern();
  grid[0][0] = true; // Two adjacent vertical cells
  grid[1][0] = true;
  return grid;
}

/**
 * Get all predefined patterns
 */
export function getPredefinedPatterns(): WinningPattern[] {
  return [
    createPattern('Dikit', createDikitPattern()),
    createPattern('Patong', createPatongPattern()),
    createPattern('Horizontal Line', createHorizontalLinePattern()),
    createPattern('Vertical Line', createVerticalLinePattern()),
    createPattern('Diagonal Line', createDiagonalLinePattern()),
    createPattern('Four Corners', createFourCornersPattern()),
    createPattern('Horizontal Line (Top)', createLinePattern('horizontal')),
    createPattern('Vertical Line (Left)', createLinePattern('vertical')),
    createPattern('Diagonal (\\)', createLinePattern('diagonal')),
    createPattern('X-Shape', createXPattern()),
    createPattern('Plus Sign', createPlusPattern()),
    createPattern('Postage Stamp (Top-Left)', createPostageStampPattern('top-left')),
    createPattern('Full House', createFullHousePattern()),
  ];
}

/**
 * Validate pattern grid
 */
export function validatePattern(grid: boolean[][]): boolean {
  if (grid.length !== 5) return false;

  for (let row = 0; row < 5; row++) {
    if (grid[row].length !== 5) return false;
  }

  // Check if at least one square is selected
  let hasSelection = false;
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (grid[row][col]) {
        hasSelection = true;
        break;
      }
    }
    if (hasSelection) break;
  }

  return hasSelection;
}

/**
 * Check if a pattern is a built-in pattern that cannot be edited or deleted
 */
export function isBuiltInPattern(patternName: string): boolean {
  const builtInNames = ['Dikit', 'Patong', 'Horizontal Line', 'Vertical Line', 'Diagonal Line', 'Full House'];
  return builtInNames.includes(patternName);
}
