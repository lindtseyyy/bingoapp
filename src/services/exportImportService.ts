/**
 * Export/Import Service
 * Handles data backup and restore with validation
 */

import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import { StorageAccessFramework } from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import { BingoCard } from "../logic/bingoGenerator";
import { GameSession, loadSession, saveSession } from "./gameSession";
import { WinningPattern } from "./patternService";
import {
    getAllCards,
    getAllPatterns,
    saveCard,
    savePattern,
} from "./storageService";

export interface ExportData {
  version: string;
  exportDate: string;
  cards: BingoCard[];
  patterns: WinningPattern[];
  gameSession: GameSession | null;
}

const EXPORT_VERSION = "1.0.0";

/**
 * Validate card data structure
 */
function validateCard(card: any): card is BingoCard {
  if (!card || typeof card !== "object") return false;
  if (typeof card.id !== "string") return false;
  if (!Array.isArray(card.cells)) return false;
  if (card.cells.length !== 5) return false;

  for (const row of card.cells) {
    if (!Array.isArray(row) || row.length !== 5) return false;
    for (const cell of row) {
      if (!cell || typeof cell !== "object") return false;
      if (typeof cell.value !== "number" && cell.value !== null) return false;
      if (typeof cell.marked !== "boolean") return false;
    }
  }

  if (card.name && typeof card.name !== "string") return false;
  if (card.createdAt && typeof card.createdAt !== "number") return false;

  return true;
}

/**
 * Validate pattern data structure
 */
function validatePattern(pattern: any): pattern is WinningPattern {
  if (!pattern || typeof pattern !== "object") return false;
  if (typeof pattern.id !== "string") return false;
  if (typeof pattern.name !== "string") return false;
  if (!Array.isArray(pattern.grid)) return false;
  if (pattern.grid.length !== 5) return false;

  for (const row of pattern.grid) {
    if (!Array.isArray(row) || row.length !== 5) return false;
    for (const cell of row) {
      if (typeof cell !== "boolean") return false;
    }
  }

  if (pattern.isBuiltIn !== undefined && typeof pattern.isBuiltIn !== "boolean")
    return false;
  if (pattern.createdAt && typeof pattern.createdAt !== "number") return false;

  return true;
}

/**
 * Validate game session data structure
 */
function validateGameSession(session: any): session is GameSession {
  if (!session || typeof session !== "object") return false;
  if (!Array.isArray(session.activeCardIds)) return false;
  if (!Array.isArray(session.activePatternIds)) return false;
  if (!Array.isArray(session.calledNumbers)) return false;

  for (const id of session.activeCardIds) {
    if (typeof id !== "string") return false;
  }

  for (const id of session.activePatternIds) {
    if (typeof id !== "string") return false;
  }

  for (const num of session.calledNumbers) {
    if (typeof num !== "number" || num < 1 || num > 75) return false;
  }

  if (session.sessionStartTime !== undefined && typeof session.sessionStartTime !== "number") return false;
  if (session.isActive !== undefined && typeof session.isActive !== "boolean") return false;

  return true;
}

/**
 * Validate entire export data structure
 */
