/**
 * PatternCreator Component
 * Interactive UI for creating custom winning patterns
 */

import { useTheme } from "@/contexts/ThemeContext";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  createEmptyPattern,
  createPattern,
  getPredefinedPatterns,
  validatePattern,
  WinningPattern,
} from "../services/patternService";
import { savePattern } from "../services/storageService";
import { createStyles } from "./styles/PatternCreator.styles";

interface PatternCreatorProps {
  onPatternCreated?: () => void;
  editingPattern?: WinningPattern | null;
}

export default function PatternCreator({
  onPatternCreated,
  editingPattern,
}: PatternCreatorProps) {
  const { colorScheme } = useTheme();
  const styles = useMemo(() => createStyles(colorScheme), [colorScheme]);

  const [patternName, setPatternName] = useState(editingPattern?.name || "");
  const [grid, setGrid] = useState<boolean[][]>(
    editingPattern?.grid || createEmptyPattern()
  );
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const toggleCell = (row: number, col: number) => {
    const newGrid = grid.map((r, i) =>
      i === row ? r.map((cell, j) => (j === col ? !cell : cell)) : r
    );
    setGrid(newGrid);
    setSelectedPreset(null); // Clear preset selection when manually editing
  };

  const clearPattern = () => {
    setGrid(createEmptyPattern());
    setSelectedPreset(null);
  };

  const loadPreset = (presetIndex: number) => {
    const presets = getPredefinedPatterns();
    const preset = presets[presetIndex];
    if (preset) {
      setGrid(preset.grid);
      setPatternName(preset.name);
      setSelectedPreset(preset.id);
    }
  };

  const handleSave = async () => {
    if (!patternName.trim()) {
      Alert.alert("Error", "Please enter a pattern name");
      return;
    }

    if (!validatePattern(grid)) {
      Alert.alert("Error", "Please select at least one square");
      return;
    }

    try {
      let pattern;
      if (editingPattern) {
        // Update existing pattern
        pattern = {
          ...editingPattern,
          name: patternName.trim(),
          grid: grid,
        };
      } else {
        // Create new pattern
        pattern = createPattern(patternName.trim(), grid);
      }
      await savePattern(pattern);
      Alert.alert(
        "Success",
        editingPattern
          ? "Pattern updated successfully!"
          : "Pattern saved successfully!"
      );

      // Reset form
      setPatternName("");
      setGrid(createEmptyPattern());
      setSelectedPreset(null);

      onPatternCreated?.();
    } catch (error) {
      Alert.alert("Error", "Failed to save pattern");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {editingPattern ? "Edit Winning Pattern" : "Create Winning Pattern"}
      </Text>

      {/* Pattern Name Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pattern Name:</Text>
        <TextInput
          style={styles.input}
          value={patternName}
          onChangeText={setPatternName}
          placeholder="e.g., My Custom Pattern"
          placeholderTextColor={colorScheme === "dark" ? "#9ca3af" : "#999"}
        />
      </View>

      {/* Grid Editor */}
      <View style={styles.gridContainer}>
        <Text style={styles.label}>Tap squares to toggle:</Text>
        <View style={styles.grid}>
          {grid.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.gridRow}>
              {row.map((cell, colIndex) => (
                <TouchableOpacity
                  key={`${rowIndex}-${colIndex}`}
                  style={[styles.gridCell, cell && styles.gridCellSelected]}
                  onPress={() => toggleCell(rowIndex, colIndex)}
                >
                  <Text
                    style={[
                      styles.gridCellText,
                      cell && styles.gridCellTextSelected,
                    ]}
                  >
                    {rowIndex === 2 && colIndex === 2 ? "F" : ""}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={clearPattern}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Pattern</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
