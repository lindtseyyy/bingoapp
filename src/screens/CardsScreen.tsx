/**
 * Cards Management Screen
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
import BingoCard from "../components/BingoCard";
import {
  BingoCard as BingoCardType,
  generateBingoCard,
  validateBingoCard,
} from "../logic/bingoGenerator";
import { deleteCard, getAllCards, saveCard } from "../services/storageService";
import ManualCardCreator from "./ManualCardCreator";
import { createStyles } from "./styles/CardsScreen.styles";

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
