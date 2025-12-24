/**
 * Manual Card Creator Screen
 * Allows users to manually enter numbers for each cell
 */

import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
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

const COLUMNS = ["B", "I", "N", "G", "O"];

export default function ManualCardCreator({
  onCardCreated,
  editingCard,
}: {
  onCardCreated?: () => void;
  editingCard?: BingoCard | null;
}) {
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
      <View style={styles.header}>
        <Text style={styles.title}>
          {editingCard ? "Edit Bingo Card" : "Manual Card Entry"}
        </Text>
        <Text style={styles.subtitle}>Tap any cell to enter a number</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  nameContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  nameLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  nameInput: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1f2937",
  },
  guideContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  guideRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  guideItem: {
    flex: 1,
    alignItems: "center",
  },
  guideText: {
    fontSize: 11,
    color: "#1e40af",
    fontWeight: "600",
  },
  cardWrapper: {
    padding: 16,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  autoFillButton: {
    flex: 1,
    backgroundColor: "#6366f1",
    padding: 14,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 32,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
  },
  modalHint: {
    fontSize: 14,
    color: "#1e40af",
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  input: {
    borderWidth: 2,
    borderColor: "#3b82f6",
    borderRadius: 8,
    padding: 16,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
  },
  modalCancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
    marginRight: 8,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  modalSubmitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#3b82f6",
    marginLeft: 8,
    alignItems: "center",
  },
  modalSubmitText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
