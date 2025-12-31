import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Copy, Check } from "lucide-react";
import { type ImportantLink } from "@/hooks/useSettings";
import {
  importantLinkSchema,
  type ImportantLinkFormData,
} from "@/lib/validations/settings";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import { toast } from "sonner";

interface ImportantLinksTabProps {
  links: ImportantLink[];
  isAdmin: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onCreateLink: (data: ImportantLinkFormData) => Promise<ImportantLink>;
  onUpdateLink: (
    id: string,
    data: Partial<ImportantLinkFormData>
  ) => Promise<ImportantLink>;
  onDeleteLink: (id: string) => Promise<void>;
}

export default function ImportantLinksTab({
  links,
  isAdmin,
  isCreating,
  isUpdating,
  isDeleting,
  onCreateLink,
  onUpdateLink,
  onDeleteLink,
}: ImportantLinksTabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<ImportantLink | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const form = useForm<ImportantLinkFormData>({
    resolver: zodResolver(importantLinkSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  const handleAddLink = () => {
    form.reset({
      title: "",
      url: "",
    });
    setEditingLink(null);
    setIsAddOpen(true);
  };

  const handleEditLink = (link: ImportantLink) => {
    if (!isAdmin) return;
    form.reset({
      title: link.title,
      url: link.url,
    });
    setEditingLink(link);
    setIsOpen(true);
  };

  const handleCopy = (url: string, linkId: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(linkId);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const onSubmit = async (data: ImportantLinkFormData) => {
    try {
      if (editingLink) {
        await onUpdateLink(editingLink.id, data);
      } else {
        await onCreateLink(data);
      }
      setIsOpen(false);
      setIsAddOpen(false);
      form.reset();
      setEditingLink(null);
    } catch (error) {
      console.error("Failed to save link:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await onDeleteLink(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Important Links</h1>

          <p className="text-sm text-gray-600 mt-1">
            {isAdmin ? "Manage Important Links" : "View Important Links"}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={handleAddLink} className="gap-2 ">
            <Plus className="w-4 h-4" />
            Add Link
          </Button>
        )}
      </div>

      {links.length === 0 ? (
        <Card className="border border-dashed">
          <CardContent className="pt-8 pb-8 text-center text-gray-500">
            {isAdmin
              ? "No links yet. Add your first link!"
              : "No important links available."}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {links.map((link) => (
            <div key={link.id}>
              <h3 className="text-base font-medium text-gray-900 mb-1">
                {link.title}
              </h3>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    value={link.url}
                    readOnly
                    onClick={() => isAdmin && handleEditLink(link)}
                    className={`w-full pr-12 ${
                      isAdmin
                        ? "cursor-pointer hover:bg-gray-100"
                        : "cursor-default"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(link.url, link.id)}
                    className="absolute right-2 cursor-pointer top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Copy URL"
                  >
                    {copiedId === link.id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {isAdmin && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setDeleteId(link.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <ResponsiveDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Edit Link"
        description="Update the link details"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Slack Workspace" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </ResponsiveDialog>

      {/* Add Modal */}
      <ResponsiveDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        title="Add New Link"
        description="Add a new important link for the company"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Slack Workspace" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Adding..." : "Add Link"}
              </Button>
            </div>
          </form>
        </Form>
      </ResponsiveDialog>

      {/* Delete Confirmation Dialog */}
      <ResponsiveDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Link"
        description="Are you sure you want to delete this link? This action cannot be undone."
      >
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => setDeleteId(null)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </ResponsiveDialog>
    </div>
  );
}
