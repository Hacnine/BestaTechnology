import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface FieldRow {
  id: string;
  keyName: string;
  value: string;
}

interface Props {
  form: any;
}

const StyleCustomFields: React.FC<Props> = ({ form }) => {
  const initial = form.getValues("styleRows")?.rows || [];
  const [rows, setRows] = useState<FieldRow[]>(
    Array.isArray(initial) && initial.length > 0
      ? initial.map((r: any, i: number) => ({
          id: r.id || `s-${i}`,
          keyName: r.key || r.label || "",
          value: r.value || "",
        }))
      : []
  );

  useEffect(() => {
    // sync form value
    form.setValue("styleRows", {
      rows: rows.map((r) => ({ key: r.keyName, value: r.value })),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  const addRow = () => {
    setRows([
      ...rows,
      { id: `s-${Date.now()}`, keyName: "New Label", value: "" },
    ]);
  };

  const updateRow = (id: string, field: "keyName" | "value", val: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };

  const deleteRow = (id: string) => setRows(rows.filter((r) => r.id !== id));

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rows.map((r) => (
          <div key={r.id} className="pt-5">
            <div className="flex items-center gap-2">
              <Input
                id={`style-field-key-${r.id}`}
                value={r.keyName}
                onChange={(e) => updateRow(r.id, "keyName", e.target.value)}
                placeholder="Field label"
                className="w-1/3"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteRow(r.id)}
                aria-label={`Delete ${r.keyName}`}
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Input
                id={`style-field-${r.id}`}
                value={r.value}
                onChange={(e) => updateRow(r.id, "value", e.target.value)}
                placeholder="Field value"
                className="flex-1"
              />
            </div>
          </div>
        ))}

      </div>
      <div>
          <Button variant="outline" size="sm" onClick={addRow} className="mt-3">
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </div>
    </div>
  );
};

export default StyleCustomFields;
