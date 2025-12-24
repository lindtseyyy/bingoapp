import { StyleSheet } from "react-native";

export const createStyles = (colorScheme: "light" | "dark") => {
  const isDark = colorScheme === "dark";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#111827" : "#f9fafb",
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: isDark ? "#f3f4f6" : "#1f2937",
      marginBottom: 20,
      textAlign: "center",
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? "#e5e7eb" : "#374151",
      marginBottom: 8,
    },
    input: {
      backgroundColor: isDark ? "#374151" : "#fff",
      borderWidth: 1,
      borderColor: isDark ? "#4b5563" : "#d1d5db",
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: isDark ? "#f3f4f6" : "#1f2937",
    },
    gridContainer: {
      marginBottom: 20,
    },
    grid: {
      alignSelf: "center",
      backgroundColor: isDark ? "#1f2937" : "#fff",
      padding: 8,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.5 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    gridRow: {
      flexDirection: "row",
    },
    gridCell: {
      width: 50,
      height: 50,
      backgroundColor: isDark ? "#374151" : "#e5e7eb",
      margin: 3,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: isDark ? "#4b5563" : "#d1d5db",
    },
    gridCellSelected: {
      backgroundColor: "#3b82f6",
      borderColor: "#2563eb",
    },
    gridCellText: {
      fontSize: 12,
      color: isDark ? "#9ca3af" : "#6b7280",
      fontWeight: "600",
    },
    gridCellTextSelected: {
      color: "#fff",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 30,
    },
    clearButton: {
      flex: 1,
      backgroundColor: "#ef4444",
      padding: 16,
      borderRadius: 8,
      marginRight: 8,
      alignItems: "center",
    },
    saveButton: {
      flex: 1,
      backgroundColor: "#10b981",
      padding: 16,
      borderRadius: 8,
      marginLeft: 8,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    presetsContainer: {
      marginTop: 20,
    },
    presetsTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: isDark ? "#e5e7eb" : "#374151",
      marginBottom: 12,
    },
    presetsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    presetButton: {
      width: "48%",
      backgroundColor: isDark ? "#1f2937" : "#fff",
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: isDark ? "#374151" : "#e5e7eb",
      alignItems: "center",
    },
    presetButtonSelected: {
      borderColor: "#3b82f6",
      backgroundColor: isDark ? "#1e3a8a" : "#eff6ff",
    },
    presetButtonText: {
      fontSize: 12,
      color: isDark ? "#e5e7eb" : "#374151",
      textAlign: "center",
      fontWeight: "500",
    },
    presetButtonTextSelected: {
      color: isDark ? "#93c5fd" : "#2563eb",
      fontWeight: "700",
    },
  });
};
