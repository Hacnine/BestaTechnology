import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OtherRow {
  id: string;
  label: string;
  value: string;
}

interface OthersSectionShowProps {
  data: any;
}

const OthersSectionShow = ({ data }: OthersSectionShowProps) => {
  const rows: OtherRow[] = Array.isArray(data?.rows) ? data.rows : [];

  const total = rows.reduce(
    (sum, row) => sum + (Number(row.value) || 0),
    0
  );

  return (
    <Card className="print:p-0 print:shadow-none print:border-none print:bg-white print:mt-20">
      <CardHeader className="print:p-0 print:mb-0 print:border-none print:bg-white">
        <CardTitle className="text-lg print:text-base print:hidden">Others (Custom Fields)</CardTitle>
      </CardHeader>
      <CardContent className="print:p-0 print:space-y-0 print:bg-white">
        {rows.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground print:hidden">
            <p>No custom fields added.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Label</th>
                  <th className="text-right p-3 font-medium">Value ($)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      {row.label}
                    </td>
                    <td className="p-3 text-right">
                      {row.value && !isNaN(Number(row.value))
                        ? Number(row.value).toFixed(3)
                        : "0.000"}
                    </td>
                  </tr>
                ))}
                {rows.length > 0 && (
                  <tr className="border-t-2 font-semibold bg-muted/50">
                    <td className="p-3">Total</td>
                    <td className="p-3 text-right">
                      ${Number(total) ? Number(total).toFixed(3) : "0.000"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OthersSectionShow;