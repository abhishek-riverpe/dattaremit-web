"use client";

import { useCallback } from "react";
import { useClerk } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { clearClientData } from "@/lib/clear-client-data";
import { ROUTES } from "@/constants/routes";

/**
 * Single source of truth for sign-out. Wipes client-side caches first so
 * nothing leaks across users, then asks Clerk to sign out and navigate —
 * passing redirectUrl explicitly so we don't race ClerkProvider's
 * afterSignOutUrl and whatever layout-level effects may also want to
 * redirect signed-out users.
 */
export function useAppSignOut() {
  const { signOut } = useClerk();
  const queryClient = useQueryClient();

  return useCallback(async () => {
    clearClientData(queryClient);
    await signOut({ redirectUrl: ROUTES.SIGN_IN });
  }, [signOut, queryClient]);
}
