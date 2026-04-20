import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendToSelf } from "@/services/api";
import { invalidateTransferCaches } from "@/hooks/api/invalidate-transfer-caches";
import type { SendToSelfPayload } from "@/types/transfer";

export function useSendToSelf() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      idempotencyKey,
    }: {
      payload: SendToSelfPayload;
      idempotencyKey?: string;
    }) => sendToSelf(payload, idempotencyKey),
    onSuccess: () => invalidateTransferCaches(qc),
  });
}
