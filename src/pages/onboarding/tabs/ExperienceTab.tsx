import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import { DatePicker } from "@/components/common/DatePicker";
import {
  useAddExperience,
  useUpdateExperience,
  useDeleteExperience,
  type OnboardingData,
  type Experience,
} from "@/hooks/useOnboarding";
import { Plus, Trash2, Edit } from "lucide-react";
import DeleteConfirmDialog from "@/components/announcements/DeleteAnnouncementDialog";

const experienceSchema = z.object({
  position: z.string().min(2, "Position is required"),
  company: z.string().min(2, "Company name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

interface ExperienceTabProps {
  data?: OnboardingData;
  onValidationChange?: (isValid: boolean) => void;
}

export default function ExperienceTab({
  data,
  onValidationChange,
}: ExperienceTabProps) {
  const { mutate: addExperience, isPending: isAdding } = useAddExperience();
  const { mutate: updateExperience, isPending: isUpdating } =
    useUpdateExperience();
  const { mutate: deleteExperience, isPending: isDeleting } =
    useDeleteExperience();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      position: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  // Experience is valid if at least one experience entry exists
  useEffect(() => {
    onValidationChange?.((data?.experiences?.length ?? 0) > 0);
  }, [data?.experiences, onValidationChange]);

  const onSubmit = (values: ExperienceFormValues) => {
    if (editingId) {
      updateExperience(
        { id: editingId, ...values } as Experience & { id: string },
        {
          onSuccess: () => {
            setOpen(false);
            setEditingId(null);
            form.reset();
          },
        }
      );
    } else {
      addExperience(values, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      });
    }
  };

  const handleEdit = (experience: Experience) => {
    setEditingId(experience.id);
    form.reset({
      position: experience.position,
      company: experience.company,
      startDate: experience.startDate,
      endDate: experience.endDate,
      description: experience.description,
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteExperience(deleteId);
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-br from-amber-50 to-orange-100 border border-amber-200 rounded-xl p-6">
        <div className="flex gap-4">
          <div className="text-3xl shrink-0">💼</div>
          <div>
            <h3 className="font-semibold text-amber-900 mb-1">
              Your Work Experience
            </h3>
            <p className="text-sm text-amber-800">
              Add your professional work history. Share positions, companies,
              and achievements to showcase your career growth.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Experience Entries
        </h3>
        <Button
          size="sm"
          onClick={() => {
            setEditingId(null);
            form.reset();
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Experience
        </Button>
      </div>

      <ResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        title={editingId ? "Edit Experience" : "Add New Experience"}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Senior Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Tech Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select start date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date (Optional)</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select end date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your responsibilities and achievements..."
                      className="min-h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isAdding || isUpdating}
              className="w-full"
            >
              {isAdding || isUpdating ? "Saving..." : "Save Experience"}
            </Button>
          </form>
        </Form>
      </ResponsiveDialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Experience"
        message="Are you sure you want to delete this experience? This action cannot be undone."
        isLoading={isDeleting}
      />

      <div className="space-y-3">
        {data?.experiences && data.experiences.length > 0 ? (
          data.experiences.map((experience) => (
            <Card key={experience.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {experience.position}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {experience.company}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(experience.startDate).toLocaleDateString()} -{" "}
                      {experience.endDate
                        ? new Date(experience.endDate).toLocaleDateString()
                        : "Present"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(experience)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(experience.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {experience.description && (
                <CardContent>
                  <p className="text-sm text-gray-700">
                    {experience.description}
                  </p>
                </CardContent>
              )}
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No experiences added yet. Click "Add Experience" to get started.
          </div>
        )}
      </div>
    </div>
  );
}
