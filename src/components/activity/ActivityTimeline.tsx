import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TimelineBlock {
    startTime: string;
    status: "active" | "idle" | "offline";
    durationMinutes: number;
    label?: string; // App name or "Idle"
}

interface ActivityTimelineProps {
    blocks: TimelineBlock[];
}

export const ActivityTimeline = ({ blocks }: ActivityTimelineProps) => {
    // Normalize blocks to span a 12h or 24h period, or just flex them
    // For this implementation, we'll assume a linear flex layout representing the session duration

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-emerald-500 hover:bg-emerald-600";
            case "idle":
                return "bg-amber-500/50 hover:bg-amber-500/70"; // Semi-transparent for idle
            default:
                return "bg-slate-200 dark:bg-slate-800";
        }
    };

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex h-12 w-full rounded-md overflow-hidden border">
                    <TooltipProvider>
                        {blocks.map((block, index) => (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <div
                                        className={cn(
                                            "h-full transition-colors cursor-pointer border-r border-background/10 last:border-0",
                                            getStatusColor(block.status)
                                        )}
                                        style={{
                                            flex: block.durationMinutes, // Width proportional to duration
                                        }}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="text-xs">
                                        <p className="font-semibold">{format(new Date(block.startTime), "hh:mm a")}</p>
                                        <p>{block.status === "active" ? "Active" : "Idle"} - {block.durationMinutes} min</p>
                                        {block.label && <p className="text-muted-foreground">{block.label}</p>}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </TooltipProvider>
                    {blocks.length === 0 && (
                        <div className="flex w-full items-center justify-center bg-muted text-muted-foreground text-sm">
                            No activity data
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                        <span>Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-amber-500/50" />
                        <span>Idle</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-800" />
                        <span>Offline</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
