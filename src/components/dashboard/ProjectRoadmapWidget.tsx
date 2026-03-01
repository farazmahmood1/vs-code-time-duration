import { useProjects } from "@/hooks/useProject";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, Loader2 } from "lucide-react";

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  COMPLETED: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  INACTIVE: "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400",
};

const progressColors: string[] = [
  "[&>div]:bg-indigo-500",
  "[&>div]:bg-violet-500",
  "[&>div]:bg-cyan-500",
  "[&>div]:bg-amber-500",
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const ProjectRoadmapWidget = () => {
  const { data, isLoading } = useProjects({ limit: 4, status: "ACTIVE" });

  const projects = data?.data || [];
  const maxHours = Math.max(...projects.map((p) => p.totalHours || 1), 1);

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 hover:shadow-md transition-all duration-300 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
            <FolderKanban className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Project Roadmap</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Active projects overview</p>
          </div>
        </div>
        {data && (
          <Badge variant="secondary" className="rounded-lg text-xs">
            {data.meta.total} total
          </Badge>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : projects.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          No active projects
        </p>
      ) : (
        <div className="space-y-5">
          {projects.map((project, index) => {
            const progress = Math.min(
              Math.round((project.totalHours / maxHours) * 100),
              100
            );
            return (
              <div key={project.id} className="space-y-2.5">
                {/* Row 1: Name + Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium text-foreground truncate">
                      {project.name}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md shrink-0 ${statusColors[project.status] || statusColors.INACTIVE}`}>
                      {project.status}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium shrink-0 ml-2">
                    {project.totalHours}h
                  </span>
                </div>

                {/* Row 2: Progress bar */}
                <div className="flex items-center gap-3">
                  <Progress
                    value={progress}
                    className={`h-2 flex-1 rounded-full ${progressColors[index % progressColors.length]}`}
                  />
                  <span className="text-[11px] text-muted-foreground font-medium w-9 text-right">
                    {progress}%
                  </span>
                </div>

                {/* Row 3: Member avatars */}
                {project.members.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 4).map((member) => (
                        <Avatar
                          key={member.id}
                          className="h-6 w-6 border-2 border-card ring-0"
                        >
                          <AvatarImage src={undefined} alt={member.name} />
                          <AvatarFallback className="text-[9px] font-medium bg-muted">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.members.length > 4 && (
                        <div className="h-6 w-6 rounded-full border-2 border-card bg-muted flex items-center justify-center">
                          <span className="text-[9px] font-medium text-muted-foreground">
                            +{project.members.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {project.assignedUsers} member{project.assignedUsers !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
