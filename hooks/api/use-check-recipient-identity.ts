import { useMutation } from "@tanstack/react-query";
import { checkRecipientIdentity } from "@/services/api";
import type { CheckIdentityPayload } from "@/types/recipient";

export function useCheckRecipientIdentity() {
  return useMutation({
    mutationFn: (data: CheckIdentityPayload) => checkRecipientIdentity(data),
  });
}
