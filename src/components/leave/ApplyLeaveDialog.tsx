import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCreateLeave } from "@/hooks/useLeaveData";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import { cn } from "@/lib/utils";
import {
  type LeaveFormData,
  leaveFormSchema,
  leaveTypes,
} from "@/lib/validations/leave";
import { LEAVE_LABELS } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";

interface ApplyLeaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ApplyLeaveDialog = ({
  open,
  onOpenChange,
}: ApplyLeaveDialogProps) => {
  const { toast } = useToast();
  const createLeave = useCreateLeave();
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);

  const form = useForm<LeaveFormData>({
    // @ts-expect-error - zodResolver type inference limitation with preprocess
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      leaveType: undefined,
      startDate: undefined,
      endDate: undefined,
      reason: "",
      prescriptionUrl: undefined,
    },
  });

  const selectedLeaveType = form.watch("leaveType");
  const isSickLeave = selectedLeaveType === "SICK_LEAVE";

  const handlePrescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (PDFs and images only)
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      return toast({
        title: "Invalid file",
        description: "Please upload a PDF or image file",
        variant: "destructive",
      });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      });
    }

    setPrescriptionFile(file);
  };

  const removePrescription = () => {
    setPrescriptionFile(null);
  };

  const onSubmit = async (data: LeaveFormData) => {
    if (isSickLeave && !prescriptionFile) {
      return toast({
        title: "Prescription required",
        description: "Please upload a prescription for sick leave",
        variant: "destructive",
      });
    }

    try {
      await createLeave.mutateAsync({
        ...data,
        prescriptionFile: prescriptionFile,
      });
      toast({
        title: "Success",
        description: "Leave application submitted successfully",
      });
      form.reset();
      removePrescription();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to submit leave application",
        variant: "destructive",
      });
    }
  };

  const FormContent = () => (
    <Form {...form}>
      <form
        // @ts-expect-error - cascading type errors from zodResolver
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          // @ts-expect-error - cascading type errors from zodResolver

          control={form.control}
          name="leaveType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leave Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {LEAVE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            // @ts-expect-error - cascading type errors from zodResolver
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date: Date | undefined) =>
                        date ? date < new Date() : false
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            // @ts-expect-error - cascading type errors from zodResolver

            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date: Date | undefined) =>
                        date ? date < new Date() : false
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          // @ts-expect-error - cascading type errors from zodResolver
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please provide a reason for your leave..."
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription className="text-xs font-semibold text-end">
                {field.value?.length || 0}/500
              </FormDescription>
            </FormItem>
          )}
        />

        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-2">
            <span>Medical Prescription</span>
            <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {prescriptionFile ? (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-green-500">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium truncate">
                    {prescriptionFile.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removePrescription}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary transition">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                  onChange={handlePrescriptionChange}
                  className="hidden"
                />
                <div className="text-center">
                  <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Click to upload prescription
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF or Image (max 5MB)
                  </p>
                </div>
              </label>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              removePrescription();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createLeave.isPending}>
            {createLeave.isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Apply for Leave"
      description="Submit a new leave request"
    >
      <FormContent />
    </ResponsiveDialog>
  );
};
