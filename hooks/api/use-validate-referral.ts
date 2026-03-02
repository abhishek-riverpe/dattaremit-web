import { useMutation } from "@tanstack/react-query";
import { validateReferralCode } from "@/services/api";

export function useValidateReferral() {
  return useMutation({
    mutationFn: (code: string) => validateReferralCode(code),
  });
}
