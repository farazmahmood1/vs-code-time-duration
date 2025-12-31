import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DepartmentSelect from "@/components/common/DepartmentSelect";

interface EmployeeFiltersProps {
  department: string;
  setDepartment: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
}

export const EmployeeFilters = ({
  department,
  setDepartment,
  role,
  setRole,
}: EmployeeFiltersProps) => {
  return (
    <div className="flex gap-2">
      <div className="">
        <DepartmentSelect
          value={department}
          onValueChange={setDepartment}
          showAllOption={true}
        />
      </div>

      <Select value={role} onValueChange={setRole}>
        <SelectTrigger className="w-[140px] bg-primary text-primary-foreground">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="employee">Employee</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
