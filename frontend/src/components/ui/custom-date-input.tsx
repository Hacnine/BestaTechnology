import React, { forwardRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

interface CustomDateInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const CustomDateInput = forwardRef<HTMLInputElement, CustomDateInputProps>(
  ({ label, value, onChange, placeholder = "MM/DD/YYYY" }, ref) => {
    const [open, setOpen] = useState(false);
    const selectedDate = value ? new Date(value) : undefined;

    const handleDateSelect = (date: Date | undefined) => {
      if (date) {
        const formatted = format(date, "yyyy-MM-dd");
        onChange({ target: { value: formatted } } as React.ChangeEvent<HTMLInputElement>);
      } else {
        onChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
      }
      setOpen(false);
    };

    return (
      <div className="relative">
        <label className="block text-xs font-medium mb-1">{label}</label>
        <Input
          ref={ref}
          type="text"
          value={value ? format(new Date(value), "MM/dd/yyyy") : ""}
          onChange={onChange}
          className="pr-10 cursor-pointer"
          readOnly
          onClick={() => setOpen(true)}
        />
        {!value && (
          <span className="absolute left-3 top-8 text-gray-400 cursor-pointer text-sm" onClick={() => setOpen(true)}>
            {placeholder}
          </span>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Calendar
              className="absolute right-3 top-8 h-4 w-4 text-gray-400 cursor-pointer"
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
              className="p-3"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

CustomDateInput.displayName = "CustomDateInput";

export default CustomDateInput;