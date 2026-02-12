"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  personalInfoSchema,
  type PersonalInfoFormData,
} from "@/schemas/personal-info.schema";
import { useAccount, useCreateUser, useUpdateUser } from "@/hooks/api";
import { splitName } from "@/utils/profile-helpers";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { PhoneInput } from "@/components/phone-input";
import { cn } from "@/lib/utils";

export function PersonalInfoForm() {
  const router = useRouter();
  const { user: clerkUser } = useUser();

  const { data: account, isLoading } = useAccount();
  const existingUser = account?.user;
  const isExistingUser = !!existingUser;

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const loading = createUserMutation.isPending || updateUserMutation.isPending;

  const form = useForm<PersonalInfoFormData>({
    resolver: yupResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      dateOfBirth: "",
    },
  });

  const hasPopulated = useRef(false);

  useEffect(() => {
    if (!account || hasPopulated.current) return;
    hasPopulated.current = true;

    const { firstName, lastName } = splitName(account.user.name || "");
    form.reset({
      firstName,
      lastName,
      phone: account.user.phone || "",
      dateOfBirth: account.user.dateOfBirth
        ? account.user.dateOfBirth.substring(0, 10)
        : "",
    });
  }, [account, form]);

  const onSubmit = async (data: PersonalInfoFormData) => {
    try {
      const userData = {
        name: `${data.firstName} ${data.lastName}`.trim(),
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
      };

      if (isExistingUser) {
        await updateUserMutation.mutateAsync(userData);
      } else {
        await createUserMutation.mutateAsync(userData);
      }

      toast.success(
        isExistingUser
          ? "Profile updated successfully"
          : "Profile created successfully"
      );

      if (!isExistingUser) {
        router.push("/edit-addresses");
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
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="text-2xl">Edit your profile</CardTitle>
          <CardDescription>Tell us about yourself</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  value={account?.user?.email || clerkUser?.emailAddresses[0]?.emailAddress || ""}
                  disabled
                  readOnly
                />
              </FormControl>
            </FormItem>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <PhoneInput
                    label="Phone Number"
                    value={field.value}
                    onChangePhone={field.onChange}
                    placeholder="1XXX-XXXXXX"
                    error={form.formState.errors.phone?.message}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(new Date(field.value), "PPP")
                            : "Select your date of birth"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) =>
                          field.onChange(
                            date ? format(date, "yyyy-MM-dd") : ""
                          )
                        }
                        disabled={(date) => date > new Date()}
                        defaultMonth={
                          field.value ? new Date(field.value) : new Date(2000, 0)
                        }
                        captionLayout="dropdown"
                        fromYear={1920}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3 pt-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isExistingUser ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
