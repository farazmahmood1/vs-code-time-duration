import * as React from "react";
import { Check, ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { useDepartments } from "@/hooks/useDepartments";

interface DepartmentSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  showAllOption?: boolean;
  disabled?: boolean;
  variant?: "default" | "outline" | "ghost";
  width?: string;
}

const DepartmentSelect = ({
  value,
  onValueChange,
  placeholder = "Department",
  showAllOption = false,
  disabled = false,
  variant = "default",
  width = "max-w-52",
}: DepartmentSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const { data } = useDepartments();

  const departments = data?.data || [];

  const selectedDept = departments.find((dept) => dept.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          role="combobox"
          aria-expanded={open}
          className={cn(`justify-between ${width}`)}
          disabled={disabled}
        >
          {value === "" ? placeholder : selectedDept?.name || placeholder}
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search departments..." className="h-9" />
          <CommandList>
            <CommandEmpty>No department found.</CommandEmpty>
            <CommandGroup>
              {showAllOption && (
                <CommandItem
                  value="all"
                  onSelect={() => {
                    onValueChange("");
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === "" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  All Departments
                </CommandItem>
              )}
              {departments.map((dept) => (
                <CommandItem
                  key={dept.id}
                  value={dept.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === dept.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {dept.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DepartmentSelect;
