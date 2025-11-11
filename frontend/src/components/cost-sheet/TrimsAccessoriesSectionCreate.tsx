import { useState, useEffect, useRef } from "react";
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
  selected?: boolean; // true when user picked from existing trims list
}

interface TrimsAccessoriesSectionCreateProps {
  data: any;
  onChange?: (data: { rows: TrimRow[]; json: any }) => void;
  showUnits?: boolean; // when true show Unit and Total columns
}

export const defaultTrims = [""];

const TrimsAccessoriesSectionCreate = ({
  data,
  onChange,
  showUnits = false,
}: TrimsAccessoriesSectionCreateProps) => {
  const [rows, setRows] = useState<TrimRow[]>(
    Array.isArray(data?.rows) && data.rows.length > 0
      ? data.rows.map((row: any, idx: number) => ({
          ...row,
          id: row.id ?? `trim-${idx}-${Date.now()}`,
          unit: row.unit ?? (showUnits ? "12" : ""),
        }))
      : defaultTrims.map((trim, index) => ({
          id: `trim-${index}`,
          description: trim,
          cost: "",
          unit: showUnits ? "12" : "",
        }))
  );
  const id = data?.id ?? 1; // or receive id as prop
  const { data: trimsAccessories, isLoading } =
    useGetTrimsAndAccessoriesByIdQuery(id, { skip: !id });

  // Active search state for autocomplete per-row (only one active at a time)
  const [activeSearchRowId, setActiveSearchRowId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  // per-row debounce timers to avoid cross-row interference
  const debounceTimersRef = useRef<Record<string, any>>({});
  const [editBuffer, setEditBuffer] = useState<Record<string, string>>({});
  const initializedFromDataRef = useRef(false);

  useEffect(() => {
    return () => {
      // clear all timers on unmount
      Object.values(debounceTimersRef.current).forEach((t) => clearTimeout(t));
      debounceTimersRef.current = {};
    };
  }, []);

  // derive available trims list from fetched payload
  const availableTrims: any[] =
    trimsAccessories?.trimsRows?.rows || trimsAccessories?.rows || [];
  // Initialize rows from incoming `data` only once to avoid overwriting user edits
  useEffect(() => {
    if (
      Array.isArray(data?.rows) &&
      data.rows.length > 0 &&
      !initializedFromDataRef.current
    ) {
      setRows(
        data.rows.map((row: any, idx: number) => ({
          ...row,
          id: row.id ?? `trim-${idx}-${Date.now()}`,
          unit: row.unit ?? (showUnits ? "12" : ""),
        }))
      );
      initializedFromDataRef.current = true;
    }
    // If data.rows is empty or undefined, keep the default rows so Create shows default fields
  }, [data]);

  // Reset initialization when the source data id changes (e.g., copying a different sheet)
  useEffect(() => {
    initializedFromDataRef.current = false;
  }, [data?.id]);

  const getTrimsAccessoriesJson = (
    rowsArg: TrimRow[],
    showUnitsFlag = false
  ) => {
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
      const subtotal = rowsWithTotals.reduce(
        (s, r) => s + (Number(r.total) || 0),
        0
      );
      return {
        tableName: "Trims & Accessories",
        columns: ["Item Description", "Unit", "Rate", "Total"],
        rows: rowsWithTotals,
        subtotal,
        totalAccessoriesCost: subtotal,
      };
    }

    // When units are not shown we should NOT sum the 'rate' column as the
    // total. Instead prefer summing explicit `total` values on rows (these
    // may come from autocomplete/selected trims). If rows don't include a
    // `total` field, fall back to 0 to avoid accidentally summing rates.
    const subtotalFromTotals = rowsArg.reduce((sum, row) => sum + (Number((row as any).total) || 0), 0);
    const subtotal = subtotalFromTotals;
    return {
      tableName: "Trims & Accessories",
      columns: ["Item Description", "Rate"],
      rows: rowsArg.map((row) => ({
        description: row.description,
        cost: row.cost,
        // preserve any explicit total if present so Show/Edit can render it
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

  const handleDecimalChange = (
    id: string,
    field: keyof TrimRow,
    value: string
  ) => {
    // Description is free text — allow any characters and trigger autocomplete
    if (field === "description") {
      // write to lightweight edit buffer for immediate input responsiveness
      setEditBuffer((b) => ({ ...b, [id]: value }));
      // clear any pending timer for this row
      if (debounceTimersRef.current[id]) {
        clearTimeout(debounceTimersRef.current[id]);
      }
      setActiveSearchRowId(id);
      setSearchQuery(value);
      // schedule commit for this row after short delay
      debounceTimersRef.current[id] = setTimeout(() => {
        const commitValue = value;
        const updatedRows = rows.map((r) =>
          r.id === id ? { ...r, description: commitValue, selected: false } : r
        );
        // apply and notify parent
        setRows(updatedRows);
        if (onChange) {
          onChange({
            rows: updatedRows,
            json: getTrimsAccessoriesJson(updatedRows, showUnits),
          });
        }
        // clear buffer for this id
        setEditBuffer((b) => {
          const nb = { ...b };
          delete nb[id];
          return nb;
        });
        delete debounceTimersRef.current[id];
      }, 150);
      return;
    }

    // For numeric fields (cost, unit) allow only decimals
    if (/^\d*\.?\d*$/.test(value)) {
      updateRow(id, field, value);
    }
  };

  const updateRow = (
    id: string,
    field: keyof TrimRow,
    value: any,
    notify = true
  ) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
    if (notify) {
      handleRowsChange(updatedRows);
    }
    return updatedRows;
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
    ? rows.reduce(
        (sum, row) => sum + (Number(row.unit) || 0) * (Number(row.cost) || 0),
        0
      )
    : rows.reduce((sum, row) => sum + (Number(row.cost) || 0), 0);

  return (
    <Card className="print:p-0 print:shadow-none print:border-none print:bg-white">
      <CardHeader className="print:p-0 print:mb-0 print:border-none print:bg-white">
        <CardTitle className="text-lg print:text-base print:mb-0">
          Trims & Accessories
        </CardTitle>
      </CardHeader>
      <CardContent className="print:p-0 print:space-y-0 print:bg-white">
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
                    <th className="w-12">Action</th>
                  </>
                ) : (
                  <>
                    <th className="text-right p-3 font-medium">Rate</th>
                    <th className="w-12">Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b hover:bg-muted/30 transition-colors"
                >
                  <td className="p-3">
                    <TrimDescriptionAutocomplete
                      rowId={row.id}
                      value={editBuffer[row.id] ?? row.description}
                      availableTrims={availableTrims}
                      showDropdown={showUnits}
                      placeholder="Enter item description"
                      onCommit={(val) => {
                        // commit typed description after debounce
                        const updatedRows = rows.map((r) =>
                          r.id === row.id ? { ...r, description: val, selected: false } : r
                        );
                        setRows(updatedRows);
                        if (onChange) {
                          onChange({ rows: updatedRows, json: getTrimsAccessoriesJson(updatedRows, showUnits) });
                        }
                        // clear edit buffer for this id
                        setEditBuffer((b) => {
                          const nb = { ...b };
                          delete nb[row.id];
                          return nb;
                        });
                        if (debounceTimersRef.current[row.id]) {
                          clearTimeout(debounceTimersRef.current[row.id]);
                          delete debounceTimersRef.current[row.id];
                        }
                      }}
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
                        // clear edit buffer / timers
                        setEditBuffer((b) => {
                          const nb = { ...b };
                          delete nb[row.id];
                          return nb;
                        });
                        if (debounceTimersRef.current[row.id]) {
                          clearTimeout(debounceTimersRef.current[row.id]);
                          delete debounceTimersRef.current[row.id];
                        }
                        setActiveSearchRowId(null);
                        setSearchQuery("");
                      }}
                    />
                  </td>
                  <td className="p-3 text-right">
                    <Input
                      type="text"
                      value={row.cost ?? ""}
                      onChange={(e) =>
                        handleDecimalChange(row.id, "cost", e.target.value)
                      }
                      className="text-right"
                      placeholder="0.000"
                    />
                  </td>
                  {showUnits && (
                    <>
                      <td className="p-3 text-right">
                        <Input
                          type="text"
                          value={row.unit ?? "12"}
                          onChange={(e) =>
                            handleDecimalChange(row.id, "unit", e.target.value)
                          }
                          className="text-right"
                          placeholder="0"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <div className="font-medium">
                          $
                          {(
                            (Number(row.unit) || 0) * (Number(row.cost) || 0)
                          ).toFixed(3)}
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
          <Button onClick={addRow} variant="outline" size="sm" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
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
      </CardContent>
    </Card>
  );
};

export default TrimsAccessoriesSectionCreate;
