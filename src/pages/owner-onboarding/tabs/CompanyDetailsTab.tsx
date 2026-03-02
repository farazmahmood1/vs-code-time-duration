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
import { Textarea } from "@/components/ui/textarea";
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
  useUpdateCompanyDetails,
} from "@/hooks/useOwnerOnboarding";

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "E-commerce",
  "Manufacturing",
  "Consulting",
  "Real Estate",
  "Media & Entertainment",
  "Logistics",
  "Agriculture",
  "Other",
];

const TEAM_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
];

const companyDetailsSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  industry: z.string().min(1, "Please select an industry"),
  teamSize: z.string().min(1, "Please select team size"),
  website: z
    .string()
    .url("Please enter a valid URL")
    .or(z.literal("")),
  companyAddress: z.string().min(5, "Address must be at least 5 characters"),
});

type CompanyDetailsValues = z.infer<typeof companyDetailsSchema>;

interface CompanyDetailsTabProps {
  onValidationChange?: (isValid: boolean) => void;
  onSaved?: () => void;
}

export default function CompanyDetailsTab({
  onValidationChange,
  onSaved,
}: CompanyDetailsTabProps) {
  const { data: onboardingData } = useGetOwnerOnboardingData();
  const { mutate: updateCompany, isPending } = useUpdateCompanyDetails();

  const form = useForm<CompanyDetailsValues>({
    resolver: zodResolver(companyDetailsSchema),
    defaultValues: {
      description: onboardingData?.company?.description || "",
      industry: onboardingData?.company?.industry || "",
      teamSize: onboardingData?.company?.teamSize || "",
      website: onboardingData?.company?.website || "",
      companyAddress: onboardingData?.company?.companyAddress || "",
    },
  });

  useEffect(() => {
    if (onboardingData?.company) {
      form.reset({
        description: onboardingData.company.description || "",
        industry: onboardingData.company.industry || "",
        teamSize: onboardingData.company.teamSize || "",
        website: onboardingData.company.website || "",
        companyAddress: onboardingData.company.companyAddress || "",
      });
    }
  }, [onboardingData, form]);

  useEffect(() => {
    onValidationChange?.(form.formState.isValid);
  }, [form.formState.isValid, onValidationChange]);

  const onSubmit = (values: CompanyDetailsValues) => {
    updateCompany(values, {
      onSuccess: () => {
        onSaved?.();
      },
    });
  };

  return (
    <Card className="shadow-none max-md:border-0 p-0 py-6">
      <CardHeader>
        <CardTitle>Company Details</CardTitle>
        <p className="text-sm text-muted-foreground">
          Help us understand your company better.
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe what your company does..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
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
              name="teamSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Size</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TEAM_SIZES.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size} employees
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
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://yourcompany.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Business St, City, Country"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Saving..." : "Save Company Details"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
