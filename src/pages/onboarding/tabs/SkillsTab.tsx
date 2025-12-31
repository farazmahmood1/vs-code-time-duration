import { Button } from "@/components/ui/button";
import ResponsiveDialog from "@/components/ResponsiveDialog";
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
  type OnboardingData,
  useAddSkill,
  useDeleteSkill,
} from "@/hooks/useOnboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { Code, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const skillSchema = z.object({
  skillName: z
    .string()
    .min(1, "Skill name is required")
    .max(50, "Skill name too long"),
});

type SkillFormValues = z.infer<typeof skillSchema>;

interface SkillsTabProps {
  data?: OnboardingData;
  onValidationChange?: (isValid: boolean) => void;
}

export default function SkillsTab({
  data,
  onValidationChange,
}: SkillsTabProps) {
  const { mutate: addSkill, isPending: isAdding } = useAddSkill();
  const { mutate: deleteSkill, isPending: isDeleting } = useDeleteSkill();

  const [open, setOpen] = useState(false);

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skillName: "",
    },
  });

  // Skills are valid if at least one skill exists
  useEffect(() => {
    onValidationChange?.((data?.skills?.length ?? 0) > 0);
  }, [data?.skills, onValidationChange]);

  const onSubmit = (values: SkillFormValues) => {
    addSkill(values.skillName, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteSkill(id);
  };

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-br from-purple-50 to-pink-100 border border-purple-200 rounded-xl p-6">
        <div className="flex gap-4">
          <div className="text-3xl shrink-0">🎯</div>
          <div>
            <h3 className="font-semibold text-purple-900 mb-1">
              Your Professional Skills
            </h3>
            <p className="text-sm text-purple-800">
              Add skills that represent your expertise. These help your team
              understand your capabilities and strengths.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Code className="w-5 h-5 text-purple-600" />
          Skills ({data?.skills?.length || 0})
        </h3>
        <Button
          size="sm"
          onClick={() => {
            form.reset();
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Skill
        </Button>
      </div>

      <ResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        title="Add New Skill"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="skillName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., React, Python, Project Management"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isAdding} className="w-full">
              {isAdding ? "Adding..." : "Add Skill"}
            </Button>
          </form>
        </Form>
      </ResponsiveDialog>

      <div className="flex flex-wrap gap-2">
        {data?.skills && data.skills.length > 0 ? (
          data.skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center gap-2 bg-blue-100 border border-blue-300 rounded-full px-4 py-2 group hover:bg-blue-200 transition"
            >
              <span className="text-sm font-medium text-blue-900">
                {skill.skillName}
              </span>
              <button
                onClick={() => handleDelete(skill.id)}
                disabled={isDeleting}
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                title="Delete skill"
              >
                <Trash2 className="w-3 h-3 text-red-600 hover:text-red-700" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 w-full text-gray-500">
            No skills added yet. Click "Add Skill" to get started.
          </div>
        )}
      </div>
    </div>
  );
}
