"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useAccount,
  useCheckRecipientIdentity,
  useCreateRecipient,
} from "@/hooks/api";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { BackLink } from "@/components/ui/back-link";
import { RecipientForm } from "@/components/recipients/recipient-form";
import { SharedRecipientDialog } from "@/components/recipients/shared-recipient-dialog";
import { KycGate } from "@/components/kyc-gate";
import { ROUTES } from "@/constants/routes";
import type { CheckIdentityResult, RecipientKycStatus } from "@/types/recipient";
import type { RecipientFormData } from "@/schemas/recipient.schema";

type Match = Extract<CheckIdentityResult, { exists: true }>;

export default function NewRecipientPage() {
  const router = useRouter();
  const createRecipient = useCreateRecipient();
  const checkIdentity = useCheckRecipientIdentity();
  const { data: account } = useAccount();

  const [match, setMatch] = useState<Match | null>(null);
  const [pendingData, setPendingData] = useState<RecipientFormData | null>(null);

  if (account && account.accountStatus !== "ACTIVE") {
    return (
      <div className="space-y-7">
        <BackLink href={ROUTES.RECIPIENTS} />
        <KycGate
          accountStatus={account.accountStatus}
          feature="adding recipients"
        />
      </div>
    );
  }

  const finishCreate = async (data: RecipientFormData) => {
    try {
      const recipient = await createRecipient.mutateAsync(data);
      if (recipient.shared) {
        toast.success(`${recipient.firstName} added from existing identity`);
        router.push(`/recipients/${recipient.id}`);
      } else {
        toast.success("Recipient added");
        router.push(`/recipients/${recipient.id}/bank`);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add recipient",
      );
    }
  };

  const handleSubmit = async (data: RecipientFormData) => {
    try {
      const result = await checkIdentity.mutateAsync({
        email: data.email,
        phoneNumberPrefix: data.phoneNumberPrefix,
        phoneNumber: data.phoneNumber,
      });
      if (result.exists) {
        setMatch(result);
        setPendingData(data);
        return;
      }
      await finishCreate(data);
    } catch {
      // Fall through and try a plain create — server still dedups server-side.
      await finishCreate(data);
    }
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-3">
        <BackLink href={ROUTES.RECIPIENTS} />
        <PageHeader
          eyebrow="New recipient"
          title={
            <>
              Add{" "}
              <span className="text-brand">
                someone new
              </span>
              .
            </>
          }
          subtitle="We'll check whether they're already in our system before creating a duplicate."
        />
      </div>

      <Card variant="elevated" className="p-6 sm:p-8">
        <RecipientForm
          submitLabel="Continue"
          submitting={createRecipient.isPending || checkIdentity.isPending}
          onSubmit={handleSubmit}
        />
      </Card>

      <SharedRecipientDialog
        open={!!match}
        onOpenChange={(open) => {
          if (!open) {
            setMatch(null);
            setPendingData(null);
          }
        }}
        result={match}
        confirming={createRecipient.isPending}
        onCancel={() => {
          setMatch(null);
          setPendingData(null);
        }}
        onConfirm={async () => {
          if (!match) return;
          if (match.alreadyLinked) {
            router.push(`/recipients/${match.recipient.id}`);
            return;
          }
          if (pendingData) {
            await finishCreate(pendingData);
          }
          setMatch(null);
          setPendingData(null);
        }}
      />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _Assert = RecipientKycStatus;
