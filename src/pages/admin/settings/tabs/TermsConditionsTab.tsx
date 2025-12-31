import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Edit, Plus } from "lucide-react";
import { type TermsCondition } from "@/hooks/useSettings";
import { Badge } from "@/components/ui/badge";
import {
  termsConditionSchema,
  type TermsConditionFormData,
} from "@/lib/validations/settings";

interface TermsConditionsTabProps {
  terms: TermsCondition[];
  isAdmin: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onCreateTerms: (data: TermsConditionFormData) => Promise<TermsCondition>;
  onUpdateTerms: (
    id: string,
    data: Partial<TermsConditionFormData>
  ) => Promise<TermsCondition>;
  onDeleteTerms: (id: string) => Promise<void>;
}

export default function TermsConditionsTab({
  terms,
  isAdmin,
  isCreating,
  isUpdating,
  isDeleting,
  onCreateTerms,
  onUpdateTerms,
  onDeleteTerms,
}: TermsConditionsTabProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const form = useForm<TermsConditionFormData>({
    resolver: zodResolver(termsConditionSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const handleEdit = (term: TermsCondition) => {
    form.reset({
      title: term.title,
      content: term.content,
    });
    setIsEditMode(true);
  };

  const onSubmit = async (data: TermsConditionFormData) => {
    try {
      const activeTerm = terms.find((t) => t.isActive);
      if (activeTerm) {
        await onUpdateTerms(activeTerm.id, data);
      } else {
        await onCreateTerms(data);
      }
      setIsEditMode(false);
      form.reset();
    } catch (error) {
      console.error("Failed to save terms:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await onDeleteTerms(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete terms:", error);
    }
  };

  // Get active term (latest version that is active)
  const activeTerm = terms.find((t) => t.isActive);

  return (
    <div className="space-y-6">
      {isEditMode ? (
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="px-6 border-b border-gray-200">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Terms & Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Terms of Service"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the full terms and conditions..."
                          rows={16}
                          className="font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditMode(false);
                      form.reset();
                    }}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="bg-brand"
                  >
                    {isCreating || isUpdating ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : activeTerm ? (
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="px-5 border-b border-gray-200">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {activeTerm.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Last Revised:{" "}
                {new Date(activeTerm.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="">
            <div className="rounded-md max-h-96 overflow-auto">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {activeTerm.content}
              </p>
            </div>
            {isAdmin && (
              <div className="flex gap-3 justify-end mt-5">
                <Button
                  // variant="outline"
                  className="bg-brand gap-2"
                  onClick={() => handleEdit(activeTerm)}
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                {/* {isEditMode && (
                  <Button
                    className="bg-brand"
                    onClick={() => handleEdit(activeTerm)}
                  >
                    Save
                  </Button>
                )} */}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-dashed">
          <CardContent className="pt-8 pb-8 text-center">
            {isAdmin ? (
              <div className="space-y-4">
                <p className="text-gray-500">
                  No terms and conditions yet. Create your first one!
                </p>
                <Button
                  onClick={() => {
                    form.reset({ title: "", content: "" });
                    setIsEditMode(true);
                  }}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Terms & Conditions
                </Button>
              </div>
            ) : (
              <p className="text-gray-500">
                No terms and conditions available.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Version History (Admin Only) */}
      {isAdmin && terms.length > 1 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Version History
          </h3>
          <div className="space-y-3">
            {terms.map((term) => (
              <Card key={term.id} className="border border-gray-200">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Version {term.version}
                      {term.isActive && (
                        <Badge className="ml-2 bg-blue-600">Active</Badge>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Updated: {new Date(term.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(term)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(term.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Terms & Conditions</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this version? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
