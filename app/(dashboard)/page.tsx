"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAccount } from "@/hooks/api";
import { ApiError } from "@/services/api";
import { splitName } from "@/utils/profile-helpers";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { user: clerkUser } = useUser();
  const router = useRouter();

  const { data: account, isLoading, error, refetch } = useAccount();
  const user = account?.user;

  const needsProfile = error instanceof ApiError && error.status === 404;
  const realError =
    error && !needsProfile
      ? error instanceof Error
        ? error.message
        : "Failed to load data"
      : null;

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-4 h-4 w-80" />
      </div>
    );
  }

  if (realError) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="mb-4 text-center text-destructive">{realError}</p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (needsProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="mb-2 text-center text-xl font-bold">
          Welcome, {clerkUser?.emailAddresses[0]?.emailAddress}
        </h1>
        <p className="mb-6 text-center text-muted-foreground">
          Complete your profile to get started
        </p>
        <Button onClick={() => router.push("/edit-profile")}>
          Complete Profile
        </Button>
      </div>
    );
  }

  const { firstName } = splitName(user?.name || "");

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <Image src="/logo.png" alt="Logo" width={64} height={54} className="mb-6" />
      <h1 className="text-2xl font-bold">
        {firstName ? `Welcome back, ${firstName}!` : "Welcome!"}
      </h1>
      <p className="mt-3 text-muted-foreground">
        We&apos;re building something great for you.
        <br />
        Full features are coming soon — stay tuned!
      </p>
    </div>
  );
}
