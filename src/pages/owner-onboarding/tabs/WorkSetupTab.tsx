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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  useGetOwnerOnboardingData,
  useUpdateWorkSetup,
} from "@/hooks/useOwnerOnboarding";

const TIMEZONES = [
  "UTC-12:00",
  "UTC-11:00",
  "UTC-10:00",
  "UTC-09:00",
  "UTC-08:00 (PST)",
  "UTC-07:00 (MST)",
  "UTC-06:00 (CST)",
  "UTC-05:00 (EST)",
  "UTC-04:00",
  "UTC-03:00",
  "UTC-02:00",
  "UTC-01:00",
  "UTC+00:00 (GMT)",
  "UTC+01:00 (CET)",
  "UTC+02:00 (EET)",
  "UTC+03:00",
  "UTC+04:00",
  "UTC+05:00 (PKT)",
  "UTC+05:30 (IST)",
  "UTC+06:00",
  "UTC+07:00",
  "UTC+08:00",
  "UTC+09:00",
  "UTC+10:00",
  "UTC+11:00",
  "UTC+12:00",
];

const WORKING_HOURS = [
  "9:00 AM - 5:00 PM",
  "8:00 AM - 4:00 PM",
  "10:00 AM - 6:00 PM",
  "8:00 AM - 5:00 PM",
  "9:00 AM - 6:00 PM",
  "Flexible Hours",
  "24/7 Operations",
];

const workSetupSchema = z.object({
  timezone: z.string().min(1, "Please select a timezone"),
  workingHours: z.string().min(1, "Please select working hours"),
});

type WorkSetupValues = z.infer<typeof workSetupSchema>;

interface WorkSetupTabProps {
  onValidationChange?: (isValid: boolean) => void;
  onSaved?: () => void;
}

export default function WorkSetupTab({
  onValidationChange,
  onSaved,
}: WorkSetupTabProps) {
  const { data: onboardingData } = useGetOwnerOnboardingData();
  const { mutate: updateWorkSetup, isPending } = useUpdateWorkSetup();

  const form = useForm<WorkSetupValues>({
    resolver: zodResolver(workSetupSchema),
    defaultValues: {
      timezone: onboardingData?.company?.timezone || "",
      workingHours: onboardingData?.company?.workingHours || "",
    },
  });

  useEffect(() => {
    if (onboardingData?.company) {
      form.reset({
        timezone: onboardingData.company.timezone || "",
        workingHours: onboardingData.company.workingHours || "",
      });
    }
  }, [onboardingData, form]);

  useEffect(() => {
    onValidationChange?.(form.formState.isValid);
  }, [form.formState.isValid, onValidationChange]);

  const onSubmit = (values: WorkSetupValues) => {
    updateWorkSetup(values, {
      onSuccess: () => {
        onSaved?.();
      },
    });
  };

  return (
    <Card className="shadow-none max-md:border-0 p-0 py-6">
      <CardHeader>
        <CardTitle>Work Setup</CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure your company's working schedule and timezone.
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workingHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Working Hours</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select working hours" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WORKING_HOURS.map((hours) => (
                        <SelectItem key={hours} value={hours}>
                          {hours}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Saving..." : "Save Work Setup"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
