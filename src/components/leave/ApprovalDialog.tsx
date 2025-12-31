import ResponsiveDialog from "@/components/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const approvalSchema = z.object({
  notes: z.string().max(500, "Notes must be less than 500 characters"),
});

type ApprovalFormData = z.infer<typeof approvalSchema>;

interface ApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveId: string;
  employeeName: string;
  actionType: "APPROVE" | "REJECT";
  onConfirm: (leaveId: string, notes: string) => void;
  isLoading?: boolean;
}

export const ApprovalDialog = ({
  open,
  onOpenChange,
  leaveId,
  employeeName,
  actionType,
  onConfirm,
  isLoading,
}: ApprovalDialogProps) => {
  const form = useForm<ApprovalFormData>({
    resolver: zodResolver(approvalSchema),
    defaultValues: {
      notes: "",
    },
    mode: "onBlur",
  });

  const onSubmit = (data: ApprovalFormData) => {
    onConfirm(leaveId, data.notes);
    form.reset();
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`${actionType === "APPROVE" ? "Approve" : "Reject"} Leave Request`}
      description={`${
        actionType === "APPROVE" ? "Approve" : "Reject"
      } the leave request for ${employeeName}`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>
                  {actionType === "APPROVE" ? "Approval" : "Rejection"} Notes
                </FormLabel> */}
                <FormControl>
                  <Textarea
                    placeholder={`Add ${
                      actionType === "APPROVE" ? "approval" : "rejection"
                    } notes...`}
                    className="min-h-[100px] resize-none"
                    {...field}
                  />
                </FormControl>
                <div className="text-xs text-muted-foreground text-right">
                  {field.value?.length || 0}/500
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={actionType === "APPROVE" ? "default" : "destructive"}
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : `${actionType === "APPROVE" ? "Approve" : "Reject"}`}
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveDialog>
  );
};
