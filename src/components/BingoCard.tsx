/**
 * BingoCard Component
 * Displays a 5x5 Bingo card with interactive cells
 */

import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BingoCard as BingoCardType, BingoCell } from "../logic/bingoGenerator";

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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: 4,
    justifyContent: "center",
  },
  headerCell: {
    width: CELL_SIZE,
    height: CELL_SIZE * 0.7,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e40af",
    marginHorizontal: 2,
    borderRadius: 6,
  },
  headerText: {
    color: "#fff",
    fontSize: Math.max(CELL_SIZE * 0.35, 18),
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
    justifyContent: "center",
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginHorizontal: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#d0d0d0",
  },
  cellMarked: {
    backgroundColor: "#10b981",
    borderColor: "#059669",
  },
  cellHighlighted: {
    backgroundColor: "#fef3c7",
    borderColor: "#f59e0b",
    borderWidth: 3,
  },
  cellFree: {
    backgroundColor: "#3b82f6",
    borderColor: "#2563eb",
  },
  cellText: {
    fontSize: Math.max(CELL_SIZE * 0.28, 14),
    fontWeight: "600",
    color: "#1f2937",
  },
  cellTextMarked: {
    color: "#fff",
    fontWeight: "bold",
  },
  cellTextFree: {
    color: "#fff",
    fontSize: Math.max(CELL_SIZE * 0.22, 11),
    fontWeight: "bold",
  },
});
