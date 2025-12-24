/**
 * Card Selection Screen
 * Select which cards to play in the current game session
 */

import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BingoCardComponent from "../components/BingoCard";
import { BingoCard } from "../logic/bingoGenerator";
import { getAllCards } from "../services/storageService";

interface CardSelectionProps {
  onSelectionComplete: (selectedCardIds: string[]) => void;
  preSelectedIds?: string[];
}

export default function CardSelection({
  onSelectionComplete,
  preSelectedIds = [],
}: CardSelectionProps) {
  const [cards, setCards] = useState<BingoCard[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(preSelectedIds)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const loadedCards = await getAllCards();
      setCards(loadedCards);
    } catch (error) {
      Alert.alert("Error", "Failed to load cards");
    } finally {
      setLoading(false);
    }
  };

  const toggleCard = (cardId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(cardId)) {
      newSelected.delete(cardId);
    } else {
      newSelected.add(cardId);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === cards.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(cards.map((c) => c.id)));
    }
  };

  const handleContinue = () => {
    if (selectedIds.size === 0) {
      Alert.alert(
        "No Cards Selected",
        "Please select at least one card to play"
      );
      return;
    }
    onSelectionComplete(Array.from(selectedIds));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading cards...</Text>
      </View>
    );
  }

  if (cards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Cards Available</Text>
        <Text style={styles.emptyText}>
          Create some cards first from the Cards tab
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Select Cards to Play</Text>
          <Text style={styles.subtitle}>
            {selectedIds.size} of {cards.length} selected
          </Text>
        </View>
        <TouchableOpacity
          style={styles.selectAllButton}
          onPress={handleSelectAll}
        >
          <Text style={styles.selectAllText}>
            {selectedIds.size === cards.length ? "Deselect All" : "Select All"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {cards.map((card, index) => {
          const isSelected = selectedIds.has(card.id);
          return (
            <TouchableOpacity
              key={card.id}
              style={[styles.cardContainer, isSelected && styles.cardSelected]}
              onPress={() => toggleCard(card.id)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>Card #{index + 1}</Text>
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}
                  >
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </View>
              </View>

              <BingoCardComponent
                card={card}
                showMarked={false}
                editable={false}
              />
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
            Continue with {selectedIds.size} Card
            {selectedIds.size !== 1 ? "s" : ""}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9fafb",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  selectAllButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  selectAllText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  cardContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 2,
    borderLeftWidth: 4,
    borderLeftColor: "transparent",
  },
  cardSelected: {
    borderLeftColor: "#10b981",
    backgroundColor: "#f0fdf4",
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  checkmark: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  continueButton: {
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  continueButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
