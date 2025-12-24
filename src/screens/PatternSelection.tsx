/**
 * Pattern Selection Screen
 * Select which winning patterns to track in the game session
 */

import { useTheme } from "@/contexts/ThemeContext";
import React, { useMemo, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  WinningPattern,
  getPatternPositions,
} from "../services/patternService";
import { createStyles } from "./styles/PatternSelection.styles";

interface PatternSelectionProps {
  onSelectionComplete: (selectedPatternIds: string[]) => void;
  preSelectedIds?: string[];
  availablePatterns?: WinningPattern[];
}

export default function PatternSelection({
  onSelectionComplete,
  preSelectedIds = [],
  availablePatterns,
}: PatternSelectionProps) {
  const { colorScheme } = useTheme();
  const styles = useMemo(() => createStyles(colorScheme), [colorScheme]);

  const patterns = availablePatterns || [];
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(preSelectedIds.filter((id) => patterns.some((p) => p.id === id)))
  );
  const [selectionMode, setSelectionMode] = useState<"single" | "multi">(
    preSelectedIds.length <= 1 ? "single" : "multi"
  );

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

  if (patterns.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Patterns Available</Text>
        <Text style={styles.emptyText}>
          Create some patterns first from the Patterns tab
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}
