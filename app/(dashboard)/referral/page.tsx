"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useValidateReferral } from "@/hooks/api";
import { toast } from "sonner";
import { Loader2, Gift } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ReferralPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const validateMutation = useValidateReferral();

  const handleApply = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      toast.error("Please enter a referral code");
      return;
    }

    try {
      await validateMutation.mutateAsync(trimmed);
      localStorage.setItem("referral_code", trimmed);
      toast.success("Referral code applied!");
      router.push("/edit-profile");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid referral code";
      toast.error(message);
    }
  };

  const handleSkip = () => {
    localStorage.removeItem("referral_code");
    router.push("/edit-profile");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-center gap-4">
          <Gift className="h-16 w-16 text-muted-foreground" />
          <div className="text-center">
            <CardTitle className="text-2xl">Referral Code</CardTitle>
            <CardDescription>
              Have a referral code? Enter it below to get started.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="referral-code">Referral Code</Label>
            <Input
              id="referral-code"
              placeholder="Enter referral code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              disabled={validateMutation.isPending}
            />
          </div>

          {validateMutation.isError && (
            <p className="text-sm text-destructive">
              {validateMutation.error instanceof Error
                ? validateMutation.error.message
                : "Invalid referral code. Please try again."}
            </p>
          )}

          <div className="space-y-3 pt-2">
            <Button
              className="w-full"
              onClick={handleApply}
              disabled={validateMutation.isPending || !code.trim()}
            >
              {validateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Apply
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSkip}
              disabled={validateMutation.isPending}
            >
              Skip
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
