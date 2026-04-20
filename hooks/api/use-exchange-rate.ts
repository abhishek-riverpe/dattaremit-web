"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";

export interface ExchangeRateData {
  rate: number;
  updatedAt: string;
  stale: boolean;
}

async function fetchExchangeRate(): Promise<ExchangeRateData | null> {
  const res = await fetch("/api/exchange-rate");
  if (!res.ok) return null;
  const json = (await res.json()) as {
    success?: boolean;
    data?: ExchangeRateData;
  };
  if (!json?.success || !json.data) return null;
  return json.data;
}

/**
 * USD → INR mid-market rate, cached for 60s client-side to match the
 * route's s-maxage. Returns `null` when the upstream provider is down —
 * callers should fall back to a placeholder.
 */
export function useExchangeRate() {
  return useQuery({
    queryKey: queryKeys.exchangeRate,
    queryFn: fetchExchangeRate,
    staleTime: 60 * 1000,
  });
}
