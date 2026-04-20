import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { getAccount, ApiError } from "@/services/api";

export function useAccount() {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.account,
    queryFn: getAccount,
    enabled: !!isSignedIn,
    staleTime: 0,
    gcTime: 30_000,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
