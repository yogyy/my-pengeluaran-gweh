import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyOld(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount ?? 0);
}

type CurrencyCode = "IDR" | "USD" | string;
const localeMap: Record<CurrencyCode, string> = {
  IDR: "id-ID",
  USD: "en-US",
};

export function formatCurrency(amount: number, currencyCode: CurrencyCode) {
  const locale = localeMap[currencyCode] ?? "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: currencyCode === "IDR" ? 0 : undefined,
  }).format(amount ?? 0);
}

export function formatDate(dateStr: string | number) {
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

export type Period = (typeof PERIOD)[keyof typeof PERIOD];
const DAY = 24 * 60 * 60 * 1000;
export function getRangeByPeriod(period: Period) {
  const now = Date.now();
  const today = new Date();

  switch (period) {
    case PERIOD.DAYS_7: {
      return { start: now - 30 * DAY, end: now };
    }

    case PERIOD.DAYS_30:
      return {
        start: now - 30 * DAY,
        end: now,
      };

    case PERIOD.MONTHS_6:
      return {
        start: new Date(
          today.getFullYear(),
          today.getMonth() - 6,
          today.getDate(),
        ).getTime(),
        end: now,
      };

    case PERIOD.MONTHS_12:
      return {
        start: new Date(
          today.getFullYear(),
          today.getMonth() - 12,
          today.getDate(),
        ).getTime(),
        end: now,
      };

    case PERIOD.ALL:
    default:
      return {
        start: 0,
        end: now,
      };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any }
  ? Omit<T, "children">
  : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null;
};
