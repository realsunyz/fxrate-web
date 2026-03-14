"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { US, CA, HK, EU, GB, JP, KR, SG, RU, CH, AE, TW } from "country-flag-icons/react/3x2";
import { API_BASE_PATH } from "@/lib/api";

export const bankMap: { [key: string]: string } = {
  cmb: "cmb",
  boc: "boc",
  cib: "cib",
  cibHuanyu: "cibHuanyu",
  bocom: "bocom",
  icbc: "icbc",
  ccb: "ccb",
  pab: "pab",
  psbc: "psbc",
  citiccn: "citic.cn",
  hsbccn: "hsbc.cn",
  upi: "unionpay",
  pboc: "pboc",
  //  visa: "visa",
};

function tzConverter(httpDate: string): string {
  const d = new Date(httpDate);
  if (isNaN(d.getTime())) return httpDate;
  const plus8 = new Date(d.getTime() + 8 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${plus8.getUTCFullYear()}-${pad(plus8.getUTCMonth() + 1)}-${pad(
    plus8.getUTCDate(),
  )} ${pad(plus8.getUTCHours())}:${pad(plus8.getUTCMinutes())}:${pad(plus8.getUTCSeconds())}`;
}

export type CurrencyOption = {
  value: string;
  flag: typeof US;
  keywords: string[];
};

export const Currencies: CurrencyOption[] = [
  { value: "USD", flag: US, keywords: ["usd", "美元", "美金", "dollar", "usa"] },
  { value: "CAD", flag: CA, keywords: ["cad", "加元", "加拿大", "canadian"] },
  { value: "HKD", flag: HK, keywords: ["hkd", "港元", "港币", "香港"] },
  { value: "EUR", flag: EU, keywords: ["eur", "欧元", "歐元", "euro", "欧盟"] },
  { value: "GBP", flag: GB, keywords: ["gbp", "英镑", "英鎊", "pound", "英国"] },
  { value: "JPY", flag: JP, keywords: ["jpy", "日元", "日圓", "yen", "日本"] },
  { value: "KRW", flag: KR, keywords: ["krw", "韩元", "韓元", "won", "韩国"] },
  { value: "SGD", flag: SG, keywords: ["sgd", "新元", "新加坡元", "singapore"] },
  { value: "RUB", flag: RU, keywords: ["rub", "卢布", "盧布", "ruble", "俄罗斯"] },
  { value: "CHF", flag: CH, keywords: ["chf", "瑞郎", "法郎", "swiss"] },
  { value: "TWD", flag: TW, keywords: ["twd", "新台币", "新臺幣", "台币", "taiwan"] },
  { value: "AED", flag: AE, keywords: ["aed", "迪拉姆", "阿联酋", "dirham", "阿聯酋"] },
];

export type CurrencyData = {
  bank: string;
  sellRemit: number | null;
  sellCash: number | null;
  buyRemit: number | null;
  buyCash: number | null;
  middle: number | null;
  updated: string | null;
  hidden: boolean;
};

type FetchOptions = {
  onAuthExpired?: () => void;
  initialRates?: CurrencyData[];
  preserveInitialData?: boolean;
  onRatesChange?: (rates: CurrencyData[], loading: boolean) => void;
};

const useFetchRates = (
  fromCurrency: string,
  toCurrency: string,
  authenticated?: boolean,
  options?: FetchOptions,
) => {
  const { t } = useI18n();
  const onAuthExpired = options?.onAuthExpired;
  const latestOnRatesChange = options?.onRatesChange;
  const [rates, setRates] = useState<CurrencyData[]>(() => options?.initialRates ?? []);
  const [loading, setLoading] = useState<boolean>(
    () => !(options?.initialRates && options.initialRates.length > 0),
  );
  const preserveInitialDataRef = useRef(Boolean(options?.preserveInitialData));
  const ratesRef = useRef(rates);

  useEffect(() => {
    ratesRef.current = rates;
  }, [rates]);

  const fetchAll = useCallback(
    (withRefresh: boolean) => {
      if (!authenticated) {
        setRates([]);
        setLoading(true);
        return;
      }

      const bankNames = Object.keys(bankMap);
      const shouldPreserveExisting =
        preserveInitialDataRef.current && !withRefresh && ratesRef.current.length > 0;
      if (shouldPreserveExisting) {
        preserveInitialDataRef.current = false;
      }

      if (!shouldPreserveExisting) {
        const initialRates: CurrencyData[] = bankNames.map((bank) => ({
          bank,
          sellRemit: null,
          sellCash: null,
          buyRemit: null,
          buyCash: null,
          middle: null,
          updated: null,
          hidden: false,
        }));
        setRates(initialRates);
      }

      setLoading(true);
      let loadedCount = 0;
      let expiredHandled = false;
      const handleExpired = () => {
        if (expiredHandled) return;
        expiredHandled = true;
        onAuthExpired?.();
      };
      const handleInvalidThenReload = () => {
        if (expiredHandled) return;
        expiredHandled = true;
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      };
      const includesInvalidToken = (msg: unknown) =>
        typeof msg === "string" && msg.toLowerCase().includes("token invalid");
      const refreshQuery = withRefresh ? "&refresh=true" : "";
      bankNames.forEach((bankName) => {
        const bankCode = bankMap[bankName];
        fetch(
          `${API_BASE_PATH}/${bankCode}/${fromCurrency}/${toCurrency}?precision=2&amount=100&fees=0${refreshQuery}`,
          {
            credentials: "include",
          },
        )
          .then(async (response) => {
            let data: any = null;
            try {
              data = await response.json();
            } catch {}
            if (data) {
              if (
                (response.status === 401 || response.status === 403) &&
                includesInvalidToken(data.error)
              ) {
                handleInvalidThenReload();
                return;
              }
              if (
                response.status === 403 &&
                typeof data.error === "string" &&
                data.error.toLowerCase().includes("token expired")
              ) {
                handleExpired();
                return;
              }
            }
            if (!response.ok) {
              throw new Error(`HTTP ERROR: ${response.status}`);
            }
            return data;
          })
          .then((data) => {
            if (!data) return;
            if (data?.success === false) {
              setRates((prevRates) =>
                prevRates.map((item) =>
                  item.bank === bankName
                    ? {
                        ...item,
                        buyRemit: 0,
                        buyCash: 0,
                        sellRemit: 0,
                        sellCash: 0,
                        middle: 0,
                        updated: t("table.unavailable"),
                      }
                    : item,
                ),
              );
              return;
            }

            const shouldHide =
              data?.provided === false && data?.updated === "Thu, Jan 01 1970 00:00:00 GMT";
            setRates((prevRates) =>
              prevRates.map((item) =>
                item.bank === bankName
                  ? {
                      ...item,
                      buyRemit: data.remit,
                      buyCash: data.cash,
                      middle: data.middle,
                      updated: tzConverter(data.updated),
                      hidden: item.hidden || Boolean(shouldHide),
                    }
                  : item,
              ),
            );
          })
          .catch(() => {
            setRates((prevRates) =>
              prevRates.map((item) =>
                item.bank === bankName
                  ? {
                      ...item,
                      buyRemit: 0,
                      buyCash: 0,
                      middle: 0,
                      updated: t("table.loading"),
                    }
                  : item,
              ),
            );
          })
          .finally(() => {
            loadedCount++;
            if (loadedCount === bankNames.length) {
              setLoading(false);
            }
          });
        fetch(
          `${API_BASE_PATH}/${bankCode}/${toCurrency}/${fromCurrency}?reverse=true&precision=2&amount=100&fees=0${refreshQuery}`,
          {
            credentials: "include",
          },
        )
          .then(async (response) => {
            let data: any = null;
            try {
              data = await response.json();
            } catch {}
            if (data) {
              if (
                (response.status === 401 || response.status === 403) &&
                includesInvalidToken(data.error)
              ) {
                handleInvalidThenReload();
                return;
              }
              if (
                response.status === 403 &&
                typeof data.error === "string" &&
                data.error.toLowerCase().includes("token expired")
              ) {
                handleExpired();
                return;
              }
            }
            if (!response.ok) {
              throw new Error(`HTTP ERROR: ${response.status}`);
            }
            return data;
          })
          .then((data) => {
            if (!data) return;
            if (data?.success === false) {
              setRates((prevRates) =>
                prevRates.map((item) =>
                  item.bank === bankName
                    ? {
                        ...item,
                        sellRemit: 0,
                        sellCash: 0,
                      }
                    : item,
                ),
              );
              return;
            }

            const shouldHide =
              data?.provided === false && data?.updated === "Thu, Jan 01 1970 00:00:00 GMT";
            setRates((prevRates) =>
              prevRates.map((item) =>
                item.bank === bankName
                  ? {
                      ...item,
                      sellRemit: data.remit,
                      sellCash: data.cash,
                      hidden: item.hidden || Boolean(shouldHide),
                    }
                  : item,
              ),
            );
          })
          .catch(() => {
            setRates((prevRates) =>
              prevRates.map((item) =>
                item.bank === bankName
                  ? {
                      ...item,
                      sellRemit: 0,
                      sellCash: 0,
                    }
                  : item,
              ),
            );
          });
      });
    },
    [authenticated, fromCurrency, onAuthExpired, t, toCurrency],
  );

  useEffect(() => {
    fetchAll(false);
  }, [fetchAll]);

  useEffect(() => {
    latestOnRatesChange?.(rates, loading);
  }, [rates, loading, latestOnRatesChange]);

  const refresh = () => fetchAll(true);

  return { rates: rates.filter((r) => !r.hidden), error: "", loading, refresh };
};

export default useFetchRates;
