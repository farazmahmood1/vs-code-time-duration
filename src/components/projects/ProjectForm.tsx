import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Check } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import DepartmentSelect from "@/components/common/DepartmentSelect";
import { useEmployees } from "@/hooks/useEmployees";
import {
  useCreateProject,
  useUpdateProject,
  type Project,
} from "@/hooks/useProject";
import {
  projectFormSchema,
  type ProjectFormData,
} from "@/lib/validations/project";

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
}

export function ProjectForm({ open, onOpenChange, project }: ProjectFormProps) {
  const [employeeSearch, setEmployeeSearchState] = useState("");
  const [debouncedSearch] = useDebounce(employeeSearch, 750);
  const [popoverSearch, setPopoverSearch] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    mode: "onChange",
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      departmentId: project?.departmentId || "",
      status: project?.status || "ACTIVE",
      memberIds: project?.members?.map((m) => m.id) || [],
    },
  });

  const { data: employeesData } = useEmployees(
    1,
    debouncedSearch,
    "",
    "",
    "",
    ""
  );
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        description: project.description || "",
        departmentId: project.departmentId || "",
        memberIds: project.members.map((m) => m.id),
        status: project.status,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        departmentId: "",
        memberIds: [],
        status: "ACTIVE",
      });
    }
  }, [project, open, form]);

  const memberIds = form.watch("memberIds") || [];

  // const availableEmployees = (employeesData?.employees || []).filter(
  //   (emp) => !memberIds.includes(emp.id)
  // );

  const selectedMembers = (employeesData?.employees || []).filter((emp) =>
    memberIds.includes(emp.id)
  );

  const handleAddEmployee = (employeeId: string) => {
    const currentMembers = form.getValues("memberIds") || [];
    form.setValue("memberIds", [...currentMembers, employeeId]);
  };

  const handleRemoveEmployee = (employeeId: string) => {
    const currentMembers = form.getValues("memberIds") || [];
    form.setValue(
      "memberIds",
      currentMembers.filter((id) => id !== employeeId)
    );
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      if (project) {
        await updateProjectMutation.mutateAsync({
          id: project.id,
          data,
        });
      } else {
        await createProjectMutation.mutateAsync(data);
      }
      form.reset();
      setEmployeeSearchState("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={project ? "Edit Project" : "Create Project"}
      description={project ? "Update project details" : "Add a new project"}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Project Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter project description"
                    {...field}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Department */}
          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <DepartmentSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select department"
                    variant="outline"
                    width="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Assign Users */}
          <div>
            <Label>Assign Team Members</Label>
            <div className="mt-2 space-y-2">
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {memberIds.length > 0
                      ? `${memberIds.length} member${
                          memberIds.length !== 1 ? "s" : ""
                        } selected`
                      : "Search and add employees..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search employees..."
                      value={popoverSearch}
                      onValueChange={setPopoverSearch}
                    />
                    {!popoverSearch ? (
                      <div className="p-4 text-sm text-muted-foreground text-center">
                        Start typing to search employees...
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>No employee found.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {(employeesData?.employees || [])
                              .filter(
                                (emp) =>
                                  emp.name
                                    .toLowerCase()
                                    .includes(popoverSearch.toLowerCase()) ||
                                  emp.email
                                    .toLowerCase()
                                    .includes(popoverSearch.toLowerCase())
                              )
                              .map((emp) => (
                                <CommandItem
                                  key={emp.id}
                                  onSelect={() => {
                                    if (memberIds.includes(emp.id)) {
                                      handleRemoveEmployee(emp.id);
                                    } else {
                                      handleAddEmployee(emp.id);
                                    }
                                    // Close popover and clear search after selection
                                    setIsPopoverOpen(false);
                                    setPopoverSearch("");
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      memberIds.includes(emp.id)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col gap-1 flex-1">
                                    <div className="font-medium">
                                      {emp.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {emp.email}
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </>
                    )}
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Assigned Users */}
              {selectedMembers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map((user) => (
                    <Badge key={user.id} variant="secondary" className="gap-1">
                      {user.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveEmployee(user.id)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={
                createProjectMutation.isPending ||
                updateProjectMutation.isPending
              }
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createProjectMutation.isPending ||
                updateProjectMutation.isPending
              }
            >
              {createProjectMutation.isPending ||
              updateProjectMutation.isPending
                ? "Saving..."
                : project
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveDialog>
  );
}
