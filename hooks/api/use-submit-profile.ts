import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { createZynkEntity } from "@/services/api";

export function useSubmitProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const idempotencyKey = crypto.randomUUID();
      await createZynkEntity(idempotencyKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.account });
    },
  });
}
