import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

type ColorVariant =
  | "green"
  | "red"
  | "red-light"
  | "blue"
  | "orange"
  | "yellow"
  | "purple";

const colorConfig: Record<
  ColorVariant,
  { bg: string; text: string; icon: string }
> = {
  green: {
    bg: "bg-gradient-to-b from-green-50 to-white",
    text: "text-green-700",
    icon: "text-green-600 bg-green-100",
  },
  red: {
    bg: "bg-gradient-to-b from-red-50 to-white",
    text: "text-red-700",
    icon: "text-red-600 bg-red-100",
  },
  "red-light": {
    bg: "bg-gradient-to-b from-orange-50 to-white",
    text: "text-orange-700",
    icon: "text-orange-600 bg-orange-100",
  },
  blue: {
    bg: "bg-gradient-to-b from-blue-50 to-white",
    text: "text-blue-700",
    icon: "text-blue-600 bg-blue-100",
  },
  orange: {
    bg: "bg-gradient-to-b from-orange-50 to-white",
    text: "text-orange-700",
    icon: "text-orange-600 bg-orange-100",
  },
  yellow: {
    bg: "bg-gradient-to-b from-amber-50 to-white",
    text: "text-amber-700",
    icon: "text-amber-600 bg-amber-100",
  },
  purple: {
    bg: "bg-gradient-to-b from-purple-50 to-white",
    text: "text-purple-700",
    icon: "text-purple-600 bg-purple-100",
  },
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  // trend: {
  //   text: string;
  //   type: "up" | "down" | "neutral";
  // };
  color?: ColorVariant;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  // trend,
  color = "blue",
}: StatCardProps) => {
  const config = colorConfig[color];

  return (
    <Card className={`${config.bg}`}>
      <CardContent className="px-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className={`text-5xl font-medium ${config.text}`}>{value}</p>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {/* <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {trend.type === "up" && (
                <TrendingUp className="h-3 w-3 text-red-500" />
              )}
              {trend.type === "down" && (
                <TrendingDown className="h-3 w-3 text-green-500" />
              )}
              <span>{trend.text}</span>
            </div> */}
          </div>
          <div className={`p-3 rounded-full ${config.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
