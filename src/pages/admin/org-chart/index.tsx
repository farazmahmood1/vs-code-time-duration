import { Tree, TreeNode } from "react-organizational-chart";
import { OrgChartNodeCard } from "@/components/org-chart/OrgChartNodeCard";
import { useOrgChart, type OrgChartNode } from "@/hooks/useOrgChart";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

function renderTree(node: OrgChartNode) {
  if (!node.children?.length) {
    return (
      <TreeNode key={node.id} label={<OrgChartNodeCard node={node} />} />
    );
  }
  return (
    <TreeNode key={node.id} label={<OrgChartNodeCard node={node} />}>
      {node.children.map((child) => renderTree(child))}
    </TreeNode>
  );
}

export default function OrgChartPage() {
  const { data: roots, isLoading } = useOrgChart();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Organization Chart
        </h1>
        <p className="text-muted-foreground">
          View the company hierarchy and reporting structure.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : !roots?.length ? (
        <div className="text-center text-muted-foreground py-12">
          No employees found. Set up manager relationships to build the org
          chart.
        </div>
      ) : (
        <ScrollArea className="w-full overflow-x-auto">
          <div className="min-w-[800px] py-8 flex justify-center">
            {roots.length === 1 ? (
              <Tree
                lineWidth="2px"
                lineColor="hsl(var(--border))"
                lineBorderRadius="8px"
                label={<OrgChartNodeCard node={roots[0]} />}
              >
                {roots[0].children.map((child) => renderTree(child))}
              </Tree>
            ) : (
              <div className="space-y-8">
                {roots.map((root) => (
                  <Tree
                    key={root.id}
                    lineWidth="2px"
                    lineColor="hsl(var(--border))"
                    lineBorderRadius="8px"
                    label={<OrgChartNodeCard node={root} />}
                  >
                    {root.children.map((child) => renderTree(child))}
                  </Tree>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
