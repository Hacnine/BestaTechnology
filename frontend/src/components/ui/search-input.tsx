import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "md:w-[300px] placeholder:text-sm pl-8",
}) => {
  return (
    <div className="relative">
      <label className="block text-xs font-medium mb-1">Search</label>
      <Input
        type="text"
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <Search className="absolute left-2 top-8 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
};

export default SearchInput;