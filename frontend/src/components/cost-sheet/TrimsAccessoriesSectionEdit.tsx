import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useGetTrimsAndAccessoriesByIdQuery } from "@/redux/api/trimsAndAccessoriesApi";
import TrimDescriptionAutocomplete from "./TrimDescriptionAutocomplete";

interface TrimRow {
  id: string;
  description: string;
  cost: string;
  unit?: string;
}

interface TrimsAccessoriesSectionEditProps {
  data: any;
  onChange?: (data: { rows: TrimRow[]; json: any }) => void;
  showUnits?: boolean;
}

const TrimsAccessoriesSectionEdit = ({ data, onChange, showUnits = false }: TrimsAccessoriesSectionEditProps) => {
  const [rows, setRows] = useState<TrimRow[]>(
    Array.isArray(data?.rows)
      ? data.rows.map((row: any, idx: number) => ({
          ...row,
          id: row.id ?? `trim-${idx}-${Date.now()}`,
          unit: row.unit ?? "",
        }))
      : []
  );

  useEffect(() => {
    if (Array.isArray(data?.rows)) {
      setRows(
        data.rows.map((row: any, idx: number) => ({
          ...row,
          id: row.id ?? `trim-${idx}-${Date.now()}`,
          unit: row.unit ?? "",
        }))
      );
    }
  }, [data]);

  // fetch available trims list for autocomplete (reuse same source as Create)
  const id = data?.id ?? 1;
  const { data: trimsAccessories } = useGetTrimsAndAccessoriesByIdQuery(id, { skip: !id });
  const availableTrims: any[] =
    trimsAccessories?.trimsRows?.rows || trimsAccessories?.rows || [];

  const getTrimsAccessoriesJson = (rowsArg: TrimRow[], showUnitsFlag = false) => {
    if (showUnitsFlag) {
      const rowsWithTotals = rowsArg.map((row) => {
        const unitNum = Number(row.unit) || 0;
        const rateNum = Number(row.cost) || 0;
        const total = unitNum * rateNum;
        return {
          description: row.description,
          unit: row.unit || "",
          cost: row.cost || "",
          total,
        };
      });
      const subtotal = rowsWithTotals.reduce((s, r) => s + (Number(r.total) || 0), 0);
      return {
        tableName: "Trims & Accessories",
        columns: ["Item Description", "Unit", "Rate", "Total"],
        rows: rowsWithTotals,
        subtotal,
        totalAccessoriesCost: subtotal,
      };
    }

    // When units are not shown, prefer summing explicit `total` values on
    // each row. Do not sum the rate column as the accessories total.
    const subtotalFromTotals = rowsArg.reduce((sum, row) => sum + (Number((row as any).total) || 0), 0);
    const subtotal = subtotalFromTotals;
    return {
      tableName: "Trims & Accessories",
      columns: ["Item Description", "Rate"],
      rows: rowsArg.map((row) => ({
        description: row.description,
        cost: row.cost,
        total: (row as any).total,
      })),
      subtotal,
      totalAccessoriesCost: subtotal,
    };
  };

  const handleRowsChange = (updatedRows: TrimRow[]) => {
    setRows(updatedRows);
    if (onChange) {
      onChange({
        rows: updatedRows,
        json: getTrimsAccessoriesJson(updatedRows, showUnits),
      });
    }
  };

  const handleDecimalChange = (id: string, field: keyof TrimRow, value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      updateRow(id, field, value);
    }
  };

  const updateRow = (id: string, field: keyof TrimRow, value: any) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    handleRowsChange(updatedRows);
  };

  const addRow = () => {
    const newRow: TrimRow = {
      id: `trim-${Date.now()}`,
      description: "",
      cost: "",
      unit: "12",
    };
    handleRowsChange([...rows, newRow]);
  };

  const deleteRow = (id: string) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    handleRowsChange(updatedRows);
  };

  const subtotal = showUnits
    ? rows.reduce((sum, row) => sum + ((Number(row.unit) || 0) * (Number(row.cost) || 0)), 0)
    : rows.reduce((sum, row) => sum + (Number(row.cost) || 0), 0);

  return (
    <Card className="">
      <CardHeader className="">
        <CardTitle className="text-lg print:text-base ">Trims & Accessories</CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Item Description</th>
                  {showUnits ? (
                    <>
                      <th className="text-right p-3 font-medium">Rate</th>
                      <th className="text-right p-3 font-medium">Unit</th>
                      <th className="text-right p-3 font-medium">Total</th>
                    </>
                  ) : (
                    <>
                      <th className="text-right p-3 font-medium">Rate</th>
                      <th className="w-12"></th>
                    </>
                  )}
                </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <TrimDescriptionAutocomplete
                      rowId={row.id}
                      value={row.description}
                      availableTrims={availableTrims}
                      showDropdown={showUnits}
                      placeholder="Enter item description"
                      onCommit={(val) => updateRow(row.id, "description", val)}
                      onSelect={(m) => {
                        const updatedRows = rows.map((r) =>
                          r.id === row.id
                            ? {
                                ...r,
                                description: m.description || m.name || "",
                                cost: m.cost ?? m.rate ?? m.price ?? "",
                                selected: true,
                              }
                            : r
                        );
                        setRows(updatedRows);
                        if (onChange) {
                          onChange({ rows: updatedRows, json: getTrimsAccessoriesJson(updatedRows, showUnits) });
                        }
                      }}
                    />
                  </td>
                  <td className="p-3 text-right">
                    <Input
                      type="text"
                      value={row.cost ?? ""}
                      onChange={(e) => handleDecimalChange(row.id, "cost", e.target.value)}
                      className="text-right"
                      placeholder="0.000"
                    />
                  </td>
                  {showUnits && (
                    <>
                      <td className="p-3 text-right">
                        <Input
                          type="text"
                          value={row.unit ?? ""}
                          onChange={(e) => handleDecimalChange(row.id, "unit", e.target.value)}
                          className="text-right"
                          placeholder="0"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <div className="font-medium">
                          ${((Number(row.unit) || 0) * (Number(row.cost) || 0)).toFixed(3)}
                        </div>
                      </td>
                    </>
                  )}
                  <td className="p-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteRow(row.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 space-y-3 pt-6 border-t-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Accessories Cost</span>
            <span className="font-semibold">
              ${Number(subtotal) ? Number(subtotal).toFixed(3) : "0.000"}
            </span>
          </div>
          <div className="flex justify-between items-center text-lg pt-3 border-t">
            <span className="font-bold">Total Accessories Cost</span>
            <span className="font-bold text-primary">
              ${Number(subtotal) ? Number(subtotal).toFixed(3) : "0.000"} /Dzn
            </span>
          </div>
        </div>
        <Button onClick={addRow} variant="outline" size="sm" className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </CardContent>
    </Card>
  );
};

export default TrimsAccessoriesSectionEdit;
