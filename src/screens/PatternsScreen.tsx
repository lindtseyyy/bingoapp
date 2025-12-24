/**
 * Patterns Management Screen
 */

import { useTheme } from "@/contexts/ThemeContext";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PatternCreator from "../components/PatternCreator";
import {
  WinningPattern,
  getPatternPositions,
  isBuiltInPattern,
} from "../services/patternService";
import { deletePattern, getAllPatterns } from "../services/storageService";
import { createStyles } from "./styles/PatternsScreen.styles";

export default function PatternsScreen() {
  const [patterns, setPatterns] = useState<WinningPattern[]>([]);
  const [showCreator, setShowCreator] = useState(false);
  const [editingPattern, setEditingPattern] = useState<WinningPattern | null>(
    null
  );
  const { colorScheme } = useTheme();

  // Dynamic styles based on theme
  const styles = useMemo(() => createStyles(colorScheme), [colorScheme]);

  useEffect(() => {
    loadPatterns();
  }, []);

  const loadPatterns = async () => {
    const loadedPatterns = await getAllPatterns();
    setPatterns(loadedPatterns);
  };

  const handleDeletePattern = (patternId: string, patternName: string) => {
    if (isBuiltInPattern(patternName)) {
      Alert.alert("Cannot Delete", "Built-in patterns cannot be deleted.");
      return;
    }

    Alert.alert(
      "Delete Pattern",
      "Are you sure you want to delete this pattern?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deletePattern(patternId);
            await loadPatterns();
          },
        },
      ]
    );
  };

  const handlePatternCreated = () => {
    setShowCreator(false);
    setEditingPattern(null);
    loadPatterns();
  };

  const handleEditPattern = (pattern: WinningPattern) => {
    if (isBuiltInPattern(pattern.name)) {
      Alert.alert("Cannot Edit", "Built-in patterns cannot be edited.");
      return;
    }
    setEditingPattern(pattern);
    setShowCreator(true);
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Action Button */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreator(true)}
        >
          <Text style={styles.createButtonText}>+ Create Pattern</Text>
        </TouchableOpacity>
      </View>

      {/* Patterns List */}
      {patterns.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No patterns yet</Text>
          <Text style={styles.emptySubtext}>
            Tap "+ Create Pattern" to define winning conditions
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          {/* User Patterns (Editable) */}
          {patterns
            .filter((pattern) => !isBuiltInPattern(pattern.name))
            .map((pattern) => {
              const positions = getPatternPositions(pattern);
              return (
                <View key={pattern.id} style={styles.patternContainer}>
                  <View style={styles.patternHeader}>
                    <View style={styles.patternInfo}>
                      <View style={styles.patternTitleRow}>
                        <Text style={styles.patternName}>{pattern.name}</Text>
                      </View>
                      <Text style={styles.patternDetails}>
                        {positions.length} squares required
                      </Text>
                    </View>
                    <View style={styles.buttonGroup}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditPattern(pattern)}
                      >
                        <Text style={styles.editButtonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() =>
                          handleDeletePattern(pattern.id, pattern.name)
                        }
                      >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {renderPatternGrid(pattern)}
                </View>
              );
            })}

          {/* Built-in Patterns */}
          {patterns
            .filter((pattern) => isBuiltInPattern(pattern.name))
            .map((pattern) => {
              const positions = getPatternPositions(pattern);
              return (
                <View key={pattern.id} style={styles.patternContainer}>
                  <View style={styles.patternHeader}>
                    <View style={styles.patternInfo}>
                      <View style={styles.patternTitleRow}>
                        <Text style={styles.patternName}>{pattern.name}</Text>
                        <View style={styles.builtInBadge}>
                          <Text style={styles.builtInBadgeText}>Built-in</Text>
                        </View>
                      </View>
                      <Text style={styles.patternDetails}>
                        {positions.length} squares required
                      </Text>
                    </View>
                  </View>

                  {renderPatternGrid(pattern)}
                </View>
              );
            })}
        </ScrollView>
      )}

      {/* Pattern Creator Modal */}
      <Modal
        visible={showCreator}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowCreator(false);
          setEditingPattern(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setShowCreator(false);
                setEditingPattern(null);
              }}
            >
              <Text style={styles.modalCloseButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <PatternCreator
            onPatternCreated={handlePatternCreated}
            editingPattern={editingPattern}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