function validateExportData(data: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    errors.push("Invalid data format");
    return { valid: false, errors };
  }

  if (typeof data.version !== "string") {
    errors.push("Missing or invalid version");
  }

  if (typeof data.exportDate !== "string") {
    errors.push("Missing or invalid export date");
  }

  if (!Array.isArray(data.cards)) {
    errors.push("Cards data must be an array");
  } else {
    data.cards.forEach((card: any, index: number) => {
      if (!validateCard(card)) {
        errors.push(`Invalid card at index ${index}`);
      }
    });
  }

  if (!Array.isArray(data.patterns)) {
    errors.push("Patterns data must be an array");
  } else {
    data.patterns.forEach((pattern: any, index: number) => {
      if (!validatePattern(pattern)) {
        errors.push(`Invalid pattern at index ${index}`);
      }
    });
  }

  if (data.gameSession !== null && !validateGameSession(data.gameSession)) {
    errors.push("Invalid game session data");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Export all app data to JSON file
 */
export async function exportData(): Promise<{
  success: boolean;
  message: string;
  filePath?: string;
}> {
  try {
    // Gather all data
    const cards = await getAllCards();
    const patterns = await getAllPatterns();
    const gameSession = await loadSession();

    const exportData: ExportData = {
      version: EXPORT_VERSION,
      exportDate: new Date().toISOString(),
      cards,
      patterns,
      gameSession,
    };

    // Create JSON string
    const jsonString = JSON.stringify(exportData, null, 2);

    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `bingo-backup-${timestamp}`;

    let fileUri: string;

    if (Platform.OS === "android") {
      // On Android, use SAF to let user choose location (including Downloads)
      const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
      
      if (!permissions.granted) {
        return {
          success: false,
          message: "Permission denied to save file",
        };
      }

      // Create file in user-selected directory
      const uri = await StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        filename,
        "application/json"
      );
      
      await StorageAccessFramework.writeAsStringAsync(uri, jsonString);
      fileUri = uri;
    } else {
      // On iOS, use share sheet
      const file = new File(Paths.cache, `${filename}.json`);
      await file.write(jsonString);
      fileUri = file.uri;

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: "Export Bingo Data",
          UTI: "public.json",
        });
      }
    }

    return {
      success: true,
      message: `Successfully exported ${cards.length} cards, ${patterns.length} patterns`,
      filePath: fileUri,
    };
  } catch (error) {
    console.error("Export error:", error);
    return {
      success: false,
      message: `Export failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Import data from JSON file
 */
export async function importData(options?: {
  replaceExisting?: boolean;
}): Promise<{
  success: boolean;
  message: string;
  imported?: {
    cards: number;
    patterns: number;
    hasGameSession: boolean;
  };
}> {
  try {
    // Pick a file
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return {
        success: false,
        message: "Import cancelled",
      };
    }

    const fileUri = result.assets[0].uri;

    // Read file content using new API
    const file = new File(fileUri);
    const jsonString = await file.text();

    // Parse JSON
    let importData: any;
    try {
      importData = JSON.parse(jsonString);
    } catch (parseError) {
      return {
        success: false,
        message: "Invalid JSON file format",
      };
    }

    // Validate data structure
    const validation = validateExportData(importData);
    if (!validation.valid) {
      return {
        success: false,
        message: `Validation failed:\n${validation.errors.join("\n")}`,
      };
    }

    // Import cards
    const replaceExisting = options?.replaceExisting ?? false;
    let importedCards = 0;
    let importedPatterns = 0;

    if (replaceExisting) {
      // Clear existing data would require additional functions
      // For now, we'll just overwrite matching IDs
    }

    for (const card of importData.cards) {
      try {
        await saveCard(card);
        importedCards++;
      } catch (error) {
        console.error("Failed to import card:", card.id, error);
      }
    }

    for (const pattern of importData.patterns) {
      try {
        // Skip built-in patterns to avoid conflicts
        if (!pattern.id.startsWith('builtin_')) {
          await savePattern(pattern);
          importedPatterns++;
        }
      } catch (error) {
        console.error("Failed to import pattern:", pattern.id, error);
      }
    }

    // Import game session if present
    let hasGameSession = false;
    if (importData.gameSession && replaceExisting) {
      try {
        await saveSession(importData.gameSession);
        hasGameSession = true;
      } catch (error) {
        console.error("Failed to import game session:", error);
      }
    }

    return {
      success: true,
      message: `Successfully imported ${importedCards} cards and ${importedPatterns} patterns${
        hasGameSession ? " with game session" : ""
      }`,
      imported: {
        cards: importedCards,
        patterns: importedPatterns,
        hasGameSession,
      },
    };
  } catch (error) {
    console.error("Import error:", error);
    return {
      success: false,
      message: `Import failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
