"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "zh" | "en";

type Dict = Record<string, string>;

type Dictionaries = {
  zh: Dict;
  en: Dict;
};

const dictionaries: Dictionaries = {
  zh: {
    // General
    "navbar.title": "fxRate Web",
    "settings.preferences": "偏好",
    "settings.switchLanguage": "English",
    "tos.back": "返回首页",
    // Help Dialog
    "help.title": "帮助",
    "help.description": "您可能需要的信息和设置",
    "help.info.title": "信息",
    "help.info.line1": "“兴业寰宇”指由兴业银行发行的“寰宇人生卡”，持卡人可享受结汇购汇交易费率5折优惠。",
    "help.info.line2": "“银联国际”为卡组织汇率，仅适用于使用该卡组织所发行银行卡进行的外币交易，不可手动购汇购钞。",
    "help.info.line3": "点击货币选择栏右侧的刷新按钮可强制更新各银行汇率。为保证服务稳定，请勿频繁点击。",
    // Footer
    "footer.build": "fxRate Web (v{{version}}-{{id}})",
    "footer.copyright": "版权所有 © 2025 Yanzheng Sun。保留所有权利。",
    // Table
    "columns.bank": "银行",
    "columns.sellRemit": "购汇价",
    "columns.buyRemit": "结汇价",
    "columns.buyCash": "结钞价",
    "columns.middle": "中间价",
    "columns.updated": "更新时间",
    "table.loading": "数据获取中",
    "table.unavailable": "无法获取数据",
    "table.invalidToken": "Token 错误，请刷新页面",
    "select.source": "源货币",
    "select.target": "目标货币",
    "select.search": "搜索",
    "select.empty": "暂不支持该货币",
    // Consent
    "consent.agreePrefix": "使用本服务即视为同意我们的",
    "consent.policy": "服务政策",
    "consent.agreeConfirm": "请先勾选以继续",
    // Currency
    "currency.USD": "美元",
    "currency.CAD": "加元",
    "currency.HKD": "港元",
    "currency.EUR": "欧元",
    "currency.GBP": "英镑",
    "currency.JPY": "日元",
    "currency.KRW": "韩元",
    "currency.SGD": "新元",
    "currency.RUB": "卢布",
    "currency.CHF": "瑞郎",
    "currency.TWD": "新台币",
    "currency.AED": "迪拉姆",
    "currency.CNY": "人民币",
    // Bank
    "bank.cmb": "招商银行",
    "bank.boc": "中国银行",
    "bank.cib": "兴业银行",
    "bank.cibHuanyu": "兴业寰宇",
    "bank.bocom": "交通银行",
    "bank.icbc": "工商银行",
    "bank.ccb": "建设银行",
    "bank.pab": "平安银行",
    "bank.psbc": "邮政储蓄",
    "bank.citiccn": "中信银行",
    "bank.hsbccn": "汇丰中国",
    "bank.upi": "银联国际",
    "bank.pboc": "人民银行",
    "bank.visa": "维萨VISA",
  },
  en: {
    // General
    "navbar.title": "fxRate Web",
    "settings.preferences": "Preferences",
    "settings.switchLanguage": "中文 (简体)",
    "tos.back": "Back to Home",
    // Help Dialog
    "help.title": "Help",
    "help.description": "Information and Settings you may need",
    "help.info.title": "Info",
    "help.info.line1": "\"CIB HY\" refers to \"Huanyu Life Card\" issued by China Industrial Bank. Cardholders are entitled to a 50% discount on conversion fees for foreign exchange purchases and settlements.",
    "help.info.line2": "\"UnionPay\" and \"VISA\" refers to exchange rates published by the respective card associations. These rates apply only to foreign currency transactions conducted with cards issued by the corresponding card association.",
    "help.info.line3": "Click the refresh button next to the currency selector to force-update rates. To keep the service stable, please avoid frequent clicks.",
    // Footer
    "footer.build": "fxRate Web (v{{version}}-{{id}})",
    "footer.copyright": "Copyright © 2025 Yanzheng Sun. All rights reserved.",
    // Table
    "columns.bank": "Bank",
    "columns.sellRemit": "Sell (Remit)",
    "columns.buyRemit": "Buy (Remit)",
    "columns.buyCash": "Buy (Cash)",
    "columns.middle": "Mid Market",
    "columns.updated": "Updated",
    "table.loading": "Loading",
    "table.unavailable": "Unavailable",
    "table.invalidToken": "Invalid Token, Please Refresh Page",
    "select.source": "Source",
    "select.target": "Target",
    "select.search": "Search",
    "select.empty": "Currency Not Supported Yet",
    // Consent
    "consent.agreePrefix": "By using this service, you agree to our",
    "consent.policy": "Terms of Service",
    "consent.agreeConfirm": "Please agree first to continue.",
    // Currency
    "currency.USD": "USD",
    "currency.CAD": "CAD",
    "currency.HKD": "HKD",
    "currency.EUR": "EUR",
    "currency.GBP": "GBP",
    "currency.JPY": "JPY",
    "currency.KRW": "KRW",
    "currency.SGD": "SGD",
    "currency.RUB": "RUB",
    "currency.CHF": "CHF",
    "currency.TWD": "TWD",
    "currency.AED": "AED",
    "currency.CNY": "CNY",
    // Bank
    "bank.cmb": "CMB",
    "bank.boc": "BOC",
    "bank.cib": "CIB",
    "bank.cibHuanyu": "CIB HY",
    "bank.bocom": "BOCOM",
    "bank.icbc": "ICBC",
    "bank.ccb": "CCB",
    "bank.pab": "PAB",
    "bank.psbc": "PSBC",
    "bank.citiccn": "CITIC CN",
    "bank.hsbccn": "HSBC CN",
    "bank.upi": "UnionPay",
    "bank.pboc": "PBOC",
    "bank.visa": "VISA",
  },
};

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("locale") : null;
    if (saved === "zh" || saved === "en") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("locale", l);
      document.documentElement.lang = l === "zh" ? "zh-Hans" : "en";
    }
  };

  const t = useMemo(() => {
    const dict = dictionaries[locale];
    return (key: string, params?: Record<string, string | number>) => {
      const template = dict[key] ?? key;
      if (!params) return template;
      return Object.keys(params).reduce((acc, k) => acc.replaceAll(`{{${k}}}`, String(params[k])), template);
    };
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function tCurrency(code: string, t: I18nContextValue["t"]) {
  return t(`currency.${code}`);
}

export function tBankName(nameInChinese: string, t: I18nContextValue["t"]) {
  return t(`bank.${nameInChinese}`);
}
