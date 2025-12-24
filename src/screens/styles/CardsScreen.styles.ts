import { StyleSheet } from "react-native";

export const createStyles = (colorScheme: "light" | "dark") => {
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
