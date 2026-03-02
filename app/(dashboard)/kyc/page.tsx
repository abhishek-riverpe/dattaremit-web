"use client";

import { useMutation } from "@tanstack/react-query";
import { requestOnboardingKyc } from "@/services/api";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function KycPage() {
  const router = useRouter();

  const kycMutation = useMutation({
    mutationFn: requestOnboardingKyc,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Identity Verification</CardTitle>
        <CardDescription>
          Complete your KYC verification to activate your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!kycMutation.isSuccess ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <ShieldCheck className="h-16 w-16 text-muted-foreground" />
            <p className="text-center text-sm text-muted-foreground">
              Click the button below to start the identity verification process.
              A KYC link will be sent to your email.
            </p>
            {kycMutation.isError && (
              <p className="text-center text-sm text-destructive">
                {kycMutation.error instanceof Error
                  ? kycMutation.error.message
                  : "Something went wrong. Please try again."}
              </p>
            )}
            <Button
              className="w-full max-w-xs"
              onClick={() => kycMutation.mutate()}
              disabled={kycMutation.isPending}
            >
              {kycMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Start KYC
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-8">
            <Mail className="h-16 w-16 text-green-500" />
            <h3 className="text-lg font-semibold">KYC Link Sent!</h3>
            <p className="text-center text-sm text-muted-foreground">
              A KYC verification link has been sent to your email. Please check
              your inbox and complete the verification process.
            </p>
            <Button
              className="w-full max-w-xs"
              onClick={() => router.replace("/")}
            >
              Go to Home
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
