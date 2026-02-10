import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ClickUpConfigForm from "@/components/integrations/ClickUpConfigForm";
import GoogleCalendarConfig from "@/components/integrations/GoogleCalendarConfig";
import IntegrationCard from "@/components/integrations/IntegrationCard";
import JiraConfigForm from "@/components/integrations/JiraConfigForm";
import SlackConfigForm from "@/components/integrations/SlackConfigForm";
import TeamsConfigForm from "@/components/integrations/TeamsConfigForm";
import { useIntegrations } from "@/hooks/useIntegrations";
import type { Integration, IntegrationType } from "@/hooks/useIntegrations";
import {
  Calendar,
  ExternalLink,
  Loader2,
  MessageSquare,
  Plug,
  Plus,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

type DialogType = IntegrationType | null;

export default function IntegrationsPage() {
  const { data: integrations, isLoading } = useIntegrations();
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [editingIntegration, setEditingIntegration] =
    useState<Integration | null>(null);

  const openDialog = (type: IntegrationType, existing?: Integration) => {
    setEditingIntegration(existing || null);
    setActiveDialog(type);
  };

  const closeDialog = () => {
    setActiveDialog(null);
    setEditingIntegration(null);
  };

  const handleEdit = (integration: Integration) => {
    openDialog(integration.type, integration);
  };

  const hasIntegrations = integrations && integrations.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">
            Connect third-party services to enhance your workflow
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Integration
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={() => openDialog("SLACK")}
              className="gap-2 cursor-pointer"
            >
              <MessageSquare className="h-4 w-4 text-purple-600" />
              Slack
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => openDialog("TEAMS")}
              className="gap-2 cursor-pointer"
            >
              <Users className="h-4 w-4 text-blue-600" />
              Microsoft Teams
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => openDialog("GOOGLE_CALENDAR")}
              className="gap-2 cursor-pointer"
            >
              <Calendar className="h-4 w-4 text-green-600" />
              Google Calendar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => openDialog("JIRA")}
              className="gap-2 cursor-pointer"
            >
              <ExternalLink className="h-4 w-4 text-blue-500" />
              Jira
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => openDialog("CLICKUP")}
              className="gap-2 cursor-pointer"
            >
              <ExternalLink className="h-4 w-4 text-violet-600" />
              ClickUp
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : !hasIntegrations ? (
        <Card className="p-12 text-center">
          <Plug className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            No integrations configured
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Connect your favorite tools like Slack, Microsoft Teams, Google
            Calendar, Jira, or ClickUp to streamline your team's workflow.
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2">
                <Zap className="h-4 w-4" />
                Get Started
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56">
              <DropdownMenuItem
                onClick={() => openDialog("SLACK")}
                className="gap-2 cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 text-purple-600" />
                Slack
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openDialog("TEAMS")}
                className="gap-2 cursor-pointer"
              >
                <Users className="h-4 w-4 text-blue-600" />
                Microsoft Teams
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openDialog("GOOGLE_CALENDAR")}
                className="gap-2 cursor-pointer"
              >
                <Calendar className="h-4 w-4 text-green-600" />
                Google Calendar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openDialog("JIRA")}
                className="gap-2 cursor-pointer"
              >
                <ExternalLink className="h-4 w-4 text-blue-500" />
                Jira
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openDialog("CLICKUP")}
                className="gap-2 cursor-pointer"
              >
                <ExternalLink className="h-4 w-4 text-violet-600" />
                ClickUp
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Config Dialogs */}
      <SlackConfigForm
        open={activeDialog === "SLACK"}
        onOpenChange={(open) => !open && closeDialog()}
        existing={editingIntegration?.type === "SLACK" ? editingIntegration : null}
      />
      <TeamsConfigForm
        open={activeDialog === "TEAMS"}
        onOpenChange={(open) => !open && closeDialog()}
        existing={editingIntegration?.type === "TEAMS" ? editingIntegration : null}
      />
      <GoogleCalendarConfig
        open={activeDialog === "GOOGLE_CALENDAR"}
        onOpenChange={(open) => !open && closeDialog()}
        existing={
          editingIntegration?.type === "GOOGLE_CALENDAR"
            ? editingIntegration
            : integrations?.find((i) => i.type === "GOOGLE_CALENDAR") || null
        }
      />
      <JiraConfigForm
        open={activeDialog === "JIRA"}
        onOpenChange={(open) => !open && closeDialog()}
        existing={editingIntegration?.type === "JIRA" ? editingIntegration : null}
      />
      <ClickUpConfigForm
        open={activeDialog === "CLICKUP"}
        onOpenChange={(open) => !open && closeDialog()}
        existing={
          editingIntegration?.type === "CLICKUP" ? editingIntegration : null
        }
      />
    </div>
  );
}
