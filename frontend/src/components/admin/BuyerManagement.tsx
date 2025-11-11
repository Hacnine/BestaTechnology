import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Pencil, Trash } from "lucide-react";
import BuyerForm from "../merchandiser/BuyerForm";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  useGetBuyersQuery,
  useEditBuyerMutation,
  useDeleteBuyerMutation,
} from "@/redux/api/buyerApi";
import toast from "react-hot-toast";

export default function BuyerManagement() {
  const navigate = useNavigate();
  const [openTna, setOpenTna] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading } = useGetBuyersQuery({ page, limit });
  const [editBuyer] = useEditBuyerMutation();
  const [deleteBuyer] = useDeleteBuyerMutation();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", country: "" });

  const handleEditClick = (buyer: any) => {
    setEditingId(buyer.id);
    setEditForm({ name: buyer.name, country: buyer.country });
  };

  const handleEditSave = async (id: number) => {
    await editBuyer({ id, ...editForm });
    setEditingId(null);
    toast.success("The buyer details have been updated successfully.");
  };

  const handleDelete = async (id: number) => {
    await deleteBuyer(id);
    toast.success("The buyer has been deleted successfully.");
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Buyer Management"
        description="Manage all of the buyers"
        actions={
          <Button onClick={() => setOpenTna((prev) => !prev)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Buyer
          </Button>
        }
      />

      {openTna && (
        <Card className="p-4 ">
          <BuyerForm />
        </Card>
      )}

      {/* Buyer List Table */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Buyers</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}>Loading...</TableCell>
              </TableRow>
            ) : (
              data?.data?.map((buyer: any) => (
                <TableRow key={buyer.id}>
                  <TableCell>{buyer.id}</TableCell>
                  <TableCell>
                    {editingId === buyer.id ? (
                      <input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, name: e.target.value }))
                        }
                        className="border px-2 py-1"
                      />
                    ) : (
                      buyer.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === buyer.id ? (
                      <input
                        value={editForm.country}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, country: e.target.value }))
                        }
                        className="border px-2 py-1"
                      />
                    ) : (
                      buyer.country
                    )}
                  </TableCell>
                  <TableCell>{buyer.buyerDepartments?.name || "-"}</TableCell>
                  <TableCell>
                    {editingId === buyer.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleEditSave(buyer.id)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          className="ml-2"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(buyer)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        {/* <Button
                          size="sm"
                          className="ml-2"
                          variant="destructive"
                          onClick={() => handleDelete(buyer.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button> */}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span>
            Page {page} of {data?.pagination?.totalPages || 1}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= (data?.pagination?.totalPages || 1)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
}
