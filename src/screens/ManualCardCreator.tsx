/**
 * Manual Card Creator Screen
 * Allows users to manually enter numbers for each cell
 */

import { useTheme } from "@/contexts/ThemeContext";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BingoCardComponent from "../components/BingoCard";
import {
  BingoCard,
  BingoCell,
  generateBingoCard,
} from "../logic/bingoGenerator";
import {
  getColumnLetter,
  getColumnRange,
  validateCompleteCard,
  validateNumberEntry,
} from "../logic/cardValidation";
import { saveCard } from "../services/storageService";
import { createStyles } from "./styles/ManualCardCreator.styles";

const COLUMNS = ["B", "I", "N", "G", "O"];

export default function ManualCardCreator({
  onCardCreated,
  editingCard,
}: {
  onCardCreated?: () => void;
  editingCard?: BingoCard | null;
}) {
  const { colorScheme } = useTheme();
  const styles = useMemo(() => createStyles(colorScheme), [colorScheme]);

  const [card, setCard] = useState<BingoCard>(editingCard || createEmptyCard());
  const [cardName, setCardName] = useState(editingCard?.name || "");
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  function createEmptyCard(): BingoCard {
    const cells: BingoCell[][] = [];

    for (let row = 0; row < 5; row++) {
      const rowCells: BingoCell[] = [];
      for (let col = 0; col < 5; col++) {
        if (row === 2 && col === 2) {
          // FREE space
          rowCells.push({
            column: "N",
            value: "FREE",
            marked: false,
          });
        } else {
          rowCells.push({
            column: COLUMNS[col] as "B" | "I" | "N" | "G" | "O",
            value: "",
            marked: false,
          });
        }
      }
      cells.push(rowCells);
    }

    return {
      id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      cells,
      createdAt: Date.now(),
    };
  }

  const handleCellPress = (row: number, col: number) => {
    if (row === 2 && col === 2) return; // Can't edit FREE space

    setSelectedCell({ row, col });
    const currentValue = card.cells[row][col].value;
    setInputValue(currentValue === 0 ? "" : String(currentValue));
  };

  const handleNumberSubmit = () => {
    if (!selectedCell) return;

    const number = parseInt(inputValue, 10);

    if (isNaN(number)) {
      Alert.alert("Invalid Input", "Please enter a valid number");
      return;
    }

    const { row, col } = selectedCell;
    const validation = validateNumberEntry(card, number, row, col);

    if (!validation.isValid) {
      Alert.alert("Invalid Number", validation.error || "Invalid entry");
      return;
    }

    // Update the card
    const newCard = { ...card };
    newCard.cells[row][col].value = number;
    setCard(newCard);

    // Clear error for this cell
    const errorKey = `${row}-${col}`;
    const newErrors = new Map(errors);
    newErrors.delete(errorKey);
    setErrors(newErrors);

    // Close modal
    setSelectedCell(null);
    setInputValue("");
  };

  const handleAutoFill = () => {
    Alert.alert(
      "Auto-Fill",
      "This will automatically fill all empty cells with random valid numbers. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Auto-Fill",
          onPress: () => {
            const autoCard = generateBingoCard();
            // Keep manually entered numbers
            for (let row = 0; row < 5; row++) {
              for (let col = 0; col < 5; col++) {
                const currentValue = card.cells[row][col].value;
                if (currentValue !== 0 && currentValue !== "FREE") {
                  autoCard.cells[row][col].value = currentValue;
                }
              }
            }
            setCard(autoCard);
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    const validation = validateCompleteCard(card);

    if (!validation.isValid) {
      Alert.alert(
        "Incomplete Card",
        validation.error || "Please fill all cells"
      );
      return;
    }

    try {
      const cardToSave = {
        ...card,
        name: cardName.trim() || undefined,
      };
      await saveCard(cardToSave);
      Alert.alert("Success", "Card saved successfully!");
      onCardCreated?.();
    } catch (error) {
      Alert.alert("Error", "Failed to save card");
    }
  };

  const handleReset = () => {
    Alert.alert("Reset Card", "Clear all entries and start over?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          setCard(createEmptyCard());
          setErrors(new Map());
        },
      },
    ]);
  };

  const getColumnInfo = (col: number) => {
    const range = getColumnRange(col);
    return range ? `${getColumnLetter(col)}: ${range.min}-${range.max}` : "";
  };

  return (
    <ScrollView style={styles.container}>
      {/* Card Name Input */}
      <View style={styles.nameContainer}>
        <Text style={styles.nameLabel}>Card Name (Optional):</Text>
        <TextInput
          style={styles.nameInput}
          value={cardName}
          onChangeText={setCardName}
          placeholder="e.g., Lucky Card, Card #1"
          placeholderTextColor={colorScheme === "dark" ? "#9ca3af" : "#999"}
        />
      </View>

      {/* Column Range Guide */}
      <View style={styles.guideContainer}>
        <Text style={styles.guideTitle}>Column Ranges:</Text>
        <View style={styles.guideRow}>
          {[0, 1, 2, 3, 4].map((col) => (
            <View key={col} style={styles.guideItem}>
              <Text style={styles.guideText}>{getColumnInfo(col)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bingo Card */}
      <View style={styles.cardWrapper}>
        <BingoCardComponent
          card={card}
          onCellPress={handleCellPress}
          showMarked={false}
          editable={true}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.autoFillButton}
          onPress={handleAutoFill}
        >
          <Text style={styles.buttonText}>Auto-Fill Empty</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Card</Text>
      </TouchableOpacity>

      {/* Number Entry Modal */}
      <Modal
        visible={selectedCell !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedCell(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Enter Number for{" "}
              {selectedCell &&
                `${getColumnLetter(selectedCell.col)}${selectedCell.row + 1}`}
            </Text>

            <Text style={styles.modalHint}>
              {selectedCell && getColumnInfo(selectedCell.col)}
            </Text>

            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="number-pad"
              placeholder="Enter number"
              placeholderTextColor={
                colorScheme === "dark" ? "#9ca3af" : "#9ca3af"
              }
              autoFocus
              selectTextOnFocus
              maxLength={2}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setSelectedCell(null);
                  setInputValue("");
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handleNumberSubmit}
              >
                <Text style={styles.modalSubmitText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
