"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CheckIdentityResult } from "@/types/recipient";

interface SharedRecipientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: Extract<CheckIdentityResult, { exists: true }> | null;
  onConfirm: () => void;
  onCancel: () => void;
  confirming?: boolean;
}

/**
 * Shown when the entered email+phone match a recipient that another user has
 * already registered. Two variants:
 *  - `alreadyLinked: true`  — the current user already has this recipient;
 *    we just surface that and let them jump to the existing entry.
 *  - `alreadyLinked: false` — offer to link the shared recipient to this user
 *    without re-running KYC or re-entering bank info.
 */
export function SharedRecipientDialog({
  open,
  onOpenChange,
  result,
  onConfirm,
  onCancel,
  confirming,
}: SharedRecipientDialogProps) {
  if (!result) return null;
  const { recipient, alreadyLinked } = result;
  const name = `${recipient.firstName} ${recipient.lastName}`.trim();
  const kyc = recipient.kycStatus ?? "PENDING";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {alreadyLinked
              ? "Already in your list"
              : `${name} is already registered`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          {alreadyLinked ? (
            <p className="text-muted-foreground">
              You've already added {name} — open their profile to send money.
            </p>
          ) : (
            <>
              <p className="text-muted-foreground">
                Another user has already verified {name}. You can add them to
                your list without re-running KYC{" "}
                {recipient.hasBankAccount
                  ? "and their existing bank account will be available for transfers."
                  : "— you'll still need to link a bank account."}
              </p>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-lg bg-muted/40 p-3">
                <span className="text-muted-foreground">KYC</span>
                <span className="font-medium text-foreground">{kyc}</span>
                <span className="text-muted-foreground">Bank</span>
                <span className="font-medium text-foreground">
                  {recipient.hasBankAccount ? "Linked" : "Not linked"}
                </span>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={confirming}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="brand"
            onClick={onConfirm}
            loading={confirming}
          >
            {alreadyLinked ? "Open recipient" : "Add to my list"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
