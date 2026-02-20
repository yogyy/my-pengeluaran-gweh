import { writable } from "svelte/store";

const STORAGE_KEY = "currency";
const DEFAULT = "IDR";

function createCurrencyStore() {
  const initial =
    typeof localStorage !== "undefined"
      ? (localStorage.getItem(STORAGE_KEY) ?? DEFAULT)
      : DEFAULT;

  const { subscribe, set } = writable(initial);

  return {
    subscribe,
    set: (value: string) => {
      localStorage.setItem(STORAGE_KEY, value);
      set(value);
    },
  };
}

export const currency = createCurrencyStore();
