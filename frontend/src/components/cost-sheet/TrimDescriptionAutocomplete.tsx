import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Input } from "@/components/ui/input";

interface TrimAutocompleteProps {
  rowId: string;
  value?: string;
  availableTrims: any[];
  showDropdown?: boolean;
  placeholder?: string;
  onCommit?: (value: string) => void; // called after debounce
  onSelect?: (item: any) => void; // called when an item is picked
}

const TrimDescriptionAutocomplete = ({
  rowId,
  value = "",
  availableTrims = [],
  showDropdown = false,
  placeholder = "Enter item description",
  onCommit,
  onSelect,
}: TrimAutocompleteProps) => {
  const [editBuffer, setEditBuffer] = useState<string>(value);
  const [active, setActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(value || "");
  const debounceRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    // keep external value in sync if it changes
    setEditBuffer(value || "");
    setSearchQuery(value || "");
  }, [value]);

  useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(ev.target as Node)) {
        setActive(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // compute dropdown position so it can be rendered into body and avoid overflow clipping
  const updateDropdownPosition = () => {
    const inputEl = inputRef.current;
    if (!inputEl) return;
    const rect = inputEl.getBoundingClientRect();
    setDropdownStyle({
      position: "absolute",
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      zIndex: 9999,
    });
  };

  useEffect(() => {
    if (active) {
      updateDropdownPosition();
    }
    const onScroll = () => {
      if (active) updateDropdownPosition();
    };
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [active, searchQuery]);

  const scheduleCommit = (v: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (onCommit) onCommit(v);
      debounceRef.current = null;
    }, 150);
  };

  const handleChange = (v: string) => {
    setEditBuffer(v);
    setSearchQuery(v);
    setActive(true);
    scheduleCommit(v);
  };

  const q = (searchQuery || "").toLowerCase().trim();
  const matches = q.length > 0
    ? availableTrims.filter((t: any) =>
        (t.description || t.name || "").toLowerCase().includes(q)
      )
    : availableTrims.slice(0, 6);

  return (
    <div className="relative" ref={containerRef}>
      <Input
        ref={inputRef as any}
        value={editBuffer}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => {
          if (showDropdown) setActive(true);
        }}
        className="max-w-md placeholder"
        placeholder={placeholder}
      />

      {showDropdown && active && matches && matches.length > 0 &&
        createPortal(
          <div style={dropdownStyle} className="bg-white border rounded shadow-sm max-h-40 overflow-auto">
            {matches.map((m: any, idx: number) => (
              <div
                key={idx}
                className="px-2 py-1 hover:bg-muted/30 cursor-pointer text-sm"
                onMouseDown={(ev) => {
                  // prevent blur before click
                  ev.preventDefault();
                  if (onSelect) onSelect(m);
                  // clear local buffer & hide
                  setEditBuffer(m.description || m.name || "");
                  setSearchQuery("");
                  setActive(false);
                  if (debounceRef.current) {
                    clearTimeout(debounceRef.current);
                    debounceRef.current = null;
                  }
                }}
              >
                <div className="font-medium">{m.description || m.name}</div>
                <div className="text-xs text-muted-foreground">
                  {m.cost || m.rate ? Number(m.cost || m.rate).toFixed(3) : ""}
                </div>
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};

export default TrimDescriptionAutocomplete;
