"use client";

import { Suspense } from "react";
import { PersonalInfoForm } from "@/components/personal-info-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useOnboardingRouter } from "@/hooks/use-onboarding-router";

function Fallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-72" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-11 w-full" />
      ))}
    </div>
  );
}

export default function OnboardingProfilePage() {
  const { goToNext } = useOnboardingRouter();
  return (
    <Suspense fallback={<Fallback />}>
      <PersonalInfoForm
        chromeless
        title="Tell us about you"
        description="A few basics to set up your account. We'll never share these."
        submitLabel={{ create: "Continue", update: "Save & continue" }}
        onAfterSubmit={() => goToNext()}
      />
    </Suspense>
  );
}
