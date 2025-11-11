import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

interface CustomDateInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const CustomDateInput = forwardRef<HTMLInputElement, CustomDateInputProps>(
  ({ label, value, onChange, placeholder = "MM/DD/YYYY" }, ref) => {
    return (
      <div className="relative">
        <label className="block text-xs font-medium mb-1">{label}</label>
        <Input
          ref={ref}
          type="date"
          value={value}
          onChange={onChange}
          className={`${
            value
              ? '[&::-webkit-datetime-edit-fields-wrapper]:opacity-100 [&::-webkit-datetime-edit-text]:opacity-100 [&::-webkit-datetime-edit]:opacity-100'
              : '[&::-webkit-datetime-edit-fields-wrapper]:opacity-0 [&::-webkit-datetime-edit-text]:opacity-0 [&::-webkit-datetime-edit]:opacity-0'
          } [&::-webkit-calendar-picker-indicator]:opacity-0 pr-10 cursor-pointer`}
          onClick={() => {
            if (ref && 'current' in ref && ref.current?.showPicker) {
              ref.current.showPicker();
            } else if (ref && 'current' in ref) {
              ref.current?.focus();
            }
          }}
        />
        {!value && (
          <span className="absolute left-3 top-8 text-gray-400 pointer-events-none text-sm">
            {placeholder}
          </span>
        )}
        <Calendar
          className="absolute right-3 top-8 h-4 w-4 text-gray-400 cursor-pointer"
          onClick={() => {
            if (ref && 'current' in ref && ref.current?.showPicker) {
              ref.current.showPicker();
            } else if (ref && 'current' in ref) {
              ref.current?.focus();
            }
          }}
        />
      </div>
    );
  }
);

CustomDateInput.displayName = "CustomDateInput";

export default CustomDateInput;