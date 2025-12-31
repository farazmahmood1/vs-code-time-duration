import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const [month, setMonth] = React.useState<number>(
    date?.getMonth() ?? new Date().getMonth()
  );
  const [year, setYear] = React.useState<number>(
    date?.getFullYear() ?? new Date().getFullYear()
  );

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setMonth(newDate.getMonth());
      setYear(newDate.getFullYear());
      // Format date as YYYY-MM-DD for input compatibility
      const formattedDate = format(newDate, "yyyy-MM-dd");
      onChange?.(formattedDate);
    }
  };

  const handleMonthChange = (newMonth: string) => {
    setMonth(parseInt(newMonth));
  };

  const handleYearChange = (newYear: string) => {
    setYear(parseInt(newYear));
  };

  // Generate year options (current year ± 100 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 201 },
    (_, i) => currentYear - 100 + i
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="">
          {/* Month and Year Selectors */}
          <div className="flex gap-2 justify-center">
            <Select
              value={months[month]}
              onValueChange={(val) => {
                const monthIndex = months.indexOf(val);
                if (monthIndex !== -1) {
                  handleMonthChange(monthIndex.toString());
                }
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((m, idx) => (
                  <SelectItem key={idx} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={year.toString()} onValueChange={handleYearChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Calendar */}
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            disabled={disabled}
            month={new Date(year, month)}
            onMonthChange={(newDate) => {
              setMonth(newDate.getMonth());
              setYear(newDate.getFullYear());
            }}
            initialFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
