"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  CheckCircle2,
  Clock,
  Mail,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { requestOnboardingKyc } from "@/services/api";
import { useAccount } from "@/hooks/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/page-header";

const STATUS_META: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive";
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  INITIAL: { label: "Not started", variant: "secondary", icon: ShieldCheck },
  PENDING: { label: "In review", variant: "secondary", icon: Clock },
  ACTIVE: { label: "Verified", variant: "default", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", variant: "destructive", icon: XCircle },
};

export default function KycPage() {
  const router = useRouter();
  const { data: account, isLoading } = useAccount();
  const requestLink = useMutation({ mutationFn: requestOnboardingKyc });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-72" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  const status = (account?.accountStatus ?? "INITIAL") as keyof typeof STATUS_META;
  const meta = STATUS_META[status] ?? STATUS_META.INITIAL;
  const StatusIcon = meta.icon;
  const indianStatus = account?.indianKycStatus ?? "NONE";
  const canStartPrimary = status === "INITIAL" || status === "REJECTED";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Verification"
        title={
          <>
            Prove it&apos;s{" "}
            <span className="text-brand">you</span>.
          </>
        }
        subtitle="A quick check unlocks transfers across the network."
      />

      <Card variant="elevated" className="overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-6">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold text-xl text-foreground">
                Primary KYC
              </h2>
              <p className="text-sm text-muted-foreground">
                Email-based verification through our partner.
              </p>
            </div>
          </div>
          <Badge variant={meta.variant} className="gap-1">
            <StatusIcon className="size-3" />
            {meta.label}
          </Badge>
        </div>
        <div className="space-y-4 p-6">
          {requestLink.isSuccess ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
                <Mail className="size-5" />
              </div>
              <p className="text-sm text-foreground">
                We sent a verification link to your email.
              </p>
              <Button
                variant="outline"
                onClick={() => requestLink.reset()}
              >
                <RefreshCw className="size-4" />
                Resend link
              </Button>
            </div>
          ) : (
            <>
              {canStartPrimary ? (
                <p className="text-sm text-muted-foreground">
                  Click below to send a secure verification link to your email.
                </p>
              ) : status === "PENDING" ? (
                <p className="text-sm text-muted-foreground">
                  Your KYC is under review. We&apos;ll email you when a decision
                  is made.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Your primary KYC is verified.
                </p>
              )}
              {requestLink.isError && (
                <p className="text-sm text-destructive">
                  {requestLink.error instanceof Error
                    ? requestLink.error.message
                    : "Something went wrong."}
                </p>
              )}
              <div className="flex gap-2">
                {canStartPrimary && (
                  <Button
                    variant="brand"
                    onClick={() => requestLink.mutate()}
                    loading={requestLink.isPending}
                  >
                    Send verification link
                  </Button>
                )}
                {status === "ACTIVE" && (
                  <Button variant="brand" onClick={() => router.push("/")}>
                    Go to home
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </Card>

      <Card variant="elevated" className="overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-6">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold text-xl text-foreground">
                Indian KYC
              </h2>
              <p className="text-sm text-muted-foreground">
                Required to receive money into an Indian bank account.
              </p>
            </div>
          </div>
          <Badge
            variant={
              indianStatus === "APPROVED"
                ? "default"
                : indianStatus === "PENDING"
                  ? "secondary"
                  : indianStatus === "REJECTED" || indianStatus === "FAILED"
                    ? "destructive"
                    : "outline"
            }
          >
            {indianStatus}
          </Badge>
        </div>
        <div className="p-6">
          {indianStatus === "PENDING" ? (
            <p className="text-sm text-muted-foreground">
              Your Indian KYC is being processed. This typically takes 3–5
              minutes.
            </p>
          ) : indianStatus === "APPROVED" ? (
            <p className="text-sm text-muted-foreground">
              Indian KYC verified — you can add an Indian bank account.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Submit your Aadhar and PAN to verify your Indian identity. Data
                is encrypted in your browser before being sent.
              </p>
              <Button asChild variant="brand">
                <Link href="/kyc/indian">
                  {indianStatus === "REJECTED" || indianStatus === "FAILED"
                    ? "Resubmit Indian KYC"
                    : "Start Indian KYC"}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
