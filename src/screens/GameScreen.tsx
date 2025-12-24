/**
 * Game Screen
 * Manual session-based gameplay with card/pattern selection
 */

import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BingoCard from "../components/BingoCard";
import CallHistoryModal from "../components/CallHistoryModal";
import ManualCaller from "../components/ManualCaller";
import { BingoCard as BingoCardType } from "../logic/bingoGenerator";
import {
  GameSession,
  addCalledNumber,
  applyCalledNumbersToCards,
  clearSession,
  createGameSession,
  loadSession,
  removeCalledNumber,
  saveSession,
} from "../services/gameSession";
import { WinningPattern, checkPattern } from "../services/patternService";
import { getAllCards, getAllPatterns } from "../services/storageService";
import { analyzeGame } from "../services/waitingNumberService";
import CardSelection from "./CardSelection";
import PatternSelection from "./PatternSelection";

type SetupStep = "card-selection" | "pattern-selection" | "playing";

const { height: screenHeight } = Dimensions.get("window");

export default function GameScreen() {
  const [setupStep, setSetupStep] = useState<SetupStep>("card-selection");
  const [session, setSession] = useState<GameSession | null>(null);
  const [allCards, setAllCards] = useState<BingoCardType[]>([]);
  const [allPatterns, setAllPatterns] = useState<WinningPattern[]>([]);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);

  // Reload data when screen comes into focus (e.g., after creating cards in other tabs)
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const [loadedCards, loadedPatterns, savedSession] = await Promise.all([
        getAllCards(),
        getAllPatterns(),
        loadSession(),
      ]);

      setAllCards(loadedCards);
      setAllPatterns(loadedPatterns);

      // Resume saved session if exists
      if (savedSession && savedSession.activeCardIds.length > 0) {
        setSession(savedSession);
        setSetupStep("playing");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load game data");
    }
  };

  const handleCardSelectionComplete = (selectedCardIds: string[]) => {
    if (selectedCardIds.length === 0) {
      Alert.alert("No Cards", "Please select at least one card to play");
      return;
    }
    setSession(createGameSession(selectedCardIds, []));
    setSetupStep("pattern-selection");
  };

  const handlePatternSelectionComplete = (selectedPatternIds: string[]) => {
    if (!session) return;

    const updatedSession: GameSession = {
      ...session,
      activePatternIds: selectedPatternIds,
    };
    setSession(updatedSession);
    saveSession(updatedSession);
    setSetupStep("playing");
  };

  const handleNumberCall = async (number: number) => {
    if (!session) return;

    const updatedSession = addCalledNumber(session, number);
    setSession(updatedSession);
    await saveSession(updatedSession);

    // Check for winners
    const selectedCards = allCards.filter((c) =>
      updatedSession.activeCardIds?.includes(c.id)
    );
    const selectedPatterns = allPatterns.filter((p) =>
      updatedSession.activePatternIds?.includes(p.id)
    );

    // Apply called numbers to cards for win checking
    const markedCards = applyCalledNumbersToCards(
      selectedCards,
      updatedSession.calledNumbers
    );

    for (const card of markedCards) {
      for (const pattern of selectedPatterns) {
        if (checkPattern(card, pattern)) {
          Alert.alert(
            "🎉 BINGO! 🎉",
            `Card #${card.id.slice(-6)} wins with pattern "${pattern.name}"!`,
            [{ text: "Continue", onPress: () => {} }]
          );
        }
      }
    }
  };

  const handleNumberRemove = async (number: number) => {
    if (!session) return;

    Alert.alert(
      "⚠️ Remove Number?",
      `Removing ${number} will un-mark it on all active cards. This cannot be undone.\n\nContinue?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const updatedSession = removeCalledNumber(session, number);
            setSession(updatedSession);
            await saveSession(updatedSession);
          },
        },
      ]
    );
  };

  const handleClearAll = async () => {
    if (!session) return;

    Alert.alert(
      "⚠️ Clear All Numbers?",
      `This will remove all ${
        session.calledNumbers?.length || 0
      } called numbers and un-mark all cards. This cannot be undone.\n\nContinue?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            const clearedSession: GameSession = {
              ...session,
              calledNumbers: [],
            };
            setSession(clearedSession);
            await saveSession(clearedSession);
          },
        },
      ]
    );
  };

  const handleNewSession = () => {
    Alert.alert(
      "New Session",
      "Start a new game session? Current progress will be saved.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "New Session",
          onPress: async () => {
            await clearSession();
            setSession(null);
            setSetupStep("card-selection");
          },
        },
      ]
    );
  };

  // Card Selection Step
  if (setupStep === "card-selection") {
    if (allCards.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Cards Available</Text>
          <Text style={styles.emptyText}>
            Create some bingo cards from the Cards tab first
          </Text>
        </View>
      );
    }

    return (
      <CardSelection
        onSelectionComplete={handleCardSelectionComplete}
        preSelectedIds={session?.activeCardIds || []}
      />
    );
  }

  // Pattern Selection Step
  if (setupStep === "pattern-selection") {
    if (allPatterns.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Patterns Available</Text>
          <Text style={styles.emptyText}>
            Create some patterns from the Patterns tab first
          </Text>
        </View>
      );
    }

    return (
      <PatternSelection
        onSelectionComplete={handlePatternSelectionComplete}
        preSelectedIds={session?.activePatternIds || []}
      />
    );
  }

  // Playing Step
  if (!session) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading session...</Text>
      </View>
    );
  }

  const selectedCards = allCards.filter((c) =>
    session.activeCardIds?.includes(c.id)
  );
  const selectedPatterns = allPatterns.filter((p) =>
    session.activePatternIds?.includes(p.id)
  );

  // Apply called numbers to cards for display
  const markedCards = applyCalledNumbersToCards(
    selectedCards,
    session.calledNumbers || []
  );

  // Analyze game state
  const gameAnalysis = analyzeGame(markedCards, selectedPatterns);
  const analysis = gameAnalysis.cardAnalyses;

  // Separate cards into different urgency categories
  const potAnalyses = analysis.filter(
    (a) => a.isOnPot && a.missingNumbers.length === 1
  );
  const closeToWinAnalyses = analysis.filter(
    (a) =>
      !a.isOnPot && a.missingNumbers.length > 0 && a.missingNumbers.length <= 3
  );
  const regularAnalyses = analysis.filter(
    (a) => !potAnalyses.includes(a) && !closeToWinAnalyses.includes(a)
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Collapsible Session Header */}
        <View style={styles.sessionHeader}>
          <TouchableOpacity
            style={styles.sessionHeaderTouchable}
            onPress={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
            activeOpacity={0.7}
          >
            <View style={styles.sessionHeaderContent}>
              <View style={styles.sessionHeaderLeft}>
                <Text style={styles.sessionTitle}>
                  {isHeaderCollapsed ? "▶" : "▼"} Game in Progress
                </Text>
                {!isHeaderCollapsed && (
                  <Text style={styles.sessionInfo}>
                    {selectedCards.length} card
                    {selectedCards.length !== 1 ? "s" : ""} •{" "}
                    {selectedPatterns.length} pattern
                    {selectedPatterns.length !== 1 ? "s" : ""}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.newSessionButton}
                onPress={handleNewSession}
              >
                <Text style={styles.newSessionText}>New</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Manual Caller Input - Always visible */}
        <View style={styles.cardContainer}>
          <ManualCaller
            calledNumbers={session.calledNumbers || []}
            onNumberCall={handleNumberCall}
            onNumberRemove={handleNumberRemove}
            onClearAll={handleClearAll}
            onViewHistory={() => setIsHistoryModalVisible(true)}
          />
        </View>

        {/* Cards Display - Unified in scroll */}
        <View style={styles.cardContainer}>
          <View style={styles.cardsSection}>
            {markedCards.map((card, index) => {
              const cardAnalyses = analysis.filter((a) => a.cardId === card.id);
              const cardPotAnalyses = cardAnalyses.filter(
                (a) => a.isOnPot && a.missingNumbers.length === 1
              );
              const cardCloseAnalyses = cardAnalyses.filter(
                (a) =>
                  !a.isOnPot &&
                  a.missingNumbers.length > 0 &&
                  a.missingNumbers.length <= 3
              );
              const closestAnalysis = cardAnalyses.sort(
                (a, b) => a.missingNumbers.length - b.missingNumbers.length
              )[0];

              return (
                <View key={card.id} style={styles.cardContainer}>
                  <Text style={styles.cardName}>Card #{card.id.slice(-6)}</Text>

                  <BingoCard card={card} showMarked={true} editable={false} />

                  {closestAnalysis && (
                    <View style={styles.analysisContainer}>
                      {/* On Pot - 1 number away */}
                      {cardPotAnalyses.length > 0 && (
                        <View style={styles.potContainer}>
                          <Text style={styles.potTitle}>🔥 ON POT!</Text>
                          <View style={styles.pathsWrapper}>
                            {cardPotAnalyses.map((pot, idx) => (
                              <View
                                key={`${pot.patternId}-${pot.pathIndex ?? idx}`}
                                style={styles.potPathCard}
                              >
                                <View style={styles.pathHeader}>
                                  <Text style={styles.potPattern}>
                                    {pot.patternName}
                                  </Text>
                                  {pot.pathIndex !== undefined && (
                                    <View style={styles.wayBadge}>
                                      <Text style={styles.wayBadgeText}>
                                        Way {pot.pathIndex + 1}
                                      </Text>
                                    </View>
                                  )}
                                </View>
                                <View style={styles.numbersBox}>
                                  <Text style={styles.numbersLabel}>Need:</Text>
                                  <Text style={styles.potNumbers}>
                                    {pot.missingNumbers.join(", ")}
                                  </Text>
                                </View>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}

                      {/* Close to Win - 2-3 numbers away */}
                      {cardPotAnalyses.length === 0 &&
                        cardCloseAnalyses.length > 0 && (
                          <View style={styles.closeContainer}>
                            <Text style={styles.closeTitle}>
                              ⚡ Almost There!
                            </Text>
                            <View style={styles.pathsWrapper}>
                              {cardCloseAnalyses
                                .slice(0, 3)
                                .map((close, idx) => (
                                  <View
                                    key={`${close.patternId}-${
                                      close.pathIndex ?? idx
                                    }`}
                                    style={styles.closePathCard}
                                  >
                                    <View style={styles.pathHeader}>
                                      <Text style={styles.closePattern}>
                                        {close.patternName}
                                      </Text>
                                      {close.pathIndex !== undefined && (
                                        <View style={styles.wayBadgeBlue}>
                                          <Text style={styles.wayBadgeTextBlue}>
                                            Way {close.pathIndex + 1}
                                          </Text>
                                        </View>
                                      )}
                                    </View>
                                    <View style={styles.numbersBox}>
                                      <Text style={styles.numbersLabel}>
                                        Need:
                                      </Text>
                                      <Text style={styles.closeNumbers}>
                                        {close.missingNumbers.join(", ")}
                                      </Text>
                                    </View>
                                  </View>
                                ))}
                            </View>
                          </View>
                        )}

                      {/* Regular Status */}
                      {cardPotAnalyses.length === 0 &&
                        cardCloseAnalyses.length === 0 &&
                        closestAnalysis && (
                          <View style={styles.regularContainer}>
                            <Text style={styles.regularText}>
                              Closest: {closestAnalysis.patternName} (
                              {closestAnalysis.missingNumbers.length} away)
                            </Text>
                          </View>
                        )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Call History Modal */}
      <CallHistoryModal
        visible={isHistoryModalVisible}
        calledNumbers={session.calledNumbers || []}
        onClose={() => setIsHistoryModalVisible(false)}
        onRemoveNumber={handleNumberRemove}
        onClearAll={handleClearAll}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
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
  sessionHeader: {
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: "#e5e7eb",
  },
  sessionHeaderTouchable: {
    padding: 12,
  },
  sessionHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sessionHeaderLeft: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
  },
  sessionInfo: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  newSessionButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  newSessionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  callerSection: {
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: "#e5e7eb",
  },
  cardsSection: {
    backgroundColor: "#f3f4f6",
  },
  cardContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  analysisContainer: {
    marginTop: 16,
  },
  potContainer: {
    backgroundColor: "#fef3c7",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  potTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 12,
  },
  pathsWrapper: {
    gap: 8,
  },
  potPathCard: {
    backgroundColor: "#fffbeb",
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: "#fcd34d",
    marginBottom: 8,
  },
  closePathCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: "#93c5fd",
    marginBottom: 8,
  },
  pathHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  wayBadge: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  wayBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  wayBadgeBlue: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  wayBadgeTextBlue: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  numbersBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  numbersLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  potPattern: {
    fontSize: 14,
    fontWeight: "600",
    color: "#78350f",
  },
  potNumbers: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400e",
  },
  closeContainer: {
    backgroundColor: "#dbeafe",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  closeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 12,
  },
  closePattern: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e3a8a",
  },
  closeNumbers: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e40af",
  },
  regularContainer: {
    backgroundColor: "#f3f4f6",
    padding: 10,
    borderRadius: 6,
  },
  regularText: {
    fontSize: 13,
    color: "#6b7280",
  },
});
