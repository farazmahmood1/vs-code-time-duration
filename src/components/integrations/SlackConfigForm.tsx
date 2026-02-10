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
import { useConfigureSlack, useTestIntegration } from "@/hooks/useIntegrations";
import type { Integration } from "@/hooks/useIntegrations";
import { Loader2, MessageSquare, TestTube } from "lucide-react";
import { useEffect, useState } from "react";

interface SlackConfigFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existing?: Integration | null;
}

export default function SlackConfigForm({
  open,
  onOpenChange,
  existing,
}: SlackConfigFormProps) {
  const [form, setForm] = useState({
    webhookUrl: "",
    channelId: "",
    name: "",
  });

  const configureSlack = useConfigureSlack();
  const testIntegration = useTestIntegration();

  useEffect(() => {
    if (existing) {
      setForm({
        webhookUrl: existing.webhookUrl || "",
        channelId: existing.channelId || "",
        name: existing.name || "",
      });
    } else {
      setForm({ webhookUrl: "", channelId: "", name: "" });
    }
  }, [existing, open]);

  const handleSave = () => {
    configureSlack.mutate(
      {
        webhookUrl: form.webhookUrl,
        channelId: form.channelId || undefined,
        name: form.name || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setForm({ webhookUrl: "", channelId: "", name: "" });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            {existing ? "Edit Slack Integration" : "Configure Slack"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slack-name">Name (optional)</Label>
            <Input
              id="slack-name"
              placeholder="e.g., #general notifications"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slack-webhook">Webhook URL *</Label>
            <Input
              id="slack-webhook"
              placeholder="https://hooks.slack.com/services/..."
              value={form.webhookUrl}
              onChange={(e) =>
                setForm((p) => ({ ...p, webhookUrl: e.target.value }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Create an Incoming Webhook in your Slack workspace settings.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="slack-channel">Channel ID (optional)</Label>
            <Input
              id="slack-channel"
              placeholder="C01234ABCDE"
              value={form.channelId}
              onChange={(e) =>
                setForm((p) => ({ ...p, channelId: e.target.value }))
              }
            />
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
              disabled={!form.webhookUrl || configureSlack.isPending}
            >
              {configureSlack.isPending && (
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
