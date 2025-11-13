import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import TnaForm from "./TnaForm";
import url from "@/config/urls";

import { useGetTNAsQuery, useUpdateTNAMutation } from "@/redux/api/tnaApi"; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function SampleTna() {
  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;
  // Search state
  const [search, setSearch] = useState("");

  // Fetch with pagination and search params
  const { data, isLoading, error } = useGetTNAsQuery({ page, pageSize, search });
  const [openTna, setOpenTna] = useState(false);
  const [modal, setModal] = useState({ open: false, type: null, details: null });
  const [editTna, setEditTna] = useState(null);
  const [updateTNA] = useUpdateTNAMutation();

  // Modal state for merchandiser and buyer
  const openDetailsModal = (type, details) => setModal({ open: true, type, details });
  const closeModal = () => setModal({ open: false, type: null, details: null });

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="New Order"
        description=" Manage your sample TNA here."
        actions={
          <Button onClick={() => setOpenTna((prev) => !prev)}>
            <Plus className="h-4 w-4 mr-2" />
            Create TNA
          </Button>
        }
      />

      {/* Search Input - match table width */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-2 w-full">
          <div className="w-full">
            <div className="relative w-full">
              <Input
                type="text"
                className="w-full placeholder:text-sm pl-8 border rounded-md"
                placeholder="Search By Style "
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1); // Reset to first page on new search
                }}
                disabled={isLoading}
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearch("")}
            disabled={!search}
          >
            Clear
          </Button>
        </div>
      </Card>

      {openTna && (
        <Card className="p-4 ">
          <TnaForm
            onSuccess={() => {
              setOpenTna(false);
              setEditTna(null);
            }}
            initialValues={editTna}
            onEdit={async (values) => {
              if (!editTna) return;
              await updateTNA({ id: editTna.id, ...values }).unwrap();
            }}
          />
        </Card>
      )}

      {/* TNA Table */}
      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-nowrap">Item Name</TableHead>
              <TableHead className="text-nowrap">Image</TableHead>
              <TableHead className="text-nowrap">Style</TableHead>
              <TableHead className="text-nowrap">Order Date</TableHead>
              <TableHead className="text-nowrap">Sending Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-nowrap">Sample Type</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Merchandiser</TableHead>
              <TableHead>Actions</TableHead> 
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data?.data || []).map((row) => (
              <TableRow key={row.id}>
                <TableCell className="text-nowrap">{row.itemName}</TableCell>
                <TableCell>
                  {row.itemImage ? (
                    <img
                      src={`${url.BASE_URL}${encodeURI(row.itemImage)}`}
                      alt={row.style}
                      className="h-12 w-12 object-cover rounded border"
                      style={{ maxWidth: 48, maxHeight: 48 }}
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">No image</span>
                  )}
                </TableCell>
                <TableCell className="text-nowrap">{row.style}</TableCell>
                <TableCell className="text-nowrap">
                  {row.orderDate
                    ? new Date(row.orderDate).toLocaleDateString()
                    : ""}
                </TableCell>
                <TableCell className="text-nowrap">
                  {row.sampleSendingDate
                    ? new Date(row.sampleSendingDate).toLocaleDateString()
                    : ""}
                </TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.sampleType}</TableCell>
                <TableCell>
                  {row.buyer?.name ? (
                    <Button
                      variant="link"
                      className="-ml-4"
                      onClick={() => openDetailsModal("buyer", row.buyer)}
                    >
                      {row.buyer.name}
                    </Button>
                  ) : (
                    ""
                  )}
                </TableCell>
                <TableCell>
                  {row.merchandiser?.userName ? (
                    <Button
                      variant="link"
                      className="-ml-4"
                      onClick={() => openDetailsModal("merchandiser", row.merchandiser)}
                    >
                      {row.merchandiser.userName}
                    </Button>
                  ) : (
                    ""
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditTna(row);
                      setOpenTna(true);
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span>
            Page {data?.page || page} of {data?.totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={data?.page >= data?.totalPages}
            onClick={() => setPage((p) => (data?.totalPages ? Math.min(data.totalPages, p + 1) : p + 1))}
          >
            Next
          </Button>
        </div>
      </Card>

      {/* Details Modal */}
      <Dialog open={modal.open} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modal.type === "buyer"
                ? "Buyer Details"
                : modal.type === "merchandiser"
                ? "Merchandiser Details"
                : ""}
            </DialogTitle>
          </DialogHeader>
          {modal.details && (
            <div className="space-y-2">
              {modal.type === "buyer" && (
                <>
                  <div><strong>Name:</strong> {modal.details.name}</div>
                  <div><strong>Country:</strong> {modal.details.country}</div>
                  <div><strong>Department ID:</strong> {modal.details.buyerDepartmentId || "-"}</div>
                </>
              )}
              {modal.type === "merchandiser" && (
                <>
                  <div><strong>Name:</strong> {modal.details.userName}</div>
                  <div><strong>Role:</strong> {modal.details.role}</div>
                  <div><strong>Employee ID:</strong> {modal.details.employeeId}</div>
                </>
              )}
            </div>
          )}
          <Button onClick={closeModal}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
