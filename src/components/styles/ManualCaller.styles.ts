import { StyleSheet } from "react-native";

export const createStyles = (colorScheme: "light" | "dark") => {
  const isDark = colorScheme === "dark";

  return StyleSheet.create({
    container: {
      backgroundColor: isDark ? "#111827" : "#f9fafb",
    },
    inputSection: {
      backgroundColor: isDark ? "#1f2937" : "#fff",
      padding: 16,
      borderBottomWidth: 2,
      borderBottomColor: isDark ? "#374151" : "#e5e7eb",
    },
    inputHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: isDark ? "#f3f4f6" : "#1f2937",
    },
    rangeLabel: {
      fontSize: 12,
      color: isDark ? "#9ca3af" : "#6b7280",
      fontWeight: "600",
    },
    inputRow: {
      flexDirection: "row",
      gap: 8,
    },
    input: {
      flex: 1,
      backgroundColor: isDark ? "#374151" : "#f9fafb",
      borderWidth: 2,
      borderColor: isDark ? "#4b5563" : "#d1d5db",
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 24,
      fontWeight: "bold",
      color: isDark ? "#f3f4f6" : "#1f2937",
      textAlign: "center",
    },
    callButton: {
      backgroundColor: "#10b981",
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      minWidth: 100,
    },
    callButtonDisabled: {
      backgroundColor: isDark ? "#4b5563" : "#d1d5db",
    },
    callButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    columnGuide: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? "#374151" : "#e5e7eb",
    },
    columnItem: {
      alignItems: "center",
    },
    columnLetter: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#3b82f6",
      marginBottom: 2,
    },
    columnRange: {
      fontSize: 10,
      color: isDark ? "#9ca3af" : "#6b7280",
    },
    summarySection: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDark ? "#1f2937" : "#fff",
      padding: 16,
      gap: 12,
    },
    latestCallDisplay: {
      flex: 1,
      backgroundColor: isDark ? "#78350f" : "#fef3c7",
      padding: 12,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: "#fbbf24",
      alignItems: "center",
    },
    latestCallLabel: {
      fontSize: 10,
      fontWeight: "bold",
      color: isDark ? "#fbbf24" : "#92400e",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 4,
    },
    latestCallValue: {
      fontSize: 28,
      fontWeight: "bold",
      color: isDark ? "#fcd34d" : "#92400e",
    },
    historyButton: {
      flex: 1,
      backgroundColor: "#3b82f6",
      padding: 16,
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      shadowColor: "#3b82f6",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    historyButtonIcon: {
      fontSize: 20,
    },
    historyButtonText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "bold",
    },
  });
};
