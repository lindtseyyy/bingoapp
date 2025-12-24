/**
 * Themed Alert Hook
 * Provides dark mode support for alerts using React hooks
 */

import { useTheme } from "@/contexts/ThemeContext";
import React, { createContext, useContext, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

interface AlertConfig {
  title: string;
  message?: string;
  buttons?: AlertButton[];
}

interface AlertContextType {
  showAlert: (title: string, message?: string, buttons?: AlertButton[]) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useTheme();
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);

  const showAlert = (
    title: string,
    message?: string,
    buttons?: AlertButton[]
  ) => {
    setAlertConfig({
      title,
      message,
      buttons: buttons || [{ text: "OK" }],
    });
  };

  const handlePress = (onPress?: () => void) => {
    setAlertConfig(null);
    setTimeout(() => {
      onPress?.();
    }, 100);
  };

  const isDark = colorScheme === "dark";

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alertConfig && (
        <Modal
          transparent
          visible={true}
          animationType="fade"
          onRequestClose={() => setAlertConfig(null)}
        >
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setAlertConfig(null)}
          >
            <TouchableOpacity activeOpacity={1}>
              <View
                style={[
                  styles.alertContainer,
                  isDark && styles.alertContainerDark,
                ]}
              >
                <Text
                  style={[styles.alertTitle, isDark && styles.alertTitleDark]}
                >
                  {alertConfig.title}
                </Text>
                {alertConfig.message && (
                  <Text
                    style={[
                      styles.alertMessage,
                      isDark && styles.alertMessageDark,
                    ]}
                  >
                    {alertConfig.message}
                  </Text>
                )}
                <View
                  style={[
                    styles.buttonContainer,
                    alertConfig.buttons && alertConfig.buttons.length === 1
                      ? styles.buttonContainerSingle
                      : styles.buttonContainerMultiple,
                  ]}
                >
                  {alertConfig.buttons?.map((button, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.button,
                        alertConfig.buttons &&
                          alertConfig.buttons.length === 1 &&
                          styles.buttonSingle,
                        button.style === "cancel" && styles.buttonCancel,
                        button.style === "cancel" &&
                          isDark &&
                          styles.buttonCancelDark,
                        button.style === "destructive" &&
                          styles.buttonDestructive,
                      ]}
                      onPress={() => handlePress(button.onPress)}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          button.style === "cancel" && styles.buttonTextCancel,
                          button.style === "cancel" &&
                            isDark &&
                            styles.buttonTextCancelDark,
                          button.style === "destructive" &&
                            styles.buttonTextDestructive,
                        ]}
                      >
                        {button.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within AlertProvider");
  }
  return context;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  alertContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    minWidth: 280,
    maxWidth: 340,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  alertContainerDark: {
    backgroundColor: "#1f2937",
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
  },
  alertTitleDark: {
    color: "#f3f4f6",
  },
  alertMessage: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  alertMessageDark: {
    color: "#9ca3af",
  },
  buttonContainer: {
    marginTop: 4,
  },
  buttonContainerSingle: {
    flexDirection: "column",
  },
  buttonContainerMultiple: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonSingle: {
    flex: 0,
  },
  buttonCancel: {
    backgroundColor: "#e5e7eb",
  },
  buttonCancelDark: {
    backgroundColor: "#374151",
  },
  buttonDestructive: {
    backgroundColor: "#ef4444",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextCancel: {
    color: "#374151",
  },
  buttonTextCancelDark: {
    color: "#e5e7eb",
  },
  buttonTextDestructive: {
    color: "#fff",
  },
});
