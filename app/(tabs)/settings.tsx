/**
 * Settings Screen
 * User preferences and app settings
 */

import { useTheme } from "@/contexts/ThemeContext";
import { exportData, importData } from "@/src/services/exportImportService";
import { useAlert } from "@/src/utils/themedAlert";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ThemeMode = "light" | "dark";

export default function SettingsScreen() {
  const { themeMode, setThemeMode, colorScheme } = useTheme();
  const { showAlert } = useAlert();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleThemeChange = async (newTheme: ThemeMode) => {
    try {
      await setThemeMode(newTheme);
    } catch (error) {
      showAlert("Error", "Failed to save theme preference");
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportData();
      if (result.success) {
        showAlert("Success", result.message);
      } else {
        showAlert("Export Failed", result.message);
      }
    } catch (error) {
      showAlert("Export Failed", "An unexpected error occurred");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    showAlert(
      "Import Data",
      "Do you want to replace existing data or merge with current data?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Merge",
          onPress: () => performImport(false),
        },
        {
          text: "Replace",
          style: "destructive",
          onPress: () => performImport(true),
        },
      ]
    );
  };

  const performImport = async (replaceExisting: boolean) => {
    setIsImporting(true);
    try {
      const result = await importData({ replaceExisting });
      if (result.success) {
        showAlert("Success", result.message);
      } else {
        showAlert("Import Failed", result.message);
      }
    } catch (error) {
      showAlert("Import Failed", "An unexpected error occurred");
    } finally {
      setIsImporting(false);
    }
  };

  // Dynamic styles based on theme
  const styles = useMemo(() => createStyles(colorScheme), [colorScheme]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your app experience</Text>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Theme Mode</Text>
              <Text style={styles.settingDescription}>
                Choose between light and dark theme
              </Text>
            </View>
          </View>

          <View style={styles.themeOptions}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                themeMode === "light" && styles.themeButtonActive,
              ]}
              onPress={() => handleThemeChange("light")}
            >
              <Text
                style={[
                  styles.themeButtonIcon,
                  themeMode === "light" && styles.themeButtonIconActive,
                ]}
              >
                ☀️
              </Text>
              <Text
                style={[
                  styles.themeButtonText,
                  themeMode === "light" && styles.themeButtonTextActive,
                ]}
              >
                Light Mode
              </Text>
              {themeMode === "light" && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeButton,
                themeMode === "dark" && styles.themeButtonActive,
              ]}
              onPress={() => handleThemeChange("dark")}
            >
              <Text
                style={[
                  styles.themeButtonIcon,
                  themeMode === "dark" && styles.themeButtonIconActive,
                ]}
              >
                🌙
              </Text>
              <Text
                style={[
                  styles.themeButtonText,
                  themeMode === "dark" && styles.themeButtonTextActive,
                ]}
              >
                Dark Mode
              </Text>
              {themeMode === "dark" && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Backup & Restore</Text>
              <Text style={styles.settingDescription}>
                Export or import your cards, patterns, and game data
              </Text>
            </View>
          </View>

          <View style={styles.dataButtons}>
            <TouchableOpacity
              style={[styles.dataButton, styles.exportButton]}
              onPress={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.dataButtonIcon}>📤</Text>
                  <Text style={styles.dataButtonText}>Export Data</Text>
                  <Text style={styles.dataButtonSubtext}>
                    Save as JSON file
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dataButton, styles.importButton]}
              onPress={handleImport}
              disabled={isImporting}
            >
              {isImporting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.dataButtonIcon}>📥</Text>
                  <Text style={styles.dataButtonText}>Import Data</Text>
                  <Text style={styles.dataButtonSubtext}>
                    Load from JSON file
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              Imported data is validated for security. Only import files from
              trusted sources.
            </Text>
          </View>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>December 2025</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Developer</Text>
            <Text style={styles.infoValue}>lindtseyvii</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colorScheme: "light" | "dark") => {
  const isDark = colorScheme === "dark";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#111827" : "#f9fafb",
    },
    scrollView: {
      flex: 1,
    },
    header: {
      backgroundColor: isDark ? "#1f2937" : "#fff",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#374151" : "#e5e7eb",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: isDark ? "#f9fafb" : "#1f2937",
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: isDark ? "#9ca3af" : "#6b7280",
    },
    section: {
      backgroundColor: isDark ? "#1f2937" : "#fff",
      marginTop: 12,
      padding: 16,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: isDark ? "#374151" : "#e5e7eb",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: isDark ? "#f3f4f6" : "#1f2937",
      marginBottom: 16,
    },
    settingItem: {
      marginBottom: 16,
    },
    settingInfo: {
      marginBottom: 12,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: "500",
      color: isDark ? "#e5e7eb" : "#374151",
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 13,
      color: isDark ? "#9ca3af" : "#6b7280",
    },
    currentThemeBox: {
      backgroundColor: isDark ? "#064e3b" : "#f0fdf4",
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: isDark ? "#059669" : "#86efac",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    currentThemeLabel: {
      fontSize: 13,
      color: isDark ? "#d1fae5" : "#166534",
      fontWeight: "500",
    },
    currentThemeValue: {
      fontSize: 14,
      color: isDark ? "#a7f3d0" : "#15803d",
      fontWeight: "600",
    },
    themeOptions: {
      gap: 12,
    },
    themeButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDark ? "#374151" : "#f3f4f6",
      padding: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: isDark ? "#4b5563" : "#e5e7eb",
    },
    themeButtonActive: {
      backgroundColor: isDark ? "#581c87" : "#ede9fe",
      borderColor: isDark ? "#a855f7" : "#8b5cf6",
    },
    themeButtonIcon: {
      fontSize: 24,
      marginRight: 12,
    },
    themeButtonIconActive: {
      fontSize: 24,
    },
    themeButtonText: {
      fontSize: 16,
      fontWeight: "500",
      color: isDark ? "#e5e7eb" : "#374151",
      flex: 1,
    },
    themeButtonTextActive: {
      color: isDark ? "#e9d5ff" : "#6d28d9",
      fontWeight: "600",
    },
    checkmark: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: isDark ? "#a855f7" : "#8b5cf6",
      justifyContent: "center",
      alignItems: "center",
    },
    checkmarkText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
    },
    infoItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#374151" : "#f3f4f6",
    },
    infoLabel: {
      fontSize: 15,
      color: isDark ? "#d1d5db" : "#374151",
    },
    infoValue: {
      fontSize: 15,
      color: isDark ? "#9ca3af" : "#6b7280",
      fontWeight: "500",
    },
    dataButtons: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 16,
    },
    dataButton: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 100,
    },
    exportButton: {
      backgroundColor: "#3b82f6",
    },
    importButton: {
      backgroundColor: "#10b981",
    },
    dataButtonIcon: {
      fontSize: 32,
      marginBottom: 8,
    },
    dataButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 4,
    },
    dataButtonSubtext: {
      color: "rgba(255, 255, 255, 0.8)",
      fontSize: 12,
    },
    warningBox: {
      flexDirection: "row",
      backgroundColor: isDark ? "#451a03" : "#fef3c7",
      padding: 12,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: "#f59e0b",
      alignItems: "flex-start",
    },
    warningIcon: {
      fontSize: 18,
      marginRight: 8,
    },
    warningText: {
      flex: 1,
      fontSize: 13,
      color: isDark ? "#fbbf24" : "#92400e",
      lineHeight: 18,
    },
  });
};
