import { StyleSheet } from "react-native";

export const createStyles = (colorScheme: "light" | "dark") => {
  const isDark = colorScheme === "dark";

  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: isDark ? "#111827" : "#f9fafb",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: isDark ? "#1f2937" : "#fff",
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#374151" : "#e5e7eb",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.5 : 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: isDark ? "#f3f4f6" : "#1f2937",
    },
    modalSubtitle: {
      fontSize: 13,
      color: isDark ? "#9ca3af" : "#6b7280",
      marginTop: 2,
    },
    headerButtons: {
      flexDirection: "row",
      gap: 8,
    },
    clearAllButton: {
      backgroundColor: isDark ? "#7f1d1d" : "#fee2e2",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 6,
    },
    clearAllText: {
      color: isDark ? "#fca5a5" : "#dc2626",
      fontSize: 14,
      fontWeight: "600",
    },
    closeButton: {
      backgroundColor: "#3b82f6",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
    },
    closeButtonText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
    },
    emptyStateIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyStateText: {
      fontSize: 18,
      fontWeight: "600",
      color: isDark ? "#9ca3af" : "#6b7280",
      marginBottom: 8,
    },
    emptyStateSubtext: {
      fontSize: 14,
      color: "#9ca3af",
      textAlign: "center",
    },
    content: {
      flex: 1,
    },
    latestCallBanner: {
      backgroundColor: isDark ? "#78350f" : "#fef3c7",
      padding: 20,
      margin: 16,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#fbbf24",
      shadowColor: "#f59e0b",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    latestCallLabel: {
      fontSize: 12,
      fontWeight: "bold",
      color: isDark ? "#fbbf24" : "#92400e",
      letterSpacing: 1,
      marginBottom: 8,
    },
    latestCallNumber: {
      fontSize: 48,
      fontWeight: "bold",
      color: isDark ? "#fcd34d" : "#92400e",
    },
    columnsContainer: {
      flexDirection: "row",
      padding: 12,
      gap: 8,
    },
    column: {
      flex: 1,
      backgroundColor: isDark ? "#1f2937" : "#fff",
      borderRadius: 12,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.5 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    columnHeader: {
      padding: 12,
      alignItems: "center",
    },
    columnHeaderText: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
    },
    columnHeaderCount: {
      fontSize: 12,
      fontWeight: "600",
      color: "#fff",
      marginTop: 4,
      opacity: 0.9,
    },
    columnContent: {
      padding: 8,
      minHeight: 100,
    },
    columnEmpty: {
      fontSize: 24,
      color: isDark ? "#4b5563" : "#d1d5db",
      textAlign: "center",
      paddingVertical: 20,
    },
    numberChip: {
      backgroundColor: isDark ? "#374151" : "#f3f4f6",
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginBottom: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: isDark ? "#4b5563" : "#e5e7eb",
    },
    numberChipText: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? "#f3f4f6" : "#1f2937",
    },
    numberChipRemove: {
      fontSize: 16,
      color: "#ef4444",
      fontWeight: "bold",
    },
    instructionContainer: {
      margin: 16,
      padding: 12,
      backgroundColor: isDark ? "#1e3a8a" : "#eff6ff",
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: "#3b82f6",
    },
    instructionText: {
      fontSize: 13,
      color: isDark ? "#93c5fd" : "#1e40af",
      textAlign: "center",
    },
  });
};
