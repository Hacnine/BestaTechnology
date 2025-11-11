import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface OtherRow {
  id: string;
  label: string;
  value: string;
}

interface OthersSectionChange {
  rows: OtherRow[];
  json: any;
}

interface OthersSectionCreateProps {
  data: any;
  onChange?: (data: OthersSectionChange) => void;
}

const defaultOthers: OtherRow[] = [
  { id: "other-1", label: "AOP", value: "" },
  { id: "other-2", label: "Screen print", value: "" },
  { id: "other-3", label: "Embroidery", value: "" },
  { id: "other-4", label: "Wash", value: "" },
];

const OthersSectionCreate = ({ data, onChange }: OthersSectionCreateProps) => {
  const [rows, setRows] = useState<OtherRow[]>(defaultOthers);

  const handleRowsChange = (updatedRows: OtherRow[]) => {
    setRows(updatedRows);
    if (onChange) {
      onChange({
        rows: updatedRows,
        json: {
          tableName: "Others",
          columns: ["Label", "Value"],
          rows: updatedRows,
          total: updatedRows.reduce(
            (sum, row) => sum + (Number(row.value) || 0),
            0
          ),
        },
      });
    }
  };

  const handleValueChange = (
    id: string,
    value: string
  ) => {
    // Allow only valid decimal numbers or empty string
    if (/^-?\d*\.?\d*$/.test(value)) {
      updateRow(id, "value", value);
    }
  };

  const updateRow = (
    id: string,
    field: keyof OtherRow,
    value: any
  ) => {
    const updatedRows = rows.map((row) =>
      row.id === id
        ? {
            ...row,
            [field]: value,
          }
        : row
    );
    handleRowsChange(updatedRows);
  };

  const addRow = () => {
    const newRow: OtherRow = {
      id: `other-${Date.now()}`,
      label: "",
      value: "",
    };
    const updatedRows = [...rows, newRow];
    handleRowsChange(updatedRows);
  };

  const deleteRow = (id: string) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    handleRowsChange(updatedRows);
  };

  const total = rows.reduce(
    (sum, row) => sum + (Number(row.value) || 0),
    0
  );

  return (
    <Card className="print:p-0 print:shadow-none print:border-none print:bg-white print:mt-20">
      <CardHeader className="print:p-0 print:mb-0 print:border-none print:bg-white">
        <CardTitle className="text-lg print:text-base print:mb-0">Others (Custom Fields)</CardTitle>
      </CardHeader>
      <CardContent className="print:p-0 print:space-y-0 print:bg-white">
        {rows.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No custom fields added yet.</p>
            <p className="text-sm mt-2">Click "Add Field" to add custom cost items.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Label</th>
                  <th className="text-right p-3 font-medium">Value ($)</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <Input
                        value={row.label}
                        onChange={e => updateRow(row.id, "label", e.target.value)}
                        className="max-w-md"
                        placeholder="Label Name"
                      />
                    </td>
                    <td className="p-3 text-right">
                      <Input
                        type="text"
                        value={row.value ?? ""}
                        onChange={e => handleValueChange(row.id, e.target.value)}
                        className="text-right"
                      />
                    </td>
                    <td className="p-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRow(row.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4  text-red-600" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {rows.length > 0 && (
                  <tr className="border-t-2 font-semibold bg-muted/50">
                    <td className="p-3">Total</td>
                    <td className="p-3 text-right">
                      ${Number(total) ? Number(total).toFixed(3) : "0.000"}
                    </td>
                    <td></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <Button onClick={addRow} variant="outline" size="sm" className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </CardContent>
    </Card>
  );
};

export default OthersSectionCreate;