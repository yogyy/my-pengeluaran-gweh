import Dexie, { type Table } from "dexie";

export type Category =
  | "food"
  | "transport"
  | "utilities"
  | "entertainment"
  | "salary"
  | "freelance"
  | "investment"
  | "gift"
  | "other"
  | string;

export interface Tx {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: Category;
  description?: string;
  createdAt: number; // unix ms timestamp
  updatedAt?: number; // unix ms timestamp (optional)
}

export class AppDB extends Dexie {
  tx!: Table<Tx, string>;

  constructor() {
    super("app-db");
    this.version(2).stores({
      tx: "id, createdAt, [type+createdAt], category",
    });
  }
}

export const db = new AppDB();
