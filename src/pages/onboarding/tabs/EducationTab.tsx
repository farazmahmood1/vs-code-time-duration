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
  useAddEducation,
  useUpdateEducation,
  useDeleteEducation,
  type OnboardingData,
  type Education,
} from "@/hooks/useOnboarding";
import { Plus, Trash2, Edit, GraduationCap } from "lucide-react";
import DeleteConfirmDialog from "@/components/announcements/DeleteAnnouncementDialog";

const educationSchema = z.object({
  educationName: z.string().min(2, "Degree/Program name is required"),
  institute: z.string().min(2, "Institute name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

type EducationFormValues = z.infer<typeof educationSchema>;

interface EducationTabProps {
  data?: OnboardingData;
  onValidationChange?: (isValid: boolean) => void;
}

export default function EducationTab({
  data,
  onValidationChange,
}: EducationTabProps) {
  const { mutate: addEducation, isPending: isAdding } = useAddEducation();
  const { mutate: updateEducation, isPending: isUpdating } =
    useUpdateEducation();
  const { mutate: deleteEducation, isPending: isDeleting } =
    useDeleteEducation();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Education is valid if at least one education entry exists
  useEffect(() => {
    onValidationChange?.((data?.educations?.length ?? 0) > 0);
  }, [data?.educations, onValidationChange]);

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educationName: "",
      institute: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  const onSubmit = (values: EducationFormValues) => {
    if (editingId) {
      updateEducation(
        { id: editingId, ...values } as Education & { id: string },
        {
          onSuccess: () => {
            setOpen(false);
            setEditingId(null);
            form.reset();
          },
        }
      );
    } else {
      addEducation(values, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      });
    }
  };

  const handleEdit = (education: Education) => {
    setEditingId(education.id);
    form.reset({
      educationName: education.educationName,
      institute: education.institute,
      startDate: education.startDate,
      endDate: education.endDate,
      description: education.description,
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteEducation(deleteId);
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-br from-green-50 to-emerald-100 border border-green-200 rounded-xl p-6">
        <div className="flex gap-4">
          <div className="text-3xl shrink-0">🎓</div>
          <div>
            <h3 className="font-semibold text-green-900 mb-1">
              Your Educational Background
            </h3>
            <p className="text-sm text-green-800">
              Add your academic qualifications and education history. Include
              universities, degrees, and programs you've completed.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-green-600" />
          Education Entries ({data?.educations?.length || 0})
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
          Add Education
        </Button>
      </div>

      <ResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        title={editingId ? "Edit Education" : "Add New Education"}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="educationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree / Program</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Bachelor of Science in Computer Science"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="institute"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institute / University</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., MIT" {...field} />
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
                      placeholder="Mention any awards, honors, or additional details..."
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
              {isAdding || isUpdating ? "Saving..." : "Save Education"}
            </Button>
          </form>
        </Form>
      </ResponsiveDialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Education"
        message="Are you sure you want to delete this education entry? This action cannot be undone."
        isLoading={isDeleting}
      />

      <div className="space-y-3">
        {data?.educations && data.educations.length > 0 ? (
          data.educations.map((education) => (
            <Card key={education.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {education.educationName}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {education.institute}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(education.startDate).toLocaleDateString()} -{" "}
                      {education.endDate
                        ? new Date(education.endDate).toLocaleDateString()
                        : "Present"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(education)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(education.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {education.description && (
                <CardContent>
                  <p className="text-sm text-gray-700">
                    {education.description}
                  </p>
                </CardContent>
              )}
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No education entries added yet. Click "Add Education" to get
            started.
          </div>
        )}
      </div>
    </div>
  );
}
