import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Briefcase } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Code, GraduationCap } from "lucide-react";
import type {
  Employee,
  FormattedExperience,
  FormattedEducation,
} from "./types";

interface EmployeeTabsContentProps {
  employee: Employee;
}

export const EmployeeTabsContent = ({ employee }: EmployeeTabsContentProps) => {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden md:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="experience" className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          <span className="hidden md:inline">Experience</span>
        </TabsTrigger>
        <TabsTrigger value="skills" className="flex items-center gap-2">
          <Code className="h-4 w-4" />
          <span className="hidden md:inline">Skills</span>
        </TabsTrigger>
        <TabsTrigger value="education" className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          <span className="hidden md:inline">Education</span>
        </TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardContent className="space-y-2">
            <h2 className="font-semibold text-lg">About</h2>
            <p className="text-sm leading-relaxed">{employee.bio}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">
                  Name
                </p>
                <p className="text-sm font-medium">{employee.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">
                  Department
                </p>
                <p className="text-sm font-medium">{employee.department}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">
                  Employee ID
                </p>
                <p className="text-sm font-medium">
                  {employee.uniqueId || employee.id}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">
                  Role
                </p>
                <p className="text-sm font-medium capitalize">
                  {employee.role}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Experience Tab */}
      <TabsContent value="experience" className="space-y-4">
        {employee.experience && employee.experience.length > 0 ? (
          employee.experience.map((exp: FormattedExperience) => (
            <Card key={exp.id}>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">{exp.title}</h3>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {exp.period}
                </div>
                <p className="text-sm">{exp.description}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="">
              <p className="text-sm text-muted-foreground">
                No experience records available
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* Skills Tab */}
      <TabsContent value="skills" className="space-y-4">
        <Card>
          <CardContent>
            {employee.skills && employee.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {employee.skills.map((skill: string, idx: number) => (
                  <Badge key={idx} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No skills available
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Education Tab */}
      <TabsContent value="education" className="space-y-4">
        {employee.education && employee.education.length > 0 ? (
          employee.education.map((edu: FormattedEducation) => (
            <Card key={edu.id}>
              <CardContent className="space-y-2">
                <div>
                  <h3 className="text-lg font-semibold">{edu.degree}</h3>
                  <p className="text-sm text-muted-foreground">{edu.field}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  {edu.institution}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {edu.period}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No education records available
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
};
