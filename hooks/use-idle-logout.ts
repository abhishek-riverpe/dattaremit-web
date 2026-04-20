"use client";

import { useEffect, useRef } from "react";
import { useAppSignOut } from "@/hooks/use-app-sign-out";

const DEFAULT_IDLE_MS = 15 * 60 * 1000;
const ACTIVITY_EVENTS = ["mousemove", "keydown", "pointerdown", "touchstart", "scroll"] as const;

/**
 * Signs the user out after `idleMs` of no interaction on the current tab.
 * Mount on protected layouts only; activity is tracked per-tab, and the timer
 * resets on each event so background tabs lock on schedule.
 */
export function useIdleLogout(idleMs: number = DEFAULT_IDLE_MS) {
  const signOut = useAppSignOut();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        void signOut();
      }, idleMs);
    };

    reset();
    ACTIVITY_EVENTS.forEach((ev) => window.addEventListener(ev, reset, { passive: true }));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, reset));
    };
  }, [idleMs, signOut]);
}
