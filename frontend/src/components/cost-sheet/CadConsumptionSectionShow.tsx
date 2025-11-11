import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CadRow {
  id: string;
  fieldName: string;
  weight?: string;
  percent?: string;
  value?: number;
}

interface CadConsumptionSectionShowProps {
  data: any;
}

const CadConsumptionSectionShow = ({ data }: CadConsumptionSectionShowProps) => {
  const rows: CadRow[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.rows)
      ? data.rows
      : []

  const totalWeight = rows?.reduce((sum, row) => sum + (Number(row.weight) || 0), 0);
  const totalValue = rows?.reduce((sum, row) => sum + (row.value || 0), 0);

  return (
    <Card className="print:p-0 print:shadow-none print:border-none print:bg-white">
      <CardHeader className="print:p-0 print:mb-0 print:border-none print:bg-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg print:text-base print:mb-0">CAD Consumption / Dz</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="print:p-0 print:space-y-0 print:bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Field Name</th>
                <th className="text-right p-3 font-medium">Weight (kg / yard)</th>
                <th className="text-right p-3 font-medium">With %</th>
                <th className="text-right p-3 font-medium">Fabric Consumption</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id + row.fieldName} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    {row.fieldName}
                  </td>
                  <td className="p-3 text-right">
                    {row.weight ?? ""}
                  </td>
                  <td className="p-3 text-right">
                    {row.percent ?? ""}
                  </td>
                  <td className="p-3 text-right">
                    {row.value ? row.value.toFixed(3) : "0.000"}
                  </td>
                </tr>
              ))}
              <tr className="border-b-2 font-semibold bg-muted/50">
                <td className="p-3">Total</td>
                <td className="p-3 text-right">{totalWeight ? totalWeight.toFixed(3) : "0.000"}</td>
                <td className="p-3 text-right"></td>
                <td className="p-3 text-right">{totalValue ? totalValue.toFixed(3) : "0.000"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CadConsumptionSectionShow;