/**
 * Pattern Selection Screen
 * Select which winning patterns to track in the game session
 */

import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  WinningPattern,
  getPatternPositions,
} from "../services/patternService";
import { getAllPatterns } from "../services/storageService";

interface PatternSelectionProps {
  onSelectionComplete: (selectedPatternIds: string[]) => void;
  preSelectedIds?: string[];
}

export default function PatternSelection({
  onSelectionComplete,
  preSelectedIds = [],
}: PatternSelectionProps) {
  const [patterns, setPatterns] = useState<WinningPattern[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(preSelectedIds)
  );
  const [selectionMode, setSelectionMode] = useState<"single" | "multi">(
    preSelectedIds.length <= 1 ? "single" : "multi"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatterns();
  }, []);

  const loadPatterns = async () => {
    try {
      const loadedPatterns = await getAllPatterns();
      setPatterns(loadedPatterns);
    } catch (error) {
      Alert.alert("Error", "Failed to load patterns");
    } finally {
      setLoading(false);
    }
  };

  const togglePattern = (patternId: string) => {
    const newSelected = new Set(selectedIds);

    if (selectionMode === "single") {
      // Single mode: only one pattern at a time
      newSelected.clear();
      if (!selectedIds.has(patternId)) {
        newSelected.add(patternId);
      }
    } else {
      // Multi mode: toggle on/off
      if (newSelected.has(patternId)) {
        newSelected.delete(patternId);
      } else {
        newSelected.add(patternId);
      }
    }

    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectionMode === "single") {
      Alert.alert(
        "Single Pattern Mode",
        "Switch to Multi-Pattern mode to select multiple patterns"
      );
      return;
    }

    if (selectedIds.size === patterns.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(patterns.map((p) => p.id)));
    }
  };

  const toggleMode = () => {
    const newMode = selectionMode === "single" ? "multi" : "single";
    setSelectionMode(newMode);

    // If switching to single mode and multiple are selected, keep only the first
    if (newMode === "single" && selectedIds.size > 1) {
      const firstId = Array.from(selectedIds)[0];
      setSelectedIds(new Set([firstId]));
    }
  };

  const handleContinue = () => {
    if (selectedIds.size === 0) {
      Alert.alert(
        "No Patterns Selected",
        "Please select at least one pattern to track"
      );
      return;
    }
    onSelectionComplete(Array.from(selectedIds));
  };

  const renderPatternGrid = (pattern: WinningPattern) => {
    return (
      <View style={styles.patternGrid}>
        {pattern.grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.patternRow}>
            {row.map((cell, colIndex) => (
              <View
                key={`${rowIndex}-${colIndex}`}
                style={[styles.patternCell, cell && styles.patternCellActive]}
              >
                {rowIndex === 2 && colIndex === 2 && (
                  <Text style={styles.patternCellText}>F</Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading patterns...</Text>
      </View>
    );
  }

  if (patterns.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Patterns Available</Text>
        <Text style={styles.emptyText}>
          Create some patterns first from the Patterns tab
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Select Winning Patterns</Text>
          <Text style={styles.subtitle}>
            {selectedIds.size} of {patterns.length} selected •{" "}
            {selectionMode === "single" ? "Single" : "Multi"} Mode
          </Text>
        </View>
      </View>

      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            selectionMode === "single" && styles.modeButtonActive,
          ]}
          onPress={() => {
            if (selectionMode !== "single") toggleMode();
          }}
        >
          <Text
            style={[
              styles.modeButtonText,
              selectionMode === "single" && styles.modeButtonTextActive,
            ]}
          >
            🎯 Single Pattern
          </Text>
          <Text style={styles.modeButtonSubtext}>One way to win</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeButton,
            selectionMode === "multi" && styles.modeButtonActive,
          ]}
          onPress={() => {
            if (selectionMode !== "multi") toggleMode();
          }}
        >
          <Text
            style={[
              styles.modeButtonText,
              selectionMode === "multi" && styles.modeButtonTextActive,
            ]}
          >
            🎲 Multi-Pattern
          </Text>
          <Text style={styles.modeButtonSubtext}>Multiple prizes</Text>
        </TouchableOpacity>
      </View>

      {selectionMode === "multi" && (
        <View style={styles.selectAllContainer}>
          <TouchableOpacity
            style={styles.selectAllButton}
            onPress={handleSelectAll}
          >
            <Text style={styles.selectAllText}>
              {selectedIds.size === patterns.length
                ? "Deselect All"
                : "Select All"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.scrollView}>
        {patterns.map((pattern) => {
          const isSelected = selectedIds.has(pattern.id);
          const positions = getPatternPositions(pattern);

          return (
            <TouchableOpacity
              key={pattern.id}
              style={[
                styles.patternContainer,
                isSelected && styles.patternSelected,
              ]}
              onPress={() => togglePattern(pattern.id)}
              activeOpacity={0.7}
            >
              <View style={styles.patternHeader}>
                <View style={styles.patternInfo}>
                  <Text style={styles.patternName}>{pattern.name}</Text>
                  <Text style={styles.patternDetails}>
                    {positions.length} squares required
                  </Text>
                </View>
                <View
                  style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected,
                  ]}
                >
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </View>

              {renderPatternGrid(pattern)}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedIds.size === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedIds.size === 0}
        >
          <Text style={styles.continueButtonText}>
            Start Game with {selectedIds.size} Pattern
            {selectedIds.size !== 1 ? "s" : ""}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9fafb",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  modeSelector: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modeButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    alignItems: "center",
  },
  modeButtonActive: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  modeButtonTextActive: {
    color: "#2563eb",
    fontWeight: "bold",
  },
  modeButtonSubtext: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 2,
  },
  selectAllContainer: {
    padding: 12,
    backgroundColor: "#fff",
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  selectAllButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  selectAllText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  patternContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 2,
    borderLeftWidth: 4,
    borderLeftColor: "transparent",
  },
  patternSelected: {
    borderLeftColor: "#10b981",
    backgroundColor: "#f0fdf4",
  },
  patternHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  patternInfo: {
    flex: 1,
  },
  patternName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  patternDetails: {
    fontSize: 13,
    color: "#6b7280",
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  checkmark: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  patternGrid: {
    alignSelf: "center",
    backgroundColor: "#f9fafb",
    padding: 6,
    borderRadius: 8,
  },
  patternRow: {
    flexDirection: "row",
  },
  patternCell: {
    width: 32,
    height: 32,
    backgroundColor: "#e5e7eb",
    margin: 2,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  patternCellActive: {
    backgroundColor: "#3b82f6",
  },
  patternCellText: {
    fontSize: 9,
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  continueButton: {
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  continueButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
