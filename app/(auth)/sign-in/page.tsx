"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema, type SignInFormData } from "@/schemas/auth.schema";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getClerkErrorMessage } from "@/utils/clerk-error";
import { AuthPageHeader } from "@/components/auth-page-header";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OAuthButtons } from "@/components/oauth-buttons";
import { OrDivider } from "@/components/or-divider";

export default function SignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pendingSecondFactor, setPendingSecondFactor] = useState(false);
  const [code, setCode] = useState("");

  const form = useForm<SignInFormData>({
    resolver: yupResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: SignInFormData) => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: data.email,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
        return;
      }

      if (signInAttempt.status === "needs_first_factor") {
        const result = await signIn.attemptFirstFactor({
          strategy: "password",
          password: data.password,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          router.replace("/");
          return;
        }

        if (result.status === "needs_second_factor") {
          await signIn.prepareSecondFactor({ strategy: "email_code" });
          setPendingSecondFactor(true);
          return;
        }
      }

      toast.error("Sign in could not be completed.");
    } catch (err: unknown) {
      toast.error(getClerkErrorMessage(err, "Sign in failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const onVerifySecondFactor = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const result = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/");
      }
    } catch (err: unknown) {
      toast.error(
        getClerkErrorMessage(err, "Verification failed. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  if (pendingSecondFactor) {
    return (
      <div>
        <AuthPageHeader
          title="Check your email"
          subtitle="Enter the verification code sent to your email"
        />
        <div className="space-y-4">
          <Input
            type="text"
            inputMode="numeric"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            autoFocus
          />
          <Button
            className="w-full"
            size="lg"
            disabled={loading || code.length < 6}
            onClick={onVerifySecondFactor}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AuthPageHeader title="Welcome back" subtitle="Sign in to your account" />
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </Form>

        <OrDivider />

        <OAuthButtons mode="sign-in" />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
