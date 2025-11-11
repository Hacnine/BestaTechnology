import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTrimsAndAccessoriesByIdQuery } from "@/redux/api/trimsAndAccessoriesApi";

interface Props {
  id: number;
}

const TrimsAndAccessoriesShow: React.FC<Props> = ({ id }) => {
  const { data, isLoading, error } = useGetTrimsAndAccessoriesByIdQuery(id);

  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <div className="text-destructive">Failed to load item.</div>;

  const rows = data.trimsRows?.rows || data.trimsRows || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trims & Accessories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-sm text-muted-foreground">Name</div>
          <div className="font-medium">{data.name}</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-center p-3 font-medium">Item Description</th>
                <th className="text-center p-3 font-medium">USD / Dozen</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(rows) && rows.length > 0 ? (
                rows.map((r: any, idx: number) => (
                  <tr key={r.id ?? idx} className="border-b">
                    <td className="p-3 text-center">{r.description}</td>
                    <td className="p-3 text-center">{Number(r.cost || 0).toFixed(3)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3" colSpan={2}>No rows</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrimsAndAccessoriesShow;
