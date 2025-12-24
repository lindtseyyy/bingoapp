import { StyleSheet } from "react-native";

export const createStyles = (colorScheme: "light" | "dark") => {
  const isDark = colorScheme === "dark";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#111827" : "#f9fafb",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDark ? "#111827" : "#f9fafb",
    },
    loadingText: {
      fontSize: 16,
      color: isDark ? "#9ca3af" : "#6b7280",
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
    },
    header: {
      backgroundColor: isDark ? "#1f2937" : "#fff",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#374151" : "#e5e7eb",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: isDark ? "#f3f4f6" : "#1f2937",
    },
    subtitle: {
      fontSize: 14,
      color: isDark ? "#9ca3af" : "#6b7280",
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
      backgroundColor: isDark ? "#1f2937" : "#fff",
      padding: 16,
      marginBottom: 2,
      borderLeftWidth: 4,
      borderLeftColor: "transparent",
    },
    cardSelected: {
      borderLeftColor: "#10b981",
      backgroundColor: isDark ? "#064e3b" : "#f0fdf4",
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
      color: isDark ? "#f3f4f6" : "#1f2937",
    },
    checkbox: {
      width: 28,
      height: 28,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: isDark ? "#4b5563" : "#d1d5db",
      backgroundColor: isDark ? "#374151" : "#fff",
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
      backgroundColor: isDark ? "#1f2937" : "#fff",
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: isDark ? "#374151" : "#e5e7eb",
    },
    continueButton: {
      backgroundColor: "#10b981",
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    continueButtonDisabled: {
      backgroundColor: isDark ? "#4b5563" : "#d1d5db",
    },
    continueButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
};
