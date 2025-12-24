/**
 * PatternCreator Component
 * Interactive UI for creating custom winning patterns
 */

import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
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

interface PatternCreatorProps {
  onPatternCreated?: () => void;
  editingPattern?: WinningPattern | null;
}

export default function PatternCreator({
  onPatternCreated,
  editingPattern,
}: PatternCreatorProps) {
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
          placeholderTextColor="#999"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1f2937",
  },
  gridContainer: {
    marginBottom: 20,
  },
  grid: {
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridRow: {
    flexDirection: "row",
  },
  gridCell: {
    width: 50,
    height: 50,
    backgroundColor: "#e5e7eb",
    margin: 3,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#d1d5db",
  },
  gridCellSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#2563eb",
  },
  gridCellText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  gridCellTextSelected: {
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  clearButton: {
    flex: 1,
    backgroundColor: "#ef4444",
    padding: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  presetsContainer: {
    marginTop: 20,
  },
  presetsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  presetsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  presetButton: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  presetButtonSelected: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  presetButtonText: {
    fontSize: 12,
    color: "#374151",
    textAlign: "center",
    fontWeight: "500",
  },
  presetButtonTextSelected: {
    color: "#2563eb",
    fontWeight: "700",
  },
});
