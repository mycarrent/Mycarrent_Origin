/**
 * Backup & Restore Utility for IndexedDB
 * Allows users to export and import their data as JSON
 */

import { getAllEntries, getAllPlates, addEntry, addPlate, type Entry, type Plate } from "./db";

export interface BackupData {
  version: string;
  timestamp: number;
  entries: Entry[];
  plates: Plate[];
}

/**
 * Create a backup of all database data
 * @returns BackupData object containing all entries and plates
 */
export async function createBackup(): Promise<BackupData> {
  try {
    const entries = await getAllEntries();
    const plates = await getAllPlates();

    return {
      version: "1.0",
      timestamp: Date.now(),
      entries,
      plates,
    };
  } catch (error) {
    throw new Error(`Failed to create backup: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Export backup as JSON file and trigger download
 * @param backup - BackupData to export
 * @param filename - Optional filename (default: my-car-rent-backup-{timestamp}.json)
 */
export function downloadBackupFile(backup: BackupData, filename?: string): void {
  try {
    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename || `my-car-rent-backup-${new Date(backup.timestamp).toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(`Failed to download backup: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Validate backup file structure
 * @param data - Data to validate
 * @returns true if valid, throws error otherwise
 */
function validateBackupData(data: unknown): data is BackupData {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid backup file: not an object");
  }

  const backup = data as Record<string, unknown>;

  if (typeof backup.version !== "string") {
    throw new Error("Invalid backup file: missing version");
  }

  if (typeof backup.timestamp !== "number") {
    throw new Error("Invalid backup file: missing timestamp");
  }

  if (!Array.isArray(backup.entries)) {
    throw new Error("Invalid backup file: entries is not an array");
  }

  if (!Array.isArray(backup.plates)) {
    throw new Error("Invalid backup file: plates is not an array");
  }

  // Validate entries structure
  for (const entry of backup.entries) {
    if (typeof entry !== "object" || entry === null) {
      throw new Error("Invalid backup file: invalid entry structure");
    }
    const e = entry as Record<string, unknown>;
    if (typeof e.id !== "string" || typeof e.date !== "string" || typeof e.price !== "number") {
      throw new Error("Invalid backup file: entry missing required fields");
    }
  }

  // Validate plates structure
  for (const plate of backup.plates) {
    if (typeof plate !== "object" || plate === null) {
      throw new Error("Invalid backup file: invalid plate structure");
    }
    const p = plate as Record<string, unknown>;
    if (typeof p.id !== "string" || typeof p.plate !== "string") {
      throw new Error("Invalid backup file: plate missing required fields");
    }
  }

  return true;
}

/**
 * Restore backup data to database
 * @param backup - BackupData to restore
 * @param options - Restore options
 * @returns Object with counts of restored items
 */
export async function restoreBackup(
  backup: BackupData,
  options: { clearExisting?: boolean } = {}
): Promise<{ entriesRestored: number; platesRestored: number }> {
  try {
    // Validate backup data
    validateBackupData(backup);

    // Note: We don't clear existing data by default to avoid data loss
    // Users should be warned about potential duplicates

    let entriesRestored = 0;
    let platesRestored = 0;

    // Restore plates first (entries may reference them)
    for (const plate of backup.plates) {
      try {
        // Create new entry without id to avoid conflicts
        await addPlate(plate.plate, plate.model, plate.color);
        platesRestored++;
      } catch (error) {
        // Skip if plate already exists (unique constraint)
        console.warn(`Skipped plate ${plate.plate}:`, error);
      }
    }

    // Restore entries
    for (const entry of backup.entries) {
      try {
        // Create new entry without id to avoid conflicts
        await addEntry({
          date: entry.date,
          category: entry.category,
          plate: entry.plate,
          price: entry.price,
          note: entry.note,
          customTitle: entry.customTitle,
        });
        entriesRestored++;
      } catch (error) {
        console.warn(`Skipped entry:`, error);
      }
    }

    return { entriesRestored, platesRestored };
  } catch (error) {
    throw new Error(`Failed to restore backup: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Parse JSON file from input element
 * @param file - File from input[type="file"]
 * @returns Parsed BackupData
 */
export async function parseBackupFile(file: File): Promise<BackupData> {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    validateBackupData(data);
    return data;
  } catch (error) {
    throw new Error(`Failed to parse backup file: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Format file size for display
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Format timestamp for display
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string
 */
export function formatBackupDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
