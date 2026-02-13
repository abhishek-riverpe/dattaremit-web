import { useMutation } from "@tanstack/react-query";
import { startKyc } from "@/services/api";

export function useStartKyc() {
  return useMutation({
    mutationFn: startKyc,
  });
}
