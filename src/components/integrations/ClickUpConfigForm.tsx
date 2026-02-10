import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConfigureClickUp } from "@/hooks/useIntegrations";
import type { Integration } from "@/hooks/useIntegrations";
import { ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ClickUpConfigFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existing?: Integration | null;
}

export default function ClickUpConfigForm({
  open,
  onOpenChange,
  existing,
}: ClickUpConfigFormProps) {
  const [form, setForm] = useState({
    accessToken: "",
    name: "",
  });

  const configureClickUp = useConfigureClickUp();

  useEffect(() => {
    if (existing) {
      setForm({
        accessToken: "",
        name: existing.name || "",
      });
    } else {
      setForm({ accessToken: "", name: "" });
    }
  }, [existing, open]);

  const handleSave = () => {
    configureClickUp.mutate(
      {
        accessToken: form.accessToken,
        name: form.name || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setForm({ accessToken: "", name: "" });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-violet-600" />
            {existing ? "Edit ClickUp Integration" : "Configure ClickUp"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clickup-name">Name (optional)</Label>
            <Input
              id="clickup-name"
              placeholder="e.g., Product Workspace"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clickup-token">API Token *</Label>
            <Input
              id="clickup-token"
              type="password"
              placeholder={
                existing ? "Enter new token to update" : "Your ClickUp API token"
              }
              value={form.accessToken}
              onChange={(e) =>
                setForm((p) => ({ ...p, accessToken: e.target.value }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Find your API token in ClickUp Settings &gt; Apps &gt; API Token.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!form.accessToken || configureClickUp.isPending}
          >
            {configureClickUp.isPending && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
