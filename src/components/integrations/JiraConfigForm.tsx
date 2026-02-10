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
import { useConfigureJira } from "@/hooks/useIntegrations";
import type { Integration } from "@/hooks/useIntegrations";
import { ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface JiraConfigFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existing?: Integration | null;
}

export default function JiraConfigForm({
  open,
  onOpenChange,
  existing,
}: JiraConfigFormProps) {
  const [form, setForm] = useState({
    domain: "",
    accessToken: "",
    name: "",
  });

  const configureJira = useConfigureJira();

  useEffect(() => {
    if (existing) {
      setForm({
        domain: existing.domain || "",
        accessToken: "",
        name: existing.name || "",
      });
    } else {
      setForm({ domain: "", accessToken: "", name: "" });
    }
  }, [existing, open]);

  const handleSave = () => {
    configureJira.mutate(
      {
        domain: form.domain,
        accessToken: form.accessToken,
        name: form.name || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setForm({ domain: "", accessToken: "", name: "" });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-blue-500" />
            {existing ? "Edit Jira Integration" : "Configure Jira"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jira-name">Name (optional)</Label>
            <Input
              id="jira-name"
              placeholder="e.g., Engineering Board"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jira-domain">Jira Domain *</Label>
            <Input
              id="jira-domain"
              placeholder="company.atlassian.net"
              value={form.domain}
              onChange={(e) =>
                setForm((p) => ({ ...p, domain: e.target.value }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Your Atlassian domain (e.g., company.atlassian.net).
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="jira-token">API Token *</Label>
            <Input
              id="jira-token"
              type="password"
              placeholder={existing ? "Enter new token to update" : "Your Jira API token"}
              value={form.accessToken}
              onChange={(e) =>
                setForm((p) => ({ ...p, accessToken: e.target.value }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Generate an API token from your Atlassian account settings.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !form.domain ||
              !form.accessToken ||
              configureJira.isPending
            }
          >
            {configureJira.isPending && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
