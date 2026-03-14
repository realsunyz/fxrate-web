import type { CurrencyData } from "@/components/fetch";

export type CurrencyTableCache = {
  fromCurrency: string;
  authenticated: boolean;
  consentChecked: boolean;
  rates: CurrencyData[];
  loading: boolean;
  timestamp: number;
};

let cache: CurrencyTableCache | null = null;

export function loadCurrencyTableCache() {
  return cache;
}

export function saveCurrencyTableCache(next: CurrencyTableCache) {
  cache = next;
}
