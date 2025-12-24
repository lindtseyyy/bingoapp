/**
 * Call History Modal
 * Organized B-I-N-G-O columnar view with undo functionality
 */

import { useTheme } from "@/contexts/ThemeContext";
import React, { useMemo } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { createStyles } from "./styles/CallHistoryModal.styles";

interface CallHistoryModalProps {
  visible: boolean;
  calledNumbers: number[];
  onClose: () => void;
  onRemoveNumber: (number: number) => void;
  onClearAll: () => void;
}

export default function CallHistoryModal({
  visible,
  calledNumbers = [],
  onClose,
  onRemoveNumber,
  onClearAll,
}: CallHistoryModalProps) {
  const { colorScheme } = useTheme();
  const styles = useMemo(() => createStyles(colorScheme), [colorScheme]);

  const getNumberColumn = (num: number): "B" | "I" | "N" | "G" | "O" | null => {
    if (num >= 1 && num <= 15) return "B";
    if (num >= 16 && num <= 30) return "I";
    if (num >= 31 && num <= 45) return "N";
    if (num >= 46 && num <= 60) return "G";
    if (num >= 61 && num <= 75) return "O";
    return null;
  };

  // Organize numbers by column
  const organizeByColumns = () => {
    const columns: Record<string, number[]> = {
      B: [],
      I: [],
      N: [],
      G: [],
      O: [],
    };

    calledNumbers.forEach((num) => {
      const col = getNumberColumn(num);
      if (col) {
        columns[col].push(num);
      }
    });

    // Sort each column
    Object.keys(columns).forEach((key) => {
      columns[key].sort((a, b) => a - b);
    });

    return columns;
  };

  const columns = organizeByColumns();
  const columnColors: Record<string, string> = {
    B: "#ef4444",
    I: "#f59e0b",
    N: "#10b981",
    G: "#3b82f6",
    O: "#8b5cf6",
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <View>
            <Text style={styles.modalTitle}>Call History</Text>
            <Text style={styles.modalSubtitle}>
              {calledNumbers.length} number
              {calledNumbers.length !== 1 ? "s" : ""} called
            </Text>
          </View>
          <View style={styles.headerButtons}>
            {calledNumbers.length > 0 && (
              <TouchableOpacity
                style={styles.clearAllButton}
                onPress={onClearAll}
              >
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>

        {calledNumbers.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📋</Text>
            <Text style={styles.emptyStateText}>No numbers called yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start calling numbers to see history
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.content}>
            {/* Latest Call Banner */}
            {calledNumbers.length > 0 && (
              <View style={styles.latestCallBanner}>
                <Text style={styles.latestCallLabel}>LATEST CALL</Text>
                <Text style={styles.latestCallNumber}>
                  {getNumberColumn(calledNumbers[calledNumbers.length - 1])}
                  {calledNumbers[calledNumbers.length - 1]}
                </Text>
              </View>
            )}

            {/* B-I-N-G-O Columns */}
            <View style={styles.columnsContainer}>
              {Object.entries(columns).map(([column, numbers]) => (
                <View key={column} style={styles.column}>
                  <View
                    style={[
                      styles.columnHeader,
                      { backgroundColor: columnColors[column] },
                    ]}
                  >
                    <Text style={styles.columnHeaderText}>{column}</Text>
                    <Text style={styles.columnHeaderCount}>
                      {numbers.length}
                    </Text>
                  </View>
                  <View style={styles.columnContent}>
                    {numbers.length === 0 ? (
                      <Text style={styles.columnEmpty}>—</Text>
                    ) : (
                      numbers.map((num) => (
                        <TouchableOpacity
                          key={num}
                          style={styles.numberChip}
                          onPress={() => onRemoveNumber(num)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.numberChipText}>{num}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                </View>
              ))}
            </View>

            {/* Instruction */}
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>
                💡 Tap any number to remove it from history
              </Text>
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}
