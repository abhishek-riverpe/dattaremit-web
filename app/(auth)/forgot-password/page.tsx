"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/schemas/forgot-password.schema";
import { getClerkErrorMessage } from "@/utils/clerk-error";

import { AuthShell } from "@/components/ui/auth-shell";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { OtpForm } from "@/components/ui/otp-form";

export default function ForgotPasswordPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [step, setStep] = useState<"form" | "otp">("form");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [otpError, setOtpError] = useState<string | undefined>();

  const emailRef = useRef("");
  const passwordRef = useRef("");

  const form = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const sendResetCode = async (email: string) => {
    await signIn!.create({
      strategy: "reset_password_email_code",
      identifier: email,
    });
  };

  const onSubmitForm = async (data: ForgotPasswordFormData) => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      await sendResetCode(data.email);
      emailRef.current = data.email;
      passwordRef.current = data.password;
      setStep("otp");
    } catch (err: unknown) {
      toast.error(getClerkErrorMessage(err, "Could not send reset code."));
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async () => {
    if (!isLoaded) return;
    setOtpError(undefined);
    setLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: passwordRef.current,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Password updated.");
        router.replace("/");
        return;
      }

      if (result.status === "needs_second_factor") {
        setOtpError(
          "Additional verification required. Please contact support.",
        );
        return;
      }

      setOtpError("Password reset could not be completed.");
    } catch (err: unknown) {
      setOtpError(
        getClerkErrorMessage(err, "Verification failed. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (!isLoaded || !emailRef.current) return;
    try {
      await sendResetCode(emailRef.current);
      setCode("");
      setOtpError(undefined);
      toast.success("Code sent. Check your inbox.");
    } catch (err: unknown) {
      toast.error(getClerkErrorMessage(err, "Couldn't resend the code."));
    }
  };

  if (step === "otp") {
    return (
      <AuthShell
        eyebrow="Verify"
        title={
          <>
            Check your
            <br />
            <span className="text-brand">inbox</span>.
          </>
        }
        subtitle={
          <>
            We sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">
              {emailRef.current}
            </span>
            .
          </>
        }
      >
        <OtpForm
          value={code}
          onChange={(v) => {
            setCode(v);
            if (otpError) setOtpError(undefined);
          }}
          onSubmit={onVerifyOtp}
          loading={loading}
          error={otpError}
          submitLabel="Reset password"
          onResend={onResend}
        />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Reset password"
      title={
        <>
          Forgot your
          <br />
          <span className="text-brand">password</span>?
        </>
      }
      subtitle="Enter your email and a new password. We'll email you a code to confirm the change."
      footer={
        <span>
          Remembered it?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-foreground underline decoration-brand decoration-2 underline-offset-4 hover:decoration-foreground"
          >
            Sign in
          </Link>
        </span>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-4">
          <TextField
            control={form.control}
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
          <TextField
            control={form.control}
            name="password"
            label="New password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
          <TextField
            control={form.control}
            name="confirmPassword"
            label="Confirm new password"
            type="password"
            placeholder="Re-enter your new password"
            autoComplete="new-password"
          />
          <Button
            type="submit"
            variant="brand"
            size="lg"
            className="w-full"
            loading={loading}
          >
            Send reset code
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
}
