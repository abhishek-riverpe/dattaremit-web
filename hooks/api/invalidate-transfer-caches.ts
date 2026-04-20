import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";

/** Caches that every transfer mutation should invalidate on success. */
export function invalidateTransferCaches(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: queryKeys.activities.all });
  qc.invalidateQueries({ queryKey: queryKeys.account });
}
