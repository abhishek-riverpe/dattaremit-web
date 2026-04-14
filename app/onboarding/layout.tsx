"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

import { useAccount } from "@/hooks/api";
import { ApiError } from "@/services/api";
import {
  computeOnboardingState,
  ONBOARDING_STEPS,
  stepIndex,
  type OnboardingStepKey,
} from "@/lib/onboarding-progress";
import { StepIndicator } from "@/components/onboarding/step-indicator";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { AccountMenu } from "@/components/account-menu";

const STEP_FROM_PATH: Record<string, OnboardingStepKey> = {
  "/onboarding/profile": "profile",
  "/onboarding/address": "address",
  "/onboarding/kyc": "kyc",
};

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="relative flex size-12 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand/30" />
        <span className="relative size-2 rounded-full bg-brand" />
      </div>
    </div>
  );
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();
  const { data: account, isLoading, error } = useAccount();

  const noProfile = error instanceof ApiError && error.status === 404;
  const state = computeOnboardingState(noProfile ? null : account);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (isLoading) return;
    if (error && !noProfile) return;

    const currentStep = STEP_FROM_PATH[pathname];

    if (!state.nextStep) {
      if (!currentStep) router.replace("/");
      return;
    }

    if (!currentStep) {
      router.replace(
        ONBOARDING_STEPS.find((s) => s.key === state.nextStep)!.href,
      );
      return;
    }

    if (stepIndex(currentStep) > stepIndex(state.nextStep)) {
      router.replace(
        ONBOARDING_STEPS.find((s) => s.key === state.nextStep)!.href,
      );
    }
  }, [
    isLoaded,
    isSignedIn,
    isLoading,
    error,
    noProfile,
    state.nextStep,
    pathname,
    router,
  ]);

  const stepKey = STEP_FROM_PATH[pathname];

  if (!isLoaded || !isSignedIn || isLoading || !stepKey) {
    return <FullScreenLoader />;
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <AuroraBackground variant="dashboard" />

      <header className="relative z-10 flex h-16 items-center justify-between border-b border-border/60 bg-background/70 px-5 backdrop-blur-xl sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="Dattapay" width={26} height={22} />
          <span className="font-semibold text-lg text-foreground">Dattapay</span>
        </Link>
        <AccountMenu />
      </header>

      <main className="relative z-10 flex flex-1 items-start justify-center px-5 py-10 sm:px-8 sm:py-16">
        <div className="w-full max-w-xl space-y-7">
          <StepIndicator current={stepKey} completed={state.completion} />
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              className="rounded-3xl border border-border bg-card/80 p-6 shadow-lift backdrop-blur-xl sm:p-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
