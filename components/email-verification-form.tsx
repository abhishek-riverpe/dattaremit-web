"use client";

import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getClerkErrorMessage } from "@/utils/clerk-error";
import { AuthPageHeader } from "@/components/auth-page-header";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface EmailVerificationFormProps {
  email: string;
}

export function EmailVerificationForm({ email }: EmailVerificationFormProps) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const onVerify = async () => {
    if (!isLoaded) return;

    if (!code.trim()) {
      setError("Verification code is required");
      return;
    }
    setError(undefined);
    setLoading(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        toast.error("Verification could not be completed.");
      }
    } catch (err: unknown) {
      toast.error(getClerkErrorMessage(err, "Verification failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AuthPageHeader
        title="Verify your email"
        subtitle={`We sent a code to ${email}`}
      />
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-2">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
        <Button
          onClick={onVerify}
          className="w-full"
          size="lg"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify Email
        </Button>
      </div>
    </div>
  );
}
