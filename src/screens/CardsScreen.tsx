/**
 * Cards Management Screen
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
import BingoCard from "../components/BingoCard";
import {
  BingoCard as BingoCardType,
  generateBingoCard,
  validateBingoCard,
} from "../logic/bingoGenerator";
import { deleteCard, getAllCards, saveCard } from "../services/storageService";
import ManualCardCreator from "./ManualCardCreator";

export default function CardsScreen() {
  const [cards, setCards] = useState<BingoCardType[]>([]);
  const [showManualCreator, setShowManualCreator] = useState(false);
  const [editingCard, setEditingCard] = useState<BingoCardType | null>(null);
  const { colorScheme } = useTheme();

  // Dynamic styles based on theme
  const styles = useMemo(() => createStyles(colorScheme), [colorScheme]);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    const loadedCards = await getAllCards();
    setCards(loadedCards);
  };

  const handleGenerateCard = async () => {
    const newCard = generateBingoCard();

    // Validate the card (just to be safe)
    if (!validateBingoCard(newCard)) {
      Alert.alert(
        "Error",
        "Generated card has duplicate numbers. Please try again."
      );
      return;
    }

    await saveCard(newCard);
    await loadCards();
    Alert.alert("Success", "New card generated!");
  };

  const handleDeleteCard = (cardId: string) => {
    Alert.alert("Delete Card", "Are you sure you want to delete this card?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteCard(cardId);
          await loadCards();
        },
      },
    ]);
  };

  const handleManualCardCreated = () => {
    setShowManualCreator(false);
    setEditingCard(null);
    loadCards();
  };

  const handleEditCard = (card: BingoCardType) => {
    setEditingCard(card);
    setShowManualCreator(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.manualButton}
          onPress={() => setShowManualCreator(true)}
        >
          <Text style={styles.manualButtonText}>✏️ Manual</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerateCard}
        >
          <Text style={styles.generateButtonText}>🎲 Auto</Text>
        </TouchableOpacity>
      </View>

      {/* Cards List */}
      {cards.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No cards yet</Text>
          <Text style={styles.emptySubtext}>
            Tap "+ New Card" to generate your first Bingo card
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          {cards.map((card, index) => (
            <View key={card.id} style={styles.cardContainer}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  {card.name || `Card #${index + 1}`}
                </Text>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditCard(card)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteCard(card.id)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <BingoCard card={card} showMarked={false} editable={false} />
            </View>
          ))}
        </ScrollView>
      )}

      {/* Manual Card Creator Modal */}
      <Modal
        visible={showManualCreator}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowManualCreator(false);
          setEditingCard(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setShowManualCreator(false);
                setEditingCard(null);
              }}
            >
              <Text style={styles.modalCloseButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <ManualCardCreator
            onCardCreated={handleManualCardCreated}
            editingCard={editingCard}
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
      flexDirection: "row",
      padding: 12,
      gap: 12,
      backgroundColor: isDark ? "#1f2937" : "#fff",
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#374151" : "#e5e7eb",
    },
    manualButton: {
      flex: 1,
      backgroundColor: "#6366f1",
      padding: 14,
      borderRadius: 8,
      alignItems: "center",
    },
    manualButtonText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "bold",
    },
    generateButton: {
      flex: 1,
      backgroundColor: "#10b981",
      padding: 14,
      borderRadius: 8,
      alignItems: "center",
    },
    generateButtonText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "bold",
    },
    scrollContainer: {
      flex: 1,
    },
    cardContainer: {
      backgroundColor: isDark ? "#1f2937" : "#fff",
      padding: 16,
      marginBottom: 2,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? "#f9fafb" : "#1f2937",
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
    cardInfo: {
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
