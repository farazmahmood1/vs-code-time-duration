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
import { useProjects } from "@/hooks/useProject";

interface ProjectSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  showAllOption?: boolean;
  disabled?: boolean;
  variant?: "default" | "outline" | "ghost";
  width?: string;
}

const ProjectSelect = ({
  value,
  onValueChange,
  placeholder = "Project",
  showAllOption = false,
  disabled = false,
  variant = "default",
  width = "max-w-52",
}: ProjectSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const { data } = useProjects({ limit: 100 });

  const projects = data?.data || [];

  const selectedProject = projects.find((proj) => proj.id === value);

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
          {value === "" ? placeholder : selectedProject?.name || placeholder}
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search projects..." className="h-9" />
          <CommandList>
            <CommandEmpty>No project found.</CommandEmpty>
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
                  All Projects
                </CommandItem>
              )}
              {projects.map((proj) => (
                <CommandItem
                  key={proj.id}
                  value={proj.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === proj.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {proj.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProjectSelect;
