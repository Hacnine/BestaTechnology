import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTrimsAndAccessoriesQuery } from "@/redux/api/trimsAndAccessoriesApi";

const ManagementTrimsPage: React.FC = () => {
  const { data, isLoading, error } = useGetTrimsAndAccessoriesQuery({ page: 1, limit: 50 });

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Trims & Accessories</h2>
        <Link to="create">
          <Button>Create New</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <div>Loading...</div>}
          {error && <div className="text-destructive">Failed to load.</div>}
          {!isLoading && data && (
            data.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground">No trims & accessories found.</div>
            ) : (
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Created At</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item: any) => (
                    <tr key={item.id} className="border-b hover:bg-muted/20">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="p-2">
                        <div className="flex gap-2 flex items-center justify-center text-center">
                          <Link to={`${item.id}`} className="text-sm text-blue-600 flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                          </Link>
                          <Link to={`edit/${item.id}`} className="text-sm text-green-600 flex items-center">
                            <Edit className="h-4 w-4 mr-1" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagementTrimsPage;
