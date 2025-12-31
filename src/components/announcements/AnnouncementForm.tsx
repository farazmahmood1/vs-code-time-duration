import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import DepartmentSelect from "@/components/common/DepartmentSelect";
import {
  useCreateAnnouncement,
  useUpdateAnnouncement,
} from "@/hooks/useAnnouncements";
import {
  announcementFormSchema,
  type AnnouncementFormData,
} from "@/lib/validations/announcement";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Announcement } from "@/hooks/useAnnouncements";
import ResponsiveDialog from "../ResponsiveDialog";

interface AnnouncementFormProps {
  announcement?: Announcement | null;
  onSuccess: () => void;
}

const AnnouncementForm = ({
  announcement,
  onSuccess,
}: AnnouncementFormProps) => {
  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();

  const isEdit = Boolean(announcement);

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: announcement?.title ?? "",
      description: announcement?.description ?? "",
      category:
        (announcement?.category as AnnouncementFormData["category"]) ??
        "update",
      departmentId: announcement?.department?.id ?? "",
      expiryType: "never",
      expiryDate: undefined,
      expiryTime: undefined,
    },
  });

  const expiryType = form.watch("expiryType");

  const onSubmit = async (data: AnnouncementFormData) => {
    try {
      // Convert empty string to null for backend compatibility (means all departments)
      const submitData = {
        ...data,
        departmentId: data.departmentId === "" ? null : data.departmentId,
        expiresAt: null,
      } as Record<string, unknown>;

      // Calculate expiresAt based on selection
      if (data.expiryType === "date" && data.expiryDate) {
        submitData.expiresAt = new Date(data.expiryDate).toISOString();
      }

      // Remove helper fields before sending
      delete submitData.expiryType;
      delete submitData.expiryTime;
      delete submitData.expiryDate;

      if (isEdit && announcement) {
        await updateMutation.mutateAsync({
          id: announcement.id,
          data: submitData as AnnouncementFormData,
        });
      } else {
        await createMutation.mutateAsync(submitData as AnnouncementFormData);
      }
      form.reset();
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const loading = isEdit ? updateMutation.isPending : createMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter announcement title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter announcement description"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="holiday">Holiday</SelectItem>
                  <SelectItem value="update">Company Update</SelectItem>
                  <SelectItem value="urgent">Urgent Notice</SelectItem>
                  <SelectItem value="birthday">Birthday</SelectItem>
                  <SelectItem value="policy">Policy Update</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="departmentId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Department (Optional)</FormLabel>
              <FormControl>
                <DepartmentSelect
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  placeholder="All departments"
                  showAllOption={true}
                  variant="outline"
                  width="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Expiry Section */}
        <div>
          <FormField
            control={form.control}
            name="expiryType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Announcement Visibility</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select visibility duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="never">Never Expires</SelectItem>
                    <SelectItem value="date">Expires on Date</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {expiryType === "date" && (
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem className="w-full mt-4">
                  <FormLabel>Expiry Date and Time</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      date={field.value}
                      onDateChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              form.reset();
              onSuccess();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update"
              : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AnnouncementForm;

interface CreateAnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateAnnouncementDialog = ({
  open,
  onOpenChange,
}: CreateAnnouncementDialogProps) => {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create Announcement"
      description="Share important updates with your team"
    >
      <AnnouncementForm onSuccess={() => onOpenChange(false)} />
    </ResponsiveDialog>
  );
};

interface EditAnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement?: Announcement | null;
}

export const EditAnnouncementDialog = ({
  open,
  onOpenChange,
  announcement,
}: EditAnnouncementDialogProps) => {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={announcement ? "Edit Announcement" : "Create Announcement"}
      description={
        announcement
          ? "Update your announcement"
          : "Share important updates with your team"
      }
    >
      <AnnouncementForm
        announcement={announcement}
        onSuccess={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
