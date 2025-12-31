import { Button } from "@/components/ui/button";
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
import { PhoneInput } from "@/components/common/PhoneInput";
import { updateUser } from "@/lib/auth-client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { githubUrlSchema, linkedinUrlSchema } from "@/lib/validations/user";

const userSettingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  department: z.string().optional(),
  role: z.string().optional(),
  salary: z.number().optional(),
  address: z.string().optional(),
  githubUrl: githubUrlSchema,
  linkedinUrl: linkedinUrlSchema,
});

type UserSettingsFormValues = z.infer<typeof userSettingsSchema>;

interface UserSettingsFormProps {
  initialData?: {
    name?: string;
    email?: string;
    phone?: string | null;
    department?: string | null;
    role?: string | null;
    salary?: number | null;
    address?: string | null;
    githubUrl?: string | null;
    linkedinUrl?: string | null;
  };
}

export const UserSettingsForm = ({ initialData }: UserSettingsFormProps) => {
  const form = useForm<UserSettingsFormValues>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? "",
      department: initialData?.department ?? "",
      role: initialData?.role ?? "",
      salary: initialData?.salary ?? undefined,
      address: initialData?.address ?? "",
      githubUrl: initialData?.githubUrl ?? "",
      linkedinUrl: initialData?.linkedinUrl ?? "",
    },
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name ?? "",
        email: initialData.email ?? "",
        phone: initialData.phone ?? "",
        department: initialData.department ?? "",
        role: initialData.role ?? "",
        salary: initialData.salary ?? undefined,
        address: initialData.address ?? "",
        githubUrl: initialData.githubUrl ?? "",
        linkedinUrl: initialData.linkedinUrl ?? "",
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: UserSettingsFormValues) => {
    try {
      const updatePayload: Record<string, string | number | undefined> = {
        name: values.name,
        phone: values.phone || undefined,
        address: values.address || undefined,
        githubUrl: values.githubUrl || undefined,
        linkedinUrl: values.linkedinUrl || undefined,
      };

      await updateUser(updatePayload);
      toast.success("Settings updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update settings");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 max-w-2xl"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        readOnly
                        className="cursor-not-allowed opacity-75"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="opacity-60">Department</FormLabel>
                      <FormControl>
                        <Input
                          readOnly
                          className="cursor-not-allowed focus-visible:ring-0 focus-visible:border-input opacity-60"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="opacity-60">Role</FormLabel>
                      <FormControl>
                        <Input
                          readOnly
                          className="cursor-not-allowed focus-visible:ring-0 focus-visible:border-input opacity-60"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="opacity-60">Salary</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        readOnly
                        className="cursor-not-allowed focus-visible:ring-0 focus-visible:border-input opacity-60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main St, City, State 12345"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Profile</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://github.com/username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/in/username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="bg-brand hover:bg-brand/90">
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
