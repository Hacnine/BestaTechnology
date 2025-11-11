import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface FabricRow {
  id: string;
  fieldName: string;
  unit: string;
  rate: string;
  value: number;
}

interface FabricCostSectionEditProps {
  data: any;
  onChange?: (data: any) => void;
  cadData?: any[];
}

const FabricCostSectionEdit = ({ data, onChange, cadData }: FabricCostSectionEditProps) => {
  const [yarnRows, setYarnRows] = useState<FabricRow[]>(data?.yarnRows || []);
  const [knittingRows, setKnittingRows] = useState<FabricRow[]>(data?.knittingRows || []);
  const [dyeingRows, setDyeingRows] = useState<FabricRow[]>(data?.dyeingRows || []);

  useEffect(() => {
    // Only update local state when incoming `data` actually differs from current state.
    // Also skip applying `data` when it exactly matches the last `json` shape we
    // emitted — that indicates the parent echoed our payload back and no real
    // user-driven change occurred.
    if (!data) return;

    try {
      const incomingShape = JSON.stringify(data);
      if (lastEmittedJsonShape?.current && incomingShape === lastEmittedJsonShape.current) {
        // Parent echoed our payload — ignore to avoid a feedback loop
        return;
      }
    } catch (e) {
      // ignore serialization errors and fall back to per-array checks below
    }

    if (data?.yarnRows && JSON.stringify(data.yarnRows) !== JSON.stringify(yarnRows)) {
      setYarnRows(Array.isArray(data.yarnRows) ? data.yarnRows : []);
    }
    if (data?.knittingRows && JSON.stringify(data.knittingRows) !== JSON.stringify(knittingRows)) {
      setKnittingRows(Array.isArray(data.knittingRows) ? data.knittingRows : []);
    }
    if (data?.dyeingRows && JSON.stringify(data.dyeingRows) !== JSON.stringify(dyeingRows)) {
      setDyeingRows(Array.isArray(data.dyeingRows) ? data.dyeingRows : []);
    }
  }, [data, yarnRows, knittingRows, dyeingRows]);


  useEffect(() => {
    if (cadData) {
      // Normalize cadData to an array so callers can pass either an array or
      // an object with `rows` / `json` shapes. This prevents crashes when the
      // parent passes an object instead of an array.
      const cadItems: any[] = Array.isArray(cadData)
        ? cadData
        : cadData && typeof cadData === "object"
        ? cadData.rows ?? cadData.json ?? []
        : [];

      // Use functional updates and clone each row object before mutating to avoid changing
      // read-only objects that may come from props or an immutable source.
      setYarnRows((prevYarn) => {
        const newYarn = prevYarn.map((r) => ({ ...r }));
        cadItems.forEach((item: any, index: number) => {
          const valueStr = item?.value != null ? Number(item.value).toFixed(3) : "";
          if (index < newYarn.length) {
            newYarn[index] = {
              ...newYarn[index],
              unit: valueStr,
              value: Number(valueStr) * Number(newYarn[index].rate) || 0,
            };
          } else {
            newYarn.push({
              id: item.id ?? `cad-${index}`,
              fieldName: item.fieldName,
              unit: valueStr,
              rate: "",
              value: 0,
            });
          }
        });
        return newYarn;
      });

      setKnittingRows((prevKnit) => {
        const newKnit = prevKnit.map((r) => ({ ...r }));
        cadItems.forEach((item: any, index: number) => {
          const valueStr = item?.value != null ? item.value.toString() : "";
          if (index < newKnit.length) {
            newKnit[index] = {
              ...newKnit[index],
              unit: valueStr,
              value: Number(valueStr) * Number(newKnit[index].rate) || 0,
            };
          } else {
            newKnit.push({
              id: item.id ?? `cad-${index}`,
              fieldName: item.fieldName,
              unit: valueStr,
              rate: "",
              value: 0,
            });
          }
        });
        return newKnit;
      });

      // setDyeingRows((prevDye) => {
      //   const newDye = prevDye.map((r) => ({ ...r }));
      //   cadData.forEach((item: any, index: number) => {
      //     const valueStr = item?.value?.toString() ?? "";
      //     if (index < newDye.length) {
      //       newDye[index] = {
      //         ...newDye[index],
      //         unit: valueStr,
      //         value: Number(valueStr) * Number(newDye[index].rate) || 0,
      //       };
      //     } else {
      //       newDye.push({
      //         id: item.id ?? `cad-${index}`,
      //         fieldName: item.fieldName,
      //         unit: valueStr,
      //         rate: "",
      //         value: 0,
      //       });
      //     }
      //   });
      //   return newDye;
      // });
    }
  }, [cadData]);

  // Update totals whenever rows change
  useEffect(() => {
    updateTotalData();
  }, [yarnRows, knittingRows, dyeingRows]);

  // Track last emitted onChange payload to avoid emitting identical payloads repeatedly
  // which can cause parent -> prop -> state loops.
  const lastEmittedJson = useRef<string | null>(null);
  // Also keep serialized shape of the `json` we emit so we can detect when the
  // parent simply passes it back via props (echo) and ignore it to avoid a loop.
  const lastEmittedJsonShape = useRef<string | null>(null);

  const handleDecimalChange = (
    rows: FabricRow[],
    setRows: any,
    id: string,
    field: keyof FabricRow,
    newValue: string
  ) => {
    if (/^\d*\.?\d*$/.test(newValue)) {
      updateRows(rows, setRows, id, field, newValue);
    }
  };

  const updateRows = (
    rows: FabricRow[],
    setRows: any,
    id: string,
    field: keyof FabricRow,
    value: any
  ) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        updatedRow.value =
          Number(updatedRow.unit) * Number(updatedRow.rate) || 0;
        return updatedRow;
      }
      return row;
    });
    setRows(updatedRows);
  };

  const addRow = (rows: FabricRow[], setRows: any, prefix: string) => {
    const newIndex = rows.length;
    // Use the same normalization as above for safe access
    const cadItemsForAdd: any[] = Array.isArray(cadData)
      ? cadData
      : cadData && typeof cadData === "object"
      ? cadData.rows ?? cadData.json ?? []
      : [];
    const unitValue = cadItemsForAdd && newIndex < cadItemsForAdd.length ? String(cadItemsForAdd[newIndex]?.value ?? "") : "";
    const newRow: FabricRow = {
      id: `${prefix}-${Date.now()}`,
      fieldName: "",
      unit: unitValue,
      rate: "",
      value: 0,
    };
    setRows([...rows, newRow]);
  };

  const deleteRow = (rows: FabricRow[], setRows: any, id: string) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const calculateTotal = (rows: FabricRow[]) => {
    return rows.reduce((sum, row) => sum + (Number(row.value) || 0), 0);
  };

  const calculateTotalUnit = (rows: FabricRow[]) => {
    return rows.reduce((sum, row) => sum + (Number(row.unit) || 0), 0);
  };

  const updateTotalData = () => {
    const yarnTotal = calculateTotal(yarnRows);
    const knittingTotal = calculateTotal(knittingRows);
    const dyeingTotal = calculateTotal(dyeingRows);
    const totalCost = yarnTotal + knittingTotal + dyeingTotal;

    if (onChange) {
      const payload = {
        rows: {
          yarnRows,
          knittingRows,
          dyeingRows,
        },
        json: {
          tableName: "Fabric Cost",
          yarnRows,
          knittingRows,
          dyeingRows,
          yarnTotal,
          knittingTotal,
          dyeingTotal,
          totalFabricCost: totalCost,
        }
      };

      try {
        const str = JSON.stringify(payload);
        const jsonShapeStr = JSON.stringify(payload.json);
        if (lastEmittedJson.current !== str) {
          lastEmittedJson.current = str;
          lastEmittedJsonShape.current = jsonShapeStr;
          onChange(payload);
        }
      } catch (e) {
        // If serialization fails for some reason, fall back to emitting the payload once.
        // Try to set the shape ref if possible then emit
        try {
          lastEmittedJsonShape.current = JSON.stringify(payload.json);
        } catch (_) {}
        onChange(payload);
      }
    }
  };

  const renderTableSection = (
    title: string,
    rows: FabricRow[],
    setRows: any,
    totalUnit: number,
    totalValue: number,
    prefix: string
  ) => (
    <div className="mb-6">
      <h4 className="font-semibold text-sm mb-2">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Field Name</th>
              <th className="text-right p-3 font-medium">Unit</th>
              <th className="text-right p-3 font-medium">Rate ($)</th>
              <th className="text-right p-3 font-medium">Value ($)</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-muted/30 transition-colors">
                <td className="p-3">
                  <Input
                    value={row.fieldName}
                    onChange={e => updateRows(rows, setRows, row.id, "fieldName", e.target.value)}
                    className="h-8 text-sm border"
                    placeholder="Field Name"
                  />
                </td>
                <td className="p-3 text-right">
                  <Input
                    type="text"
                    value={row.unit}
                    onChange={e => handleDecimalChange(rows, setRows, row.id, "unit", e.target.value)}
                    className="h-8 text-right text-sm "
                  />
                </td>
                <td className="p-3 text-right">
                  <Input
                    type="text"
                    value={row.rate ?? ""}
                    onChange={e => handleDecimalChange(rows, setRows, row.id, "rate", e.target.value)}
                    className="h-8 text-right text-sm "
                  />
                </td>
                <td className="p-3 text-right">
                  {row.value ? Number(row.value).toFixed(3) : "0.000"}
                </td>
                <td className="p-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => deleteRow(rows, setRows, row.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </td>
              </tr>
            ))}
            <tr className="font-semibold bg-muted/10">
              <td className="p-3 text-left">Total</td>
              <td className="p-3 text-right">{totalUnit ? totalUnit.toFixed(3) : "0.000"}</td>
              <td className="p-3"></td>
              <td className="p-3 text-right">{totalValue ? totalValue.toFixed(3) : "0.000"}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <Button
        onClick={() => addRow(rows, setRows, prefix)}
        variant="outline"
        size="sm"
        className="mt-2"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Field
      </Button>
    </div>
  );

  const totalFabricCost = (Number(calculateTotal(yarnRows)) || 0) +
    (Number(calculateTotal(knittingRows)) || 0) +
    (Number(calculateTotal(dyeingRows)) || 0);

  return (
    <Card className="print:p-0 print:shadow-none print: print:bg-white">
      <CardHeader className="print:p-0 print:mb-0 print: print:bg-white">
        <CardTitle className="text-lg print:text-base print:mb-0">Fabric Cost</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 print:p-0 print:space-y-0 print:bg-white">
        {renderTableSection(
          "Yarn Price",
          yarnRows,
          setYarnRows,
          calculateTotalUnit(yarnRows),
          calculateTotal(yarnRows),
          "yarn"
        )}
        <Separator />
        {renderTableSection(
          "Knitting",
          knittingRows,
          setKnittingRows,
          calculateTotalUnit(knittingRows),
          calculateTotal(knittingRows),
          "knit"
        )}
        <Separator />
        {renderTableSection(
          "Dyeing",
          dyeingRows,
          setDyeingRows,
          calculateTotalUnit(dyeingRows),
          calculateTotal(dyeingRows),
          "dye"
        )}
        <Separator />
        <div className="pt-4 border-t-2">
          <div className="flex justify-between items-center font-semibold text-lg">
            <span>Total Fabric Cost (USD / Dozen Garments)</span>
            <span className="text-primary">
              $
              {Number(totalFabricCost)
                ? Number(totalFabricCost).toFixed(3) : "0.000"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FabricCostSectionEdit;