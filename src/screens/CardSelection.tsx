/**
 * Card Selection Screen
 * Select which cards to play in the current game session
 */

import { useTheme } from "@/contexts/ThemeContext";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import BingoCardComponent from "../components/BingoCard";
import { BingoCard } from "../logic/bingoGenerator";
import { getAllCards } from "../services/storageService";
import { createStyles } from "./styles/CardSelection.styles";

interface CardSelectionProps {
  onSelectionComplete: (selectedCardIds: string[]) => void;
  preSelectedIds?: string[];
}

export default function CardSelection({
  onSelectionComplete,
  preSelectedIds = [],
}: CardSelectionProps) {
  const { colorScheme } = useTheme();
  const styles = useMemo(() => createStyles(colorScheme), [colorScheme]);

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
