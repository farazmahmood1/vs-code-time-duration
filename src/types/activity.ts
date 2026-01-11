export interface ActivityLog {
    id: string;
    sessionId: string;
    timestamp: string; // ISO DateTime
    keyboardCount: number;
    mouseDistance: number;
    clickCount: number;
    windowTitle: string;
    appName: string;
    isIdle: boolean;
    duration?: number; // Optional: derived or from backend for aggregation
}

export interface ActivitySession {
    id: string;
    employeeId: string;
    employeeName: string;
    startTime: string;
    endTime: string | null;
    duration: number; // in seconds
    activityLogs: ActivityLog[];
    // Aggregated stats
    totalKeyboard: number;
    totalClicks: number;
    totalMouseDistance: number;
    idlePercentage: number;
    activeTime: number;
    idleTime: number;
}

export interface ActivityStats {
    topApps: { name: string; duration: number; percentage: number }[];
    timeline: {
        hour: string; // "09:00"
        intensity: number; // 0-100
        status: "active" | "idle" | "offline";
    }[];
}
