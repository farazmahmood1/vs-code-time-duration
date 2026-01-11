import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActivityScoreProps {
    score: number; // 0 to 100
    label?: string;
    trend?: number; // Previous score to show improvement/decline
}

export const ActivityScore = ({ score, label = "Activity Score" }: ActivityScoreProps) => {
    // Determine color based on score
    const getColor = (value: number) => {
        if (value >= 80) return "text-emerald-500";
        if (value >= 60) return "text-blue-500";
        if (value >= 40) return "text-yellow-500";
        return "text-red-500";
    };

    const colorClass = getColor(score);

    // Calculate circumference for SVG circle
    const radius = 60;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {label}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative flex items-center justify-center">
                        {/* Background Circle */}
                        <svg
                            height={radius * 2}
                            width={radius * 2}
                            className="rotate-[-90deg]"
                        >
                            <circle
                                stroke="currentColor"
                                fill="transparent"
                                strokeWidth={stroke}
                                r={normalizedRadius}
                                cx={radius}
                                cy={radius}
                                className="text-muted/20"
                            />
                            <circle
                                stroke="currentColor"
                                fill="transparent"
                                strokeWidth={stroke}
                                strokeDasharray={circumference + " " + circumference}
                                style={{ strokeDashoffset }}
                                strokeLinecap="round"
                                r={normalizedRadius}
                                cx={radius}
                                cy={radius}
                                className={cn("transition-all duration-1000 ease-out", colorClass)}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={cn("text-3xl font-bold", colorClass)}>
                                {score}%
                            </span>
                        </div>
                    </div>
                    <p className="text-sm text-center text-muted-foreground w-full px-4">
                        {score >= 80 ? "Excellent productivity!" : score >= 50 ? "Consistent activity." : "Low activity detected."}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
