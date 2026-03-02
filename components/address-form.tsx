"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addressSchema, type AddressFormData } from "@/schemas/address.schema";
import { useAccount } from "@/hooks/api";
import { submitOnboardingAddress } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { CountrySelector } from "@/components/country-selector";

export function AddressForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: account, isLoading } = useAccount();
  const existingAddress = account?.addresses?.find(
    (a) => a.type === "PRESENT"
  );

  const addressMutation = useMutation({
    mutationFn: submitOnboardingAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.account });
    },
  });

  const form = useForm<AddressFormData>({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      country: "",
      state: "",
      city: "",
      addressLine1: "",
      postalCode: "",
    },
  });

  const hasPopulated = useRef(false);

  useEffect(() => {
    if (!account || hasPopulated.current) return;
    hasPopulated.current = true;

    const present = account.addresses?.find((a) => a.type === "PRESENT");
    if (present) {
      form.reset({
        country: present.country || "",
        state: present.state || "",
        city: present.city || "",
        addressLine1: present.addressLine1 || "",
        postalCode: present.postalCode || "",
      });
    }
  }, [account, form]);

  const onSubmit = async (data: AddressFormData) => {
    try {
      await addressMutation.mutateAsync({
        type: "PRESENT",
        addressLine1: data.addressLine1,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
      });

      toast.success("Address saved successfully");

      if (existingAddress) {
        router.replace("/");
      } else {
        router.replace("/kyc");
      }
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
          <Skeleton className="mt-2 h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Your Address</CardTitle>
        <CardDescription>Where do you live?</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <CountrySelector
                    label="Country"
                    value={field.value}
                    onSelect={field.onChange}
                    placeholder="Select country"
                    error={form.formState.errors.country?.message}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State / Division</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter state" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter street address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter postal code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                className="w-full"
                disabled={addressMutation.isPending}
              >
                {addressMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {existingAddress ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
