import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { OrgChartNode } from "@/hooks/useOrgChart";

interface OrgChartNodeCardProps {
  node: OrgChartNode;
}

export function OrgChartNodeCard({ node }: OrgChartNodeCardProps) {
  return (
    <div className="inline-flex flex-col items-center gap-1 px-4 py-3 border rounded-lg bg-card shadow-sm min-w-[140px]">
      <Avatar className="h-10 w-10">
        <AvatarImage src={node.image || ""} />
        <AvatarFallback className="text-xs">
          {node.name
            ?.split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="font-medium text-sm text-center">{node.name}</span>
      {node.role && (
        <Badge variant="outline" className="text-[10px]">
          {node.role}
        </Badge>
      )}
      {node.department && (
        <span className="text-[10px] text-muted-foreground">
          {node.department.name}
        </span>
      )}
    </div>
  );
}
