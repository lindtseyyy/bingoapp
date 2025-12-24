/**
 * BingoCard Component
 * Displays a 5x5 Bingo card with interactive cells
 */

import { useTheme } from "@/contexts/ThemeContext";
import React, { useMemo } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { BingoCard as BingoCardType, BingoCell } from "../logic/bingoGenerator";
import { createStyles } from "./styles/BingoCard.styles";

interface BingoCardProps {
  card: BingoCardType;
  onCellPress?: (row: number, col: number) => void;
  highlightPattern?: boolean[][];
  showMarked?: boolean;
  editable?: boolean;
}

const COLUMNS = ["B", "I", "N", "G", "O"];

// Calculate responsive cell size
function getResponsiveCellSize(): number {
  const { width } = Dimensions.get("window");
  const HORIZONTAL_MARGINS = 64; // Left + Right screen margins
  const CARD_PADDING = 16; // Container internal padding
  const CELL_SPACING = 8; // Total spacing between cells (2px * 4 gaps)

  // Calculate available width and divide by 5 columns
  const availableWidth =
    width - HORIZONTAL_MARGINS - CARD_PADDING - CELL_SPACING;
  const calculatedSize = availableWidth / 5;

  // Ensure proper fit on screen
  return Math.max(calculatedSize, 50);
}

const CELL_SIZE = getResponsiveCellSize();

export default function BingoCard({
  card,
  onCellPress,
  highlightPattern,
  showMarked = true,
  editable = false,
}: BingoCardProps) {
  const { colorScheme } = useTheme();

  // Dynamic styles based on theme
  const styles = useMemo(
    () => createStyles(colorScheme, CELL_SIZE),
    [colorScheme]
  );
  const renderCell = (cell: BingoCell, row: number, col: number) => {
    const isHighlighted = highlightPattern?.[row]?.[col] ?? false;
    const isMarked = showMarked && cell.marked;
    const isFree = cell.value === "FREE";

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={[
          styles.cell,
          isMarked && styles.cellMarked,
          isHighlighted && styles.cellHighlighted,
          isFree && styles.cellFree,
        ]}
        onPress={() => editable && onCellPress?.(row, col)}
        disabled={!editable}
      >
        <Text
          style={[
            styles.cellText,
            isMarked && styles.cellTextMarked,
            isFree && styles.cellTextFree,
          ]}
        >
          {cell.value}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        {COLUMNS.map((letter) => (
          <View key={letter} style={styles.headerCell}>
            <Text style={styles.headerText}>{letter}</Text>
          </View>
        ))}
      </View>

      {/* Card Grid */}
      {card.cells.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
        </View>
      ))}
    </View>
  );
}
