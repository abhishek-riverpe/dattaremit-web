"use client";

import { useRouter } from "next/navigation";
import { useAccount, useSubmitProfile } from "@/hooks/api";
import { toast } from "sonner";
import {
  Loader2,
  CircleUser,
  Phone,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubmitProfilePage() {
  const router = useRouter();
  const { data: account, isLoading } = useAccount();
  const submitMutation = useSubmitProfile();

  const user = account?.user;
  const addresses = account?.addresses ?? [];
  const presentAddress = addresses.find((a) => a.type === "PRESENT");
  const permanentAddress = addresses.find((a) => a.type === "PERMANENT");
  const status = account?.accountStatus ?? "INITIAL";

  const handleSubmit = async () => {
    try {
      await submitMutation.mutateAsync();
      toast.success("Profile submitted for verification!");
      router.push("/kyc");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (status === "ACTIVE") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h2 className="text-xl font-semibold">Account Verified</h2>
          <p className="text-sm text-muted-foreground">
            Your account has been verified and is active.
          </p>
          <Button onClick={() => router.replace("/")}>Go to Home</Button>
        </CardContent>
      </Card>
    );
  }

  if (status === "PENDING") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <Clock className="h-16 w-16 text-yellow-500" />
          <h2 className="text-xl font-semibold">Verification in Progress</h2>
          <p className="text-center text-sm text-muted-foreground">
            Your profile has been submitted and is under review. This usually
            takes a few minutes.
          </p>
          <Button variant="outline" onClick={() => router.replace("/")}>
            Go to Home
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === "REJECTED") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <XCircle className="h-16 w-16 text-destructive" />
          <h2 className="text-xl font-semibold">Verification Rejected</h2>
          <p className="text-center text-sm text-muted-foreground">
            Your verification was not approved. Please update your profile and
            try again.
          </p>
          <Button onClick={() => router.push("/edit-profile")}>
            Edit Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  const formatAddress = (addr: { addressLine1: string; addressLine2?: string | null; city: string; state: string; postalCode: string; country: string }) => {
    const parts = [addr.addressLine1];
    if (addr.addressLine2) parts.push(addr.addressLine2);
    parts.push(`${addr.city}, ${addr.state} ${addr.postalCode}`);
    parts.push(addr.country);
    return parts.join(", ");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Review & Submit</CardTitle>
        <CardDescription>
          Review your information before submitting for verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Info */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Personal Information
          </p>
          <div className="rounded-lg border">
            <div className="flex items-center gap-3 px-4 py-3">
              <CircleUser className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <Separator />
            {user?.phoneNumber && (
              <>
                <div className="flex items-center gap-3 px-4 py-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {user.phoneNumberPrefix}
                    {user.phoneNumber}
                  </span>
                </div>
                <Separator />
              </>
            )}
            {user?.dateOfBirth && (
              <div className="flex items-center gap-3 px-4 py-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {new Date(user.dateOfBirth).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Addresses */}
        {(presentAddress || permanentAddress) && (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Addresses
            </p>
            <div className="rounded-lg border">
              {presentAddress && (
                <>
                  <div className="flex items-start gap-3 px-4 py-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Present Address
                      </p>
                      <p className="text-sm">{formatAddress(presentAddress)}</p>
                    </div>
                  </div>
                  {permanentAddress && <Separator />}
                </>
              )}
              {permanentAddress && (
                <div className="flex items-start gap-3 px-4 py-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Permanent Address
                    </p>
                    <p className="text-sm">
                      {formatAddress(permanentAddress)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit for Verification
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/edit-profile")}
            disabled={submitMutation.isPending}
          >
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
