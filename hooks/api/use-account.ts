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
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) return false;
      return failureCount < 2;
    },
  });
}
