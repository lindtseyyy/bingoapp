import { StyleSheet } from "react-native";

export const createStyles = (
  colorScheme: "light" | "dark",
  CELL_SIZE: number
) => {
  const isDark = colorScheme === "dark";

  return StyleSheet.create({
    container: {
      backgroundColor: isDark ? "#1f2937" : "#fff",
      borderRadius: 12,
      padding: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.5 : 0.1,
      shadowRadius: 4,
      elevation: 3,
      overflow: "hidden",
    },
    headerRow: {
      flexDirection: "row",
      marginBottom: 4,
      justifyContent: "center",
    },
    headerCell: {
      width: CELL_SIZE,
      height: CELL_SIZE * 0.7,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDark ? "#1e3a8a" : "#1e40af",
      marginHorizontal: 2,
      borderRadius: 6,
    },
    headerText: {
      color: "#fff",
      fontSize: Math.max(CELL_SIZE * 0.35, 18),
      fontWeight: "bold",
    },
    row: {
      flexDirection: "row",
      marginBottom: 4,
      justifyContent: "center",
    },
    cell: {
      width: CELL_SIZE,
      height: CELL_SIZE,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDark ? "#374151" : "#f0f0f0",
      marginHorizontal: 2,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: isDark ? "#4b5563" : "#d0d0d0",
    },
    cellMarked: {
      backgroundColor: "#10b981",
      borderColor: "#059669",
    },
    cellHighlighted: {
      backgroundColor: isDark ? "#fbbf24" : "#fef3c7",
      borderColor: "#f59e0b",
      borderWidth: 3,
    },
    cellFree: {
      backgroundColor: "#3b82f6",
      borderColor: "#2563eb",
    },
    cellText: {
      fontSize: Math.max(CELL_SIZE * 0.28, 14),
      fontWeight: "600",
      color: isDark ? "#f3f4f6" : "#1f2937",
    },
    cellTextMarked: {
      color: "#fff",
      fontWeight: "bold",
    },
    cellTextFree: {
      color: "#fff",
      fontSize: Math.max(CELL_SIZE * 0.22, 11),
      fontWeight: "bold",
    },
  });
};
