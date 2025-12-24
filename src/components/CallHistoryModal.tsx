/**
 * Call History Modal
 * Organized B-I-N-G-O columnar view with undo functionality
 */

import { useTheme } from "@/contexts/ThemeContext";
import React, { useMemo } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

const createStyles = (colorScheme: "light" | "dark") => {
  const isDark = colorScheme === "dark";

  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: isDark ? "#111827" : "#f9fafb",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: isDark ? "#1f2937" : "#fff",
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#374151" : "#e5e7eb",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.5 : 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: isDark ? "#f3f4f6" : "#1f2937",
    },
    modalSubtitle: {
      fontSize: 13,
      color: isDark ? "#9ca3af" : "#6b7280",
      marginTop: 2,
    },
    headerButtons: {
      flexDirection: "row",
      gap: 8,
    },
    clearAllButton: {
      backgroundColor: isDark ? "#7f1d1d" : "#fee2e2",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 6,
    },
    clearAllText: {
      color: isDark ? "#fca5a5" : "#dc2626",
      fontSize: 14,
      fontWeight: "600",
    },
    closeButton: {
      backgroundColor: "#3b82f6",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
    },
    closeButtonText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
    },
    emptyStateIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyStateText: {
      fontSize: 18,
      fontWeight: "600",
      color: isDark ? "#9ca3af" : "#6b7280",
      marginBottom: 8,
    },
    emptyStateSubtext: {
      fontSize: 14,
      color: "#9ca3af",
      textAlign: "center",
    },
    content: {
      flex: 1,
    },
    latestCallBanner: {
      backgroundColor: isDark ? "#78350f" : "#fef3c7",
      padding: 20,
      margin: 16,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#fbbf24",
      shadowColor: "#f59e0b",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    latestCallLabel: {
      fontSize: 12,
      fontWeight: "bold",
      color: isDark ? "#fbbf24" : "#92400e",
      letterSpacing: 1,
      marginBottom: 8,
    },
    latestCallNumber: {
      fontSize: 48,
      fontWeight: "bold",
      color: isDark ? "#fcd34d" : "#92400e",
    },
    columnsContainer: {
      flexDirection: "row",
      padding: 12,
      gap: 8,
    },
    column: {
      flex: 1,
      backgroundColor: isDark ? "#1f2937" : "#fff",
      borderRadius: 12,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.5 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    columnHeader: {
      padding: 12,
      alignItems: "center",
    },
    columnHeaderText: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
    },
    columnHeaderCount: {
      fontSize: 12,
      fontWeight: "600",
      color: "#fff",
      marginTop: 4,
      opacity: 0.9,
    },
    columnContent: {
      padding: 8,
      minHeight: 100,
    },
    columnEmpty: {
      fontSize: 24,
      color: isDark ? "#4b5563" : "#d1d5db",
      textAlign: "center",
      paddingVertical: 20,
    },
    numberChip: {
      backgroundColor: isDark ? "#374151" : "#f3f4f6",
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginBottom: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: isDark ? "#4b5563" : "#e5e7eb",
    },
    numberChipText: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? "#f3f4f6" : "#1f2937",
    },
    numberChipRemove: {
      fontSize: 16,
      color: "#ef4444",
      fontWeight: "bold",
    },
    instructionContainer: {
      margin: 16,
      padding: 12,
      backgroundColor: isDark ? "#1e3a8a" : "#eff6ff",
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: "#3b82f6",
    },
    instructionText: {
      fontSize: 13,
      color: isDark ? "#93c5fd" : "#1e40af",
      textAlign: "center",
    },
  });
};
