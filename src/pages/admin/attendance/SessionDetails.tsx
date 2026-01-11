import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { ActivityTimeline } from "@/components/activity/ActivityTimeline";
import { TopAppsChart } from "@/components/activity/TopAppsChart";
import { ActivityScore } from "@/components/activity/ActivityScore";
import { ActivityIntensityChart } from "@/components/activity/ActivityIntensityChart";
import { useEmployeeSessions } from "@/hooks/useActivityData";
import { format } from "date-fns";
import type { ActivitySession } from "@/types/activity";

const SessionDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { employeeId: string; date: string; employeeName: string } | null;

    // If accessed directly without state, we can't show info currently (need an API to fetch attendance by ID)
    // For now, redirect or show error if missing
    const { employeeId, date, employeeName } = state || {};

    const { data: sessions, isLoading, error } = useEmployeeSessions(
        employeeId || "",
        date ? new Date(date) : new Date()
    );

    if (!state) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <h1 className="text-2xl font-bold">Missing Navigation Context</h1>
                <p className="text-muted-foreground">Please access this page from the Attendance table.</p>
                <Button onClick={() => navigate("/attendance")}>Go Back</Button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <h1 className="text-2xl font-bold text-red-500">Error Loading Data</h1>
                <p className="text-muted-foreground">
                    {error instanceof Error ? error.message : "Failed to fetch session data"}
                </p>
                <Button onClick={() => navigate("/attendance")}>Go Back</Button>
            </div>
        );
    }

    // Handle empty sessions
    if (!sessions || sessions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <h1 className="text-2xl font-bold">No Activity Data</h1>
                <p className="text-muted-foreground">
                    No activity sessions found for {employeeName} on {format(new Date(date || new Date()), "PPP")}
                </p>
                <Button onClick={() => navigate("/attendance")}>Go Back</Button>
            </div>
        );
    }

    // Aggregate Sessions into one "Daily" view
    const aggregatedSession: Partial<ActivitySession> = {
        employeeName: employeeName,
        startTime: date || new Date().toISOString(),
        activeTime: 0,
        idleTime: 0,
        totalClicks: 0,
        activityLogs: []
    };

    const allLogs = sessions?.flatMap(s => s.activityLogs || []) || [];

    // Recalculate totals from sessions if available, or logs
    sessions?.forEach(session => {
        aggregatedSession.activeTime = (aggregatedSession.activeTime || 0) + (session.activeTime || 0);
        aggregatedSession.idleTime = (aggregatedSession.idleTime || 0) + (session.idleTime || 0);
        aggregatedSession.totalClicks = (aggregatedSession.totalClicks || 0) + (session.totalClicks || 0);
    });

    // Timeline Data (merged from all sessions)
    const timelineData = allLogs.map(log => ({
        startTime: log.timestamp,
        status: log.isIdle ? "idle" : "active" as "idle" | "active",
        durationMinutes: 10, // Default chunk size
        label: log.appName
    }));

    // Top Apps (Aggregated)
    const appDurations: Record<string, number> = {};
    allLogs.forEach(log => {
        if (!log.isIdle) {
            appDurations[log.appName] = (appDurations[log.appName] || 0) + 600;
        }
    });

    const topAppsData = Object.entries(appDurations)
        .map(([name, duration]) => ({
            name,
            duration,
            percentage: aggregatedSession.activeTime ? Math.round((duration / aggregatedSession.activeTime) * 100) : 0
        }))
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5);

    // Intensity Data
    const intensityData = allLogs.map(log => ({
        time: log.timestamp,
        keyboardCount: log.keyboardCount,
        mouseClicks: log.clickCount
    }));

    // Calculate Score
    const totalDuration = (aggregatedSession.activeTime || 0) + (aggregatedSession.idleTime || 0);
    const score = totalDuration > 0 ? Math.round(((aggregatedSession.activeTime || 0) / totalDuration) * 100) : 0;

    return (
        <div className="space-y-6 container mx-auto py-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Daily Activity Details</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                            <User className="h-3 w-3" /> {employeeName}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {format(new Date(date || new Date()), "PPP")}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                {/* Activity Score */}
                <ActivityScore score={score} />

                {/* Stats Cards */}
                <div className="md:col-span-3 grid grid-cols-3 gap-4">
                    <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                        <div className="text-sm font-medium text-muted-foreground">Active Time</div>
                        <div className="text-2xl font-bold">{Math.floor((aggregatedSession.activeTime || 0) / 3600)}h {Math.floor(((aggregatedSession.activeTime || 0) % 3600) / 60)}m</div>
                    </div>
                    <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                        <div className="text-sm font-medium text-muted-foreground">Idle Time</div>
                        <div className="text-2xl font-bold">{Math.floor((aggregatedSession.idleTime || 0) / 3600)}h {Math.floor(((aggregatedSession.idleTime || 0) % 3600) / 60)}m</div>
                    </div>
                    <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                        <div className="text-sm font-medium text-muted-foreground">Total Clicks</div>
                        <div className="text-2xl font-bold">{aggregatedSession.totalClicks?.toLocaleString()}</div>
                    </div>
                </div>

                {/* Timeline */}
                <ActivityTimeline blocks={timelineData} />

                {/* Charts Row */}
                <div className="col-span-4 grid md:grid-cols-3 gap-6">
                    <TopAppsChart data={topAppsData} />
                    <ActivityIntensityChart data={intensityData} />
                </div>
            </div>
        </div>
    );
};

export default SessionDetails;
