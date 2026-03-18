/**
 * IndexedDB Database Layer for My Car Rent
 * Uses the `idb` library for a promise-based API over IndexedDB.
 * Stores: entries, plates
 */
import { openDB, type DBSchema, type IDBPDatabase } from "idb";

// ── Types ──────────────────────────────────────────────────────────
export type Category = "wash" | "delivery" | "pickup";

export interface Entry {
  id: string;
  date: string; // YYYY-MM-DD
  category: Category;
  plate: string;
  price: number;
  note: string;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
}

export interface Plate {
  id: string;
  plate: string;
  createdAt: number;
}

// ── DB Schema ──────────────────────────────────────────────────────
interface MyCarRentDB extends DBSchema {
  entries: {
    key: string;
    value: Entry;
    indexes: {
      "by-date": string;
      "by-category": Category;
      "by-plate": string;
      "by-date-category": [string, Category];
    };
  };
  plates: {
    key: string;
    value: Plate;
    indexes: {
      "by-plate": string;
    };
  };
}

// ── Singleton DB ───────────────────────────────────────────────────
let dbPromise: Promise<IDBPDatabase<MyCarRentDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<MyCarRentDB>("my-car-rent-db", 1, {
      upgrade(db) {
        // Entries store
        const entryStore = db.createObjectStore("entries", { keyPath: "id" });
        entryStore.createIndex("by-date", "date");
        entryStore.createIndex("by-category", "category");
        entryStore.createIndex("by-plate", "plate");
        entryStore.createIndex("by-date-category", ["date", "category"]);

        // Plates store
        const plateStore = db.createObjectStore("plates", { keyPath: "id" });
        plateStore.createIndex("by-plate", "plate", { unique: true });
      },
    });
  }
  return dbPromise;
}

// ── ID Generator ───────────────────────────────────────────────────
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ── Entry CRUD ─────────────────────────────────────────────────────
export async function addEntry(
  data: Omit<Entry, "id" | "createdAt" | "updatedAt">
): Promise<Entry> {
  const db = await getDB();
  const now = Date.now();
  const entry: Entry = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  await db.put("entries", entry);
  return entry;
}

export async function updateEntry(
  id: string,
  data: Partial<Omit<Entry, "id" | "createdAt">>
): Promise<Entry | undefined> {
  const db = await getDB();
  const existing = await db.get("entries", id);
  if (!existing) return undefined;
  const updated: Entry = { ...existing, ...data, updatedAt: Date.now() };
  await db.put("entries", updated);
  return updated;
}

export async function deleteEntry(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("entries", id);
}

export async function getEntry(id: string): Promise<Entry | undefined> {
  const db = await getDB();
  return db.get("entries", id);
}

export async function getAllEntries(): Promise<Entry[]> {
  const db = await getDB();
  return db.getAll("entries");
}

export async function getEntriesByDate(date: string): Promise<Entry[]> {
  const db = await getDB();
  return db.getAllFromIndex("entries", "by-date", date);
}

export async function getEntriesByCategory(
  category: Category
): Promise<Entry[]> {
  const db = await getDB();
  return db.getAllFromIndex("entries", "by-category", category);
}

export async function getEntriesByDateRange(
  startDate: string,
  endDate: string
): Promise<Entry[]> {
  const db = await getDB();
  const range = IDBKeyRange.bound(startDate, endDate);
  return db.getAllFromIndex("entries", "by-date", range);
}

// ── Plate CRUD ─────────────────────────────────────────────────────
export async function addPlate(plateNumber: string): Promise<Plate> {
  const db = await getDB();
  const plate: Plate = {
    id: generateId(),
    plate: plateNumber.trim().toUpperCase(),
    createdAt: Date.now(),
  };
  await db.put("plates", plate);
  return plate;
}

export async function updatePlate(
  id: string,
  plateNumber: string
): Promise<Plate | undefined> {
  const db = await getDB();
  const existing = await db.get("plates", id);
  if (!existing) return undefined;
  const updated: Plate = {
    ...existing,
    plate: plateNumber.trim().toUpperCase(),
  };
  await db.put("plates", updated);
  return updated;
}

export async function deletePlate(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("plates", id);
}

export async function getAllPlates(): Promise<Plate[]> {
  const db = await getDB();
  return db.getAll("plates");
}

// ── Seed Sample Data ───────────────────────────────────────────────
export async function seedSampleData(): Promise<void> {
  const db = await getDB();

  // Check if data already exists
  const existingEntries = await db.count("entries");
  if (existingEntries > 0) return;

  // Sample plates
  const samplePlates = [
    "กก 1234",
    "ขข 5678",
    "คค 9012",
    "งง 3456",
    "จจ 7890",
  ];
  for (const p of samplePlates) {
    await addPlate(p);
  }

  // Generate sample entries for the past 30 days
  const categories: Category[] = ["wash", "delivery", "pickup"];
  const prices: Record<Category, number[]> = {
    wash: [200, 250, 300, 350, 400],
    delivery: [500, 600, 700, 800, 1000],
    pickup: [300, 400, 500, 600],
  };
  const notes: Record<Category, string[]> = {
    wash: ["ล้างภายนอก", "ล้างทั้งภายในภายนอก", "ล้างแว็กซ์", ""],
    delivery: ["ส่งสนามบิน", "ส่งโรงแรม", "ส่งบ้านลูกค้า", ""],
    pickup: ["เก็บจากสนามบิน", "เก็บจากโรงแรม", "เก็บจากอู่", ""],
  };

  const today = new Date();
  for (let daysAgo = 0; daysAgo < 30; daysAgo++) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toISOString().split("T")[0];

    // 2-5 entries per day
    const numEntries = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < numEntries; i++) {
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const plate =
        samplePlates[Math.floor(Math.random() * samplePlates.length)];
      const price =
        prices[cat][Math.floor(Math.random() * prices[cat].length)];
      const note =
        notes[cat][Math.floor(Math.random() * notes[cat].length)];

      await addEntry({ date: dateStr, category: cat, plate, price, note });
    }
  }
}
