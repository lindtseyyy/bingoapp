/**
 * Patterns Management Screen
 */

import { useTheme } from "@/contexts/ThemeContext";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
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

const createStyles = (colorScheme: "light" | "dark") => {
  const isDark = colorScheme === "dark";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#111827" : "#f3f4f6",
    },
    actionBar: {
      padding: 12,
      backgroundColor: isDark ? "#1f2937" : "#fff",
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#374151" : "#e5e7eb",
    },
    createButton: {
      backgroundColor: "#10b981",
      padding: 14,
      borderRadius: 8,
      alignItems: "center",
    },
    createButtonText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "bold",
    },
    scrollContainer: {
      flex: 1,
    },
    patternContainer: {
      backgroundColor: isDark ? "#1f2937" : "#fff",
      padding: 16,
      marginBottom: 2,
    },
    patternHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    patternInfo: {
      flex: 1,
    },
    patternTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    patternName: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? "#f9fafb" : "#1f2937",
      marginRight: 8,
    },
    builtInBadge: {
      backgroundColor: isDark ? "#1e3a8a" : "#dbeafe",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    },
    builtInBadgeText: {
      fontSize: 11,
      fontWeight: "600",
      color: isDark ? "#93c5fd" : "#1e40af",
    },
    patternDetails: {
      fontSize: 14,
      color: isDark ? "#9ca3af" : "#6b7280",
    },
    buttonGroup: {
      flexDirection: "row",
      gap: 8,
    },
    editButton: {
      backgroundColor: "#3b82f6",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    editButtonText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "600",
    },
    deleteButton: {
      backgroundColor: "#ef4444",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    deleteButtonText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "600",
    },
    patternGrid: {
      alignSelf: "center",
      backgroundColor: isDark ? "#374151" : "#f9fafb",
      padding: 8,
      borderRadius: 12,
    },
    patternRow: {
      flexDirection: "row",
    },
    patternCell: {
      width: 40,
      height: 40,
      backgroundColor: isDark ? "#4b5563" : "#e5e7eb",
      margin: 2,
      borderRadius: 6,
      justifyContent: "center",
      alignItems: "center",
    },
    patternCellActive: {
      backgroundColor: "#3b82f6",
    },
    patternCellText: {
      fontSize: 10,
      color: "#fff",
      fontWeight: "bold",
    },
    patternDate: {
      fontSize: 12,
      color: isDark ? "#9ca3af" : "#6b7280",
      marginTop: 12,
      textAlign: "center",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    emptyText: {
      fontSize: 20,
      fontWeight: "bold",
      color: isDark ? "#9ca3af" : "#6b7280",
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: isDark ? "#6b7280" : "#9ca3af",
      textAlign: "center",
    },
    modalContainer: {
      flex: 1,
      backgroundColor: isDark ? "#111827" : "#fff",
    },
    modalHeader: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#374151" : "#e5e7eb",
      alignItems: "flex-start",
    },
    modalCloseButton: {
      fontSize: 16,
      color: "#3b82f6",
      fontWeight: "600",
    },
  });
};
