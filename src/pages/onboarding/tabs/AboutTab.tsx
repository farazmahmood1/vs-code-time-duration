import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateProfile } from "@/hooks/useOnboarding";
import { type OnboardingData } from "@/hooks/useOnboarding";
import { Loader2 } from "lucide-react";

const aboutSchema = z.object({
  about: z
    .string()
    .min(10, "About must be at least 10 characters")
    .max(500, "About must be less than 500 characters"),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

interface AboutTabProps {
  data?: OnboardingData;
  onValidationChange?: (isValid: boolean) => void;
}

export default function AboutTab({ data, onValidationChange }: AboutTabProps) {
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [isSaved, setIsSaved] = useState(false);

  const form = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      about: data?.profile?.about || "",
    },
  });

  // Report validation state whenever it changes
  useEffect(() => {
    onValidationChange?.(form.formState.isValid);
  }, [form.formState.isValid, onValidationChange]);

  const onSubmit = (values: AboutFormValues) => {
    updateProfile(values.about || "", {
      onSuccess: () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
        <div className="flex gap-4">
          <div className="text-3xl shrink-0">📝</div>
          <div>
            <h3 className="font-semibold text-brand/90 mb-1">
              Tell us about yourself
            </h3>
            <p className="text-sm text-brand/80">
              Share a brief bio or introduction about your professional
              background. This helps your team get to know you better and
              understand your experience.
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  About You
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Example: I'm a passionate software engineer with 5 years of experience in full-stack web development. I specialize in React and Node.js, and I'm enthusiastic about building scalable applications. In my spare time, I enjoy contributing to open-source projects..."
                    className="min-h-40 resize-none border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs font-semibold text-end">
                  {field.value?.length || 0}/500
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending} className="w-full ">
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save About"
            )}
          </Button>

          {isSaved && (
            <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-in fade-in">
              <span>✓</span>
              <span>Your about section has been saved successfully!</span>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
