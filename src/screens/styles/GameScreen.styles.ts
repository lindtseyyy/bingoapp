import { StyleSheet } from "react-native";

export const createStyles = (colorScheme: "light" | "dark") => {
  const isDark = colorScheme === "dark";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#111827" : "#f9fafb",
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
      backgroundColor: isDark ? "#111827" : "#f9fafb",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: isDark ? "#111827" : "#f9fafb",
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: isDark ? "#f3f4f6" : "#1f2937",
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      color: isDark ? "#9ca3af" : "#6b7280",
      textAlign: "center",
      marginBottom: 20,
    },
    newSessionButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    sessionHeader: {
      backgroundColor: isDark ? "#1f2937" : "#fff",
      borderBottomWidth: 2,
      borderBottomColor: isDark ? "#374151" : "#e5e7eb",
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
      color: isDark ? "#f3f4f6" : "#1f2937",
    },
    sessionInfo: {
      fontSize: 12,
      color: isDark ? "#9ca3af" : "#6b7280",
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
    patternsSection: {
      backgroundColor: isDark ? "#1f2937" : "#fff",
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#374151" : "#e5e7eb",
    },
    patternsSectionTitle: {
      fontSize: 13,
      fontWeight: "600",
      color: isDark ? "#e5e7eb" : "#374151",
      marginBottom: 8,
    },
    patternsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    patternChip: {
      backgroundColor: isDark ? "#312e81" : "#ede9fe",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isDark ? "#4c1d95" : "#c4b5fd",
    },
    patternChipText: {
      fontSize: 12,
      fontWeight: "500",
      color: isDark ? "#c4b5fd" : "#5b21b6",
    },
    noPatternsText: {
      fontSize: 12,
      color: "#9ca3af",
      fontStyle: "italic",
    },
    callerSection: {
      backgroundColor: isDark ? "#1f2937" : "#fff",
      borderBottomWidth: 2,
      borderBottomColor: isDark ? "#374151" : "#e5e7eb",
    },
    cardsSection: {
      backgroundColor: isDark ? "#111827" : "#f3f4f6",
    },
    cardContainer: {
      backgroundColor: isDark ? "#1f2937" : "#fff",
      padding: 16,
      marginBottom: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.3 : 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    cardName: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? "#f3f4f6" : "#1f2937",
      marginBottom: 12,
    },
    analysisContainer: {
      marginTop: 16,
    },
    potContainer: {
      backgroundColor: isDark ? "#451a03" : "#fef3c7",
      padding: 12,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: "#f59e0b",
    },
    potTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? "#fbbf24" : "#92400e",
      marginBottom: 12,
    },
    pathsWrapper: {
      gap: 8,
    },
    potPathCard: {
      backgroundColor: isDark ? "#78350f" : "#fffbeb",
      borderRadius: 6,
      padding: 10,
      borderWidth: 1,
      borderColor: isDark ? "#92400e" : "#fcd34d",
      marginBottom: 8,
    },
    closePathCard: {
      backgroundColor: isDark ? "#1e3a8a" : "#eff6ff",
      borderRadius: 6,
      padding: 10,
      borderWidth: 1,
      borderColor: isDark ? "#1e40af" : "#93c5fd",
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
      color: isDark ? "#9ca3af" : "#6b7280",
      fontWeight: "500",
    },
    potPattern: {
      fontSize: 14,
      fontWeight: "600",
      color: isDark ? "#fbbf24" : "#78350f",
    },
    potNumbers: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? "#fcd34d" : "#92400e",
    },
    closeContainer: {
      backgroundColor: isDark ? "#1e3a8a" : "#dbeafe",
      padding: 12,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: "#3b82f6",
    },
    closeTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: isDark ? "#60a5fa" : "#1e40af",
      marginBottom: 12,
    },
    closePattern: {
      fontSize: 13,
      fontWeight: "600",
      color: isDark ? "#93c5fd" : "#1e3a8a",
    },
    closeNumbers: {
      fontSize: 16,
      fontWeight: "bold",
      color: isDark ? "#60a5fa" : "#1e40af",
    },
    regularContainer: {
      backgroundColor: isDark ? "#374151" : "#f3f4f6",
      padding: 10,
      borderRadius: 6,
    },
    regularText: {
      fontSize: 13,
      color: isDark ? "#9ca3af" : "#6b7280",
    },
  });
};
