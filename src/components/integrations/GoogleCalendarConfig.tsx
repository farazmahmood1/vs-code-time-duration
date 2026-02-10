import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useConfigureGoogleCalendar } from "@/hooks/useIntegrations";
import type { Integration } from "@/hooks/useIntegrations";
import { Calendar, Loader2 } from "lucide-react";

interface GoogleCalendarConfigProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existing?: Integration | null;
}

export default function GoogleCalendarConfig({
  open,
  onOpenChange,
  existing,
}: GoogleCalendarConfigProps) {
  const configureGoogleCalendar = useConfigureGoogleCalendar();

  const isConnected = !!existing;

  const handleConnect = () => {
    configureGoogleCalendar.mutate(
      {
        accessToken: "placeholder-access-token",
        refreshToken: "placeholder-refresh-token",
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            Google Calendar Integration
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Connection Status</span>
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            {isConnected && (
              <p className="text-xs text-muted-foreground">
                Connected since{" "}
                {new Date(existing.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              {isConnected
                ? "Your Google Calendar is connected. Calendar events from Forrof Tracker will sync automatically. You can reconnect if you experience any issues."
                : "Connect your Google Calendar to sync shifts, leaves, and meetings directly to your calendar. This will require OAuth authorization with your Google account."}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">What syncs:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Approved leave requests</li>
              <li>Shift schedules</li>
              <li>Team meetings and standups</li>
              <li>Review deadlines</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConnect}
            disabled={configureGoogleCalendar.isPending}
            className="gap-2"
          >
            {configureGoogleCalendar.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            <Calendar className="h-4 w-4" />
            {isConnected ? "Reconnect" : "Connect Google Calendar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
