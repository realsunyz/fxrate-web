"use client";

import * as React from "react";
import { Check, ChevronsUpDown, ArrowRight, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Currencies } from "@/components/fetch";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useI18n, tCurrency } from "@/lib/i18n";

type SelectProps = {
  onSelect: (currency: string) => void;
  disabled?: boolean;
  onRefresh?: () => void;
  value?: string;
  refreshing?: boolean;
};

type RefreshState = "idle" | "loading" | "success";

export function SelectCurrency({
  onSelect,
  disabled = false,
  onRefresh,
  value: controlledValue,
  refreshing = false,
}: SelectProps) {
  const { t } = useI18n();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(controlledValue || "");
  const [refreshState, setRefreshState] = React.useState<RefreshState>("idle");
  const prevRefreshingRef = React.useRef(refreshing);
  const resetTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    setValue(controlledValue || "");
  }, [controlledValue]);

  React.useEffect(() => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    if (disabled) {
      setRefreshState("idle");
      prevRefreshingRef.current = refreshing;
      return;
    }

    if (refreshing) {
      setRefreshState("loading");
    } else if (prevRefreshingRef.current) {
      setRefreshState("success");
      resetTimerRef.current = setTimeout(() => {
        setRefreshState("idle");
        resetTimerRef.current = null;
      }, 1200);
    }

    prevRefreshingRef.current = refreshing;
  }, [refreshing, disabled]);

  React.useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleSelect = (currency: string) => {
    setValue(currency);
    onSelect(currency);
    setOpen(false);
  };

  const handleRefreshClick = () => {
    if (disabled) return;
    setRefreshState("loading");
    onRefresh?.();
  };

  return (
    <div className="flex items-center gap-2 mb-4 mt-4 flex-nowrap overflow-x-auto">
      <div className="flex items-center gap-1 sm:gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[120px] sm:w-[150px] justify-between"
              aria-label={t("select.source")}
              disabled={disabled}
            >
              {value ? tCurrency(value, t) : t("currency.USD")}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[150px] p-0">
            <Command>
              <CommandInput placeholder={t("select.search")} />
              <CommandList>
                <CommandEmpty>{t("select.empty")}</CommandEmpty>
                <CommandGroup>
                  {Currencies.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      keywords={item.keywords}
                      onSelect={(currentValue) => handleSelect(currentValue)}
                    >
                      <item.flag className="mr-2 h-4 w-4" />
                      {tCurrency(item.value, t)}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === item.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <ArrowRight className="mx-1 sm:mx-2 h-4 w-4" />
      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          variant="outline"
          className="w-[120px] sm:w-[150px] justify-between"
          aria-label={t("select.target")}
          disabled
        >
          {t("currency.CNY")}
          <ChevronsUpDown className="opacity-50" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Refresh rates"
          onClick={handleRefreshClick}
          disabled={disabled}
          data-state={refreshState}
          className={cn(
            "relative overflow-hidden transition-colors duration-300 ease-out",
            refreshState === "success" ? "text-emerald-500" : undefined,
          )}
        >
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out",
              refreshState === "success" ? "opacity-0 scale-80" : "opacity-100 scale-100",
            )}
          >
            <RefreshCw className={cn("h-4 w-4", refreshState === "loading" && "animate-spin")} />
          </span>
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out",
              refreshState === "success" ? "opacity-100 scale-100" : "opacity-0 scale-90",
            )}
          >
            <Check />
          </span>
          <span className="opacity-0">
            <RefreshCw className="h-4 w-4" />
          </span>
        </Button>
      </div>
    </div>
  );
}
