import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(amount ?? 0);
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const PERIOD = {
  DAYS_7: "7d",
  DAYS_30: "30d",
  MONTHS_6: "6m",
  MONTHS_12: "12m",
  ALL: "all",
} as const;

export type Period = typeof PERIOD[keyof typeof PERIOD];

export function getRangeByPeriod(period: Period) {
  const now = new Date();

  switch (period) {
    case PERIOD.DAYS_7: {
      const end = now.getTime();
      const start = end - 7 * 24 * 60 * 60 * 1000;
      return { start, end };
    }

    case PERIOD.DAYS_30: {
      const end = now.getTime();
      const start = end - 30 * 24 * 60 * 60 * 1000;
      return { start, end };
    }

    case PERIOD.MONTHS_6: {
      const end = now.getTime();
      const start = new Date(
        now.getFullYear(),
        now.getMonth() - 6,
        now.getDate()
      ).getTime();
      return { start, end };
    }

    case PERIOD.MONTHS_12: {
      const end = now.getTime();
      const start = new Date(
        now.getFullYear(),
        now.getMonth() - 12,
        now.getDate()
      ).getTime();
      return { start, end };
    }

    case PERIOD.ALL:
    default:
      return { start: 0, end: now.getTime() };
  }
}




// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
