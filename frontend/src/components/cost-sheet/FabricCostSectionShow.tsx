import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface FabricRow {
  id: string;
  fieldName: string;
  unit: "";
  rate: "";
  value: number;
}

interface FabricCostSectionShowProps {
  data: any;
}

const FabricCostSectionShow = ({ data }: FabricCostSectionShowProps) => {
  const yarnRows: FabricRow[] = data?.yarnRows || [];
  const knittingRows: FabricRow[] = data?.knittingRows || [];
  const dyeingRows: FabricRow[] = data?.dyeingRows || [];

  const calculateTotal = (rows: FabricRow[]) => {
    return rows.reduce((sum, row) => sum + (Number(row.value) || 0), 0);
  };

  const calculateTotalUnit = (rows: FabricRow[]) => {
    return rows.reduce((sum, row) => sum + (Number(row.unit) || 0), 0);
  };

  const renderTableSection = (
    title: string,
    rows: FabricRow[],
    totalUnit: number,
    totalValue: number
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
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-muted/30 transition-colors">
                <td className="p-3">{row.fieldName}</td>
                <td className="p-3 text-right">{row.unit ? Number(row.unit).toFixed(3) : "0.000"}</td>
                <td className="p-3 text-right">{row.rate ? Number(row.rate).toFixed(3) : "0.000"}</td>
                <td className="p-3 text-right">{row.value ? Number(row.value).toFixed(3) : "0.000"}</td>
              </tr>
            ))}
            <tr className="font-semibold bg-muted/10">
              <td className="p-3 text-left">Total</td>
              <td className="p-3 text-right">{totalUnit ? totalUnit.toFixed(3) : "0.000"}</td>
              <td className="p-3"></td>
              <td className="p-3 text-right">{totalValue ? totalValue.toFixed(3) : "0.000"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const totalFabricCost = (Number(calculateTotal(yarnRows)) || 0) +
    (Number(calculateTotal(knittingRows)) || 0) +
    (Number(calculateTotal(dyeingRows)) || 0);

  return (
    <Card className="print:p-0 print:shadow-none print:border-none print:bg-white">
      <CardHeader className="print:p-0 print:mb-0 print:border-none print:bg-white">
        <CardTitle className="text-lg print:text-base print:mb-0">Fabric Cost</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 print:p-0 print:space-y-0 print:bg-white">
        {renderTableSection(
          "Yarn Price",
          yarnRows,
          calculateTotalUnit(yarnRows),
          calculateTotal(yarnRows)
        )}
        <Separator />
        {renderTableSection(
          "Knitting",
          knittingRows,
          calculateTotalUnit(knittingRows),
          calculateTotal(knittingRows)
        )}
        <Separator />
        {renderTableSection(
          "Dyeing",
          dyeingRows,
          calculateTotalUnit(dyeingRows),
          calculateTotal(dyeingRows)
        )}
        <Separator />
        <div className="pt-4 border-t-2">
          <div className="flex justify-between items-center font-semibold text-lg">
            <span>Total Fabric Cost (USD / Dozen Garments)</span>
            <span className="text-primary">
              $
              {Number(totalFabricCost)
                ? Number(totalFabricCost).toFixed(3)
                : "0.000"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FabricCostSectionShow;