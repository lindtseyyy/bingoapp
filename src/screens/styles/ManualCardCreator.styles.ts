import { StyleSheet } from "react-native";

export const createStyles = (colorScheme: "light" | "dark") => {
  const isDark = colorScheme === "dark";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#111827" : "#f9fafb",
    },
    nameContainer: {
      backgroundColor: isDark ? "#1f2937" : "#fff",
      padding: 16,
      marginTop: 2,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#374151" : "#e5e7eb",
    },
    nameLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: isDark ? "#e5e7eb" : "#374151",
      marginBottom: 8,
    },
    nameInput: {
      backgroundColor: isDark ? "#374151" : "#f9fafb",
      borderWidth: 1,
      borderColor: isDark ? "#4b5563" : "#d1d5db",
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: isDark ? "#f3f4f6" : "#1f2937",
    },
    guideContainer: {
      backgroundColor: isDark ? "#1f2937" : "#fff",
      padding: 16,
      marginTop: 2,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#374151" : "#e5e7eb",
    },
    guideTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: isDark ? "#e5e7eb" : "#374151",
      marginBottom: 8,
    },
    guideRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    guideItem: {
      flex: 1,
      alignItems: "center",
    },
    guideText: {
      fontSize: 11,
      color: isDark ? "#60a5fa" : "#1e40af",
      fontWeight: "600",
    },
    cardWrapper: {
      padding: 16,
      alignItems: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    autoFillButton: {
      flex: 1,
      backgroundColor: "#6366f1",
      padding: 14,
      borderRadius: 8,
      marginRight: 8,
      alignItems: "center",
    },
    resetButton: {
      flex: 1,
      backgroundColor: "#ef4444",
      padding: 14,
      borderRadius: 8,
      marginLeft: 8,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "600",
    },
    saveButton: {
      backgroundColor: "#10b981",
      padding: 16,
      borderRadius: 8,
      marginHorizontal: 16,
      marginBottom: 32,
      alignItems: "center",
    },
    saveButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: isDark ? "#1f2937" : "#fff",
      borderRadius: 12,
      padding: 24,
      width: "80%",
      maxWidth: 320,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? "#f3f4f6" : "#1f2937",
      marginBottom: 8,
      textAlign: "center",
    },
    modalHint: {
      fontSize: 14,
      color: isDark ? "#60a5fa" : "#1e40af",
      marginBottom: 16,
      textAlign: "center",
      fontWeight: "600",
    },
    input: {
      borderWidth: 2,
      borderColor: "#3b82f6",
      borderRadius: 8,
      padding: 16,
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
      backgroundColor: isDark ? "#374151" : "#fff",
      color: isDark ? "#f3f4f6" : "#1f2937",
    },
    modalButtons: {
      flexDirection: "row",
    },
    modalCancelButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      backgroundColor: isDark ? "#4b5563" : "#e5e7eb",
      marginRight: 8,
      alignItems: "center",
    },
    modalCancelText: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? "#e5e7eb" : "#374151",
    },
    modalSubmitButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      backgroundColor: "#3b82f6",
      marginLeft: 8,
      alignItems: "center",
    },
    modalSubmitText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#fff",
    },
  });
};
