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
import { useConfigureTeams, useTestIntegration } from "@/hooks/useIntegrations";
import type { Integration } from "@/hooks/useIntegrations";
import { Loader2, TestTube, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface TeamsConfigFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existing?: Integration | null;
}

export default function TeamsConfigForm({
  open,
  onOpenChange,
  existing,
}: TeamsConfigFormProps) {
  const [form, setForm] = useState({
    webhookUrl: "",
    name: "",
  });

  const configureTeams = useConfigureTeams();
  const testIntegration = useTestIntegration();

  useEffect(() => {
    if (existing) {
      setForm({
        webhookUrl: existing.webhookUrl || "",
        name: existing.name || "",
      });
    } else {
      setForm({ webhookUrl: "", name: "" });
    }
  }, [existing, open]);

  const handleSave = () => {
    configureTeams.mutate(
      {
        webhookUrl: form.webhookUrl,
        name: form.name || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setForm({ webhookUrl: "", name: "" });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            {existing ? "Edit Teams Integration" : "Configure Microsoft Teams"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teams-name">Name (optional)</Label>
            <Input
              id="teams-name"
              placeholder="e.g., General Channel"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teams-webhook">Webhook URL *</Label>
            <Input
              id="teams-webhook"
              placeholder="https://outlook.office.com/webhook/..."
              value={form.webhookUrl}
              onChange={(e) =>
                setForm((p) => ({ ...p, webhookUrl: e.target.value }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Create an Incoming Webhook connector in your Teams channel
              settings.
            </p>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          {existing && (
            <Button
              variant="outline"
              className="gap-1.5"
              onClick={() => testIntegration.mutate(existing.id)}
              disabled={testIntegration.isPending}
            >
              {testIntegration.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4" />
              )}
              Test Connection
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!form.webhookUrl || configureTeams.isPending}
            >
              {configureTeams.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
