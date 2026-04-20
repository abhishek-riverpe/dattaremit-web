import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMoney } from "@/services/api";
import { invalidateTransferCaches } from "@/hooks/api/invalidate-transfer-caches";
import type { SendMoneyPayload } from "@/types/transfer";

export function useSendMoney() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      idempotencyKey,
    }: {
      payload: SendMoneyPayload;
      idempotencyKey?: string;
    }) => sendMoney(payload, idempotencyKey),
    onSuccess: () => invalidateTransferCaches(qc),
  });
}
