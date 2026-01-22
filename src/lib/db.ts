import Dexie, { type Table } from "dexie";

type Category =
  | "food"
  | "transport"
  | "shopping"
  | "bills"
  | "entertainment"
  | "health"
  | "other";
export interface Expense {
  id: string; // UUID
  amount: number;
  description?: string;
  category: Category;
  date: string; // ISO date string "YYYY-MM-DD"
  createdAt: number; // unix ms timestamp
  updatedAt?: number; // unix ms timestamp (optional)
}

export interface Tx {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description?: string
  date: string
  createdAt: number; // unix ms timestamp
  updatedAt?: number; // unix ms timestamp (optional)
}

export class AppDB extends Dexie {
  expenses!: Table<Expense, string>;
  tx!: Table<Tx, string>

  constructor() {
    super("app-db");

    this.version(1).stores({
      expenses:
        "id, category, amount, description, date, createdAt, updatedAt, deletedAt",
      tx: "id, type,  amount, category, description, date, createdAt, updatedAt, deletedAt",
    });
  }
}

export const db = new AppDB();
