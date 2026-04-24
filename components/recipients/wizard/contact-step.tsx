"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { ArrowRight, Mail, User } from "lucide-react";

import {
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { PhoneInput } from "@/components/phone-input";
import { useCheckEmailAvailability } from "@/hooks/api";
import { stripPhonePrefix } from "@/lib/phone-utils";
import type { RecipientFormData } from "@/schemas/recipient.schema";

interface ContactStepProps {
  onContinue: () => void;
  checking?: boolean;
}

/**
 * Step 1 of the new-recipient wizard — just enough to identify the person
 * so we can run a dedup check before asking for address details.
 */
export function ContactStep({ onContinue, checking }: ContactStepProps) {
  const form = useFormContext<RecipientFormData>();

  const emailValue =
    useWatch({ control: form.control, name: "email" }) ?? "";
  const { available, isChecking } = useCheckEmailAvailability(
    emailValue,
    "recipient",
  );
  const emailTaken = available === false;

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h2 className="font-semibold text-2xl text-foreground">
          Who are you sending to?
        </h2>
        <p className="text-sm text-muted-foreground">
          We&rsquo;ll check if they&rsquo;re already verified so you can skip
          KYC.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          control={form.control}
          name="firstName"
          label="First name"
          placeholder="Asha"
          leading={<User className="size-4" />}
        />
        <TextField
          control={form.control}
          name="lastName"
          label="Last name"
          placeholder="Patel"
        />
      </div>

      <div className="space-y-1.5">
        <TextField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          placeholder="asha@example.com"
          leading={<Mail className="size-4" />}
        />
        {emailTaken && (
          <p className="text-sm text-destructive">
            You already have a recipient with this email.
          </p>
        )}
        {isChecking && !emailTaken && (
          <p className="text-sm text-muted-foreground">Checking availability…</p>
        )}
      </div>

      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <PhoneInput
              label="Phone"
              value={form.getValues("phoneNumberPrefix") + field.value}
              onChangePhone={(fullPhone) => {
                field.onChange(
                  stripPhonePrefix(
                    fullPhone,
                    form.getValues("phoneNumberPrefix"),
                  ),
                );
              }}
              onChangeCountry={(dialCode) =>
                form.setValue("phoneNumberPrefix", dialCode)
              }
              placeholder="9XXXXXXXXX"
              error={form.formState.errors.phoneNumber?.message}
            />
          </FormItem>
        )}
      />

      <div className="flex justify-end pt-2">
        <Button
          type="button"
          variant="brand"
          size="lg"
          onClick={onContinue}
          loading={checking}
          disabled={emailTaken}
        >
          Continue
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
