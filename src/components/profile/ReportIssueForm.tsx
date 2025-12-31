import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import api, { type ApiError } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { Bug, Mail } from "lucide-react";
import { toast } from "sonner";

import {
  reportIssueSchema,
  type ReportIssueType,
} from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const ReportIssueForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ReportIssueType>({
    resolver: zodResolver(reportIssueSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: ReportIssueType) => {
      const res = await api.post("/user/report", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Issue reported successfully!");
      reset();
    },
    onError: (err: ApiError) => {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit issue");
    },
  });

  const onSubmit = (data: ReportIssueType) => {
    mutation.mutate(data);
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-brand" />
          <CardTitle>Report an Issue</CardTitle>
        </div>
        <CardDescription>
          Encountered a problem? Tell us so we can fix it.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select onValueChange={(val) => setValue("category", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select issue category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bug Report">Bug Report</SelectItem>
                <SelectItem value="Feature Request">Feature Request</SelectItem>
                <SelectItem value="Account Issue">Account Issue</SelectItem>
                <SelectItem value="Performance Issue">
                  Performance Issue
                </SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Subject</Label>
            <Input
              placeholder="Brief description of the issue"
              {...register("subject")}
            />
            {errors.subject && (
              <p className="text-red-500 text-sm">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Explain the issue in detail..."
              className="min-h-[200px]"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-brand hover:bg-brand/90"
          >
            {mutation.isPending ? (
              "Sending..."
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Send Report
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
