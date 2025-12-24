/**
 * Manual Caller Component
 * Input field for manually calling bingo numbers with history and undo
 */

import { useTheme } from "@/contexts/ThemeContext";
import React, { useMemo, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { createStyles } from "./styles/ManualCaller.styles";

interface ManualCallerProps {
  calledNumbers: number[];
  onNumberCall: (number: number) => void;
  onNumberRemove: (number: number) => void;
  onClearAll?: () => void;
  onViewHistory: () => void;
}

export default function ManualCaller({
  calledNumbers = [],
  onNumberCall,
  onNumberRemove,
  onClearAll,
  onViewHistory,
}: ManualCallerProps) {
  const { colorScheme } = useTheme();
  const styles = useMemo(() => createStyles(colorScheme), [colorScheme]);

  const [inputValue, setInputValue] = useState("");

  const getNumberColumn = (num: number): string => {
    if (num >= 1 && num <= 15) return "B";
    if (num >= 16 && num <= 30) return "I";
    if (num >= 31 && num <= 45) return "N";
    if (num >= 46 && num <= 60) return "G";
    if (num >= 61 && num <= 75) return "O";
    return "";
  };

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const num = parseInt(trimmed, 10);

    // Validation
    if (isNaN(num)) {
      Alert.alert("Invalid Input", "Please enter a valid number");
      return;
    }

    if (num < 1 || num > 75) {
      Alert.alert("Invalid Number", "Bingo numbers must be between 1 and 75");
      return;
    }

    if (calledNumbers?.includes(num)) {
      Alert.alert(
        "Already Called",
        `${getNumberColumn(num)}${num} has already been called`
      );
      return;
    }

    // Call the number
    onNumberCall(num);
    setInputValue("");
  };

  const handleRemove = (number: number) => {
    Alert.alert(
      "Remove Number",
      `Remove ${getNumberColumn(number)}${number} from call history?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => onNumberRemove(number),
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (calledNumbers.length === 0) return;

    Alert.alert(
      "Clear All Numbers",
      "Remove all called numbers? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: onClearAll,
        },
      ]
    );
  };

  // Group numbers by column
  const getNumbersByColumn = () => {
    const groups: Record<string, number[]> = {
      B: [],
      I: [],
      N: [],
      G: [],
      O: [],
    };

    calledNumbers.forEach((num) => {
      const col = getNumberColumn(num);
      if (col) groups[col].push(num);
    });

    return groups;
  };

  const columnGroups = getNumbersByColumn();

  return (
    <View style={styles.container}>
      {/* Input Section */}
      <View style={styles.inputSection}>
        <View style={styles.inputHeader}>
          <Text style={styles.inputLabel}>Call Number</Text>
          <Text style={styles.rangeLabel}>1-75</Text>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Enter number"
            placeholderTextColor={
              colorScheme === "dark" ? "#9ca3af" : "#9ca3af"
            }
            keyboardType="number-pad"
            maxLength={2}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[
              styles.callButton,
              !inputValue.trim() && styles.callButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!inputValue.trim()}
          >
            <Text style={styles.callButtonText}>📢 Call</Text>
          </TouchableOpacity>
        </View>

        {/* Column Guide */}
        <View style={styles.columnGuide}>
          <View style={styles.columnItem}>
            <Text style={styles.columnLetter}>B</Text>
            <Text style={styles.columnRange}>1-15</Text>
          </View>
          <View style={styles.columnItem}>
            <Text style={styles.columnLetter}>I</Text>
            <Text style={styles.columnRange}>16-30</Text>
          </View>
          <View style={styles.columnItem}>
            <Text style={styles.columnLetter}>N</Text>
            <Text style={styles.columnRange}>31-45</Text>
          </View>
          <View style={styles.columnItem}>
            <Text style={styles.columnLetter}>G</Text>
            <Text style={styles.columnRange}>46-60</Text>
          </View>
          <View style={styles.columnItem}>
            <Text style={styles.columnLetter}>O</Text>
            <Text style={styles.columnRange}>61-75</Text>
          </View>
        </View>
      </View>

      {/* Call Summary & History Button */}
      <View style={styles.summarySection}>
        {calledNumbers.length > 0 && (
          <View style={styles.latestCallDisplay}>
            <Text style={styles.latestCallLabel}>Latest</Text>
            <Text style={styles.latestCallValue}>
              {getNumberColumn(calledNumbers[calledNumbers.length - 1])}
              {calledNumbers[calledNumbers.length - 1]}
            </Text>
          </View>
        )}
        <TouchableOpacity style={styles.historyButton} onPress={onViewHistory}>
          <Text style={styles.historyButtonIcon}>📋</Text>
          <Text style={styles.historyButtonText}>
            View History ({calledNumbers.length})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
