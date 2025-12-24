import { StyleSheet } from "react-native";

export const createStyles = (colorScheme: "light" | "dark") => {
  const isDark = colorScheme === "dark";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#111827" : "#f3f4f6",
    },
    actionBar: {
      padding: 12,
      backgroundColor: isDark ? "#1f2937" : "#fff",
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#374151" : "#e5e7eb",
    },
    createButton: {
      backgroundColor: "#10b981",
      padding: 14,
      borderRadius: 8,
      alignItems: "center",
    },
    createButtonText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "bold",
    },
    scrollContainer: {
      flex: 1,
    },
    patternContainer: {
      backgroundColor: isDark ? "#1f2937" : "#fff",
      padding: 16,
      marginBottom: 2,
    },
    patternHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    patternInfo: {
      flex: 1,
    },
    patternTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    patternName: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? "#f9fafb" : "#1f2937",
      marginRight: 8,
    },
    builtInBadge: {
      backgroundColor: isDark ? "#1e3a8a" : "#dbeafe",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    },
    builtInBadgeText: {
      fontSize: 11,
      fontWeight: "600",
      color: isDark ? "#93c5fd" : "#1e40af",
    },
    patternDetails: {
      fontSize: 14,
      color: isDark ? "#9ca3af" : "#6b7280",
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
    patternGrid: {
      alignSelf: "center",
      backgroundColor: isDark ? "#374151" : "#f9fafb",
      padding: 8,
      borderRadius: 12,
    },
    patternRow: {
      flexDirection: "row",
    },
    patternCell: {
      width: 40,
      height: 40,
      backgroundColor: isDark ? "#4b5563" : "#e5e7eb",
      margin: 2,
      borderRadius: 6,
      justifyContent: "center",
      alignItems: "center",
    },
    patternCellActive: {
      backgroundColor: "#3b82f6",
    },
    patternCellText: {
      fontSize: 10,
      color: "#fff",
      fontWeight: "bold",
    },
    patternDate: {
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
