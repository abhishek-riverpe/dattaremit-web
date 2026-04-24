import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { unlinkRecipient } from "@/services/api";

export function useUnlinkRecipient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unlinkRecipient(id),
    onSuccess: (_res, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.recipients.all });
      qc.invalidateQueries({ queryKey: queryKeys.recipients.detail(id) });
    },
  });
}
