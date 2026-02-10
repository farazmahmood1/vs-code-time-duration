import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { Integration } from "@/hooks/useIntegrations";
import {
  useDeleteIntegration,
  useTestIntegration,
  useToggleIntegration,
} from "@/hooks/useIntegrations";
import {
  Calendar,
  ExternalLink,
  Loader2,
  MessageSquare,
  Trash2,
  TestTube,
  Users,
} from "lucide-react";

const INTEGRATION_META: Record<
  string,
  { icon: React.ElementType; color: string; label: string }
> = {
  SLACK: { icon: MessageSquare, color: "text-purple-600", label: "Slack" },
  TEAMS: { icon: Users, color: "text-blue-600", label: "Microsoft Teams" },
  GOOGLE_CALENDAR: {
    icon: Calendar,
    color: "text-green-600",
    label: "Google Calendar",
  },
  JIRA: { icon: ExternalLink, color: "text-blue-500", label: "Jira" },
  CLICKUP: { icon: ExternalLink, color: "text-violet-600", label: "ClickUp" },
};

interface IntegrationCardProps {
  integration: Integration;
  onEdit: (integration: Integration) => void;
}

export default function IntegrationCard({
  integration,
  onEdit,
}: IntegrationCardProps) {
  const toggleIntegration = useToggleIntegration();
  const deleteIntegration = useDeleteIntegration();
  const testIntegration = useTestIntegration();

  const meta = INTEGRATION_META[integration.type] || {
    icon: ExternalLink,
    color: "text-gray-500",
    label: integration.type,
  };
  const Icon = meta.icon;

  const canTest =
    integration.type === "SLACK" || integration.type === "TEAMS";

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this integration?")) {
      deleteIntegration.mutate(integration.id);
    }
  };

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${meta.color}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold leading-none">
              {integration.name || meta.label}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{meta.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              integration.isActive ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <Switch
            checked={integration.isActive}
            onCheckedChange={() => toggleIntegration.mutate(integration.id)}
            disabled={toggleIntegration.isPending}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={integration.isActive ? "default" : "secondary"}>
            {integration.isActive ? "Active" : "Inactive"}
          </Badge>
          {integration.domain && (
            <Badge variant="outline">{integration.domain}</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Last updated:{" "}
          {new Date(integration.updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <div className="flex items-center gap-2">
          {canTest && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => testIntegration.mutate(integration.id)}
              disabled={testIntegration.isPending}
            >
              {testIntegration.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <TestTube className="h-3.5 w-3.5" />
              )}
              Test
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(integration)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={handleDelete}
            disabled={deleteIntegration.isPending}
          >
            {deleteIntegration.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
