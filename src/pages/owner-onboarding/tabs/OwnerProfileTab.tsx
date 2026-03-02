import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/common/PhoneInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  useGetOwnerOnboardingData,
  useUpdateOwnerProfile,
} from "@/hooks/useOwnerOnboarding";

const ownerProfileSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  designation: z.string().min(2, "Designation is required"),
});

type OwnerProfileValues = z.infer<typeof ownerProfileSchema>;

interface OwnerProfileTabProps {
  onValidationChange?: (isValid: boolean) => void;
  onSaved?: () => void;
}

export default function OwnerProfileTab({
  onValidationChange,
  onSaved,
}: OwnerProfileTabProps) {
  const { data: onboardingData } = useGetOwnerOnboardingData();
  const { mutate: updateProfile, isPending } = useUpdateOwnerProfile();

  const form = useForm<OwnerProfileValues>({
    resolver: zodResolver(ownerProfileSchema),
    defaultValues: {
      phone: onboardingData?.phone || "",
      designation: onboardingData?.designation || "",
    },
  });

  // Sync form when data loads
  useEffect(() => {
    if (onboardingData) {
      form.reset({
        phone: onboardingData.phone || "",
        designation: onboardingData.designation || "",
      });
    }
  }, [onboardingData, form]);

  useEffect(() => {
    onValidationChange?.(form.formState.isValid);
  }, [form.formState.isValid, onValidationChange]);

  const onSubmit = (values: OwnerProfileValues) => {
    updateProfile(values, {
      onSuccess: () => {
        onSaved?.();
      },
    });
  };

  return (
    <Card className="shadow-none max-md:border-0 p-0 py-6">
      <CardHeader>
        <CardTitle>Owner Profile</CardTitle>
        <p className="text-sm text-muted-foreground">
          Tell us about yourself so your team knows how to reach you.
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Phone</FormLabel>
                  <FormControl>
                    <PhoneInput
                      placeholder="Select a country"
                      defaultCountry="PK"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation / Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. CEO, Founder, CTO" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
