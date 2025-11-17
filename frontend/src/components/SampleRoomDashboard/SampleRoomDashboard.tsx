import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useGetSampleDevelopmentsQuery,
  useCreateSampleDevelopmentMutation,
  useUpdateSampleDevelopmentMutation,
  useDeleteSampleDevelopmentMutation,
} from "@/redux/api/sampleDevelopementApi";
import toast from "react-hot-toast";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { X, Loader2, FileX } from "lucide-react";
import { calculateTnaValues } from "@/utils/tnaCalculations";
import CustomDateInput from "../ui/custom-date-input";
import { useUser } from "@/redux/slices/userSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import SearchInput from "@/components/ui/search-input";
import url from "@/config/urls";

const SampleDevelopement = () => {
  const [openForm, setOpenForm] = useState(false);
  const { user } = useUser();
  const [form, setForm] = useState({
    style: "",
    samplemanName: "",
    sampleReceiveDate: "",
    sampleCompleteDate: "",
    sampleQuantity: "",
  });
  const [createSampleDevelopment, { isLoading }] =
    useCreateSampleDevelopmentMutation();
  const [updateSampleDevelopment, { isLoading: isUpdating }] =
    useUpdateSampleDevelopmentMutation();

  const [editId, setEditId] = useState<string | null>(null);

  // Accept dialog states
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [acceptSamplemanName, setAcceptSamplemanName] = useState("");
  const [quantity, setQuantity] = useState<number | null>(null);

  // Pagination, search, and date filter state
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [actualCompleteDate, setActualCompleteDate] = useState("");
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const actualCompleteDateRef = useRef<HTMLInputElement>(null);


  const {
    data,
    isLoading: isTableLoading,
    error: tableError,
  } = useGetSampleDevelopmentsQuery({
    page,
    pageSize,
    search: search || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    actualCompleteDate: actualCompleteDate || undefined,
  });

  // determine if any row has an actual completion date to conditionally show the column
  // be resilient to possible field-name variations from the backend
  const showActualCompleteColumn = (data?.data || []).some(
    (r: any) =>
      !!(
        r.actualSampleCompleteDate ||
        r.actualCompleteDate ||
        r.actual_sample_complete_date
      )
  );
  const baseColumnCount = 8; // original number of columns
  const colCount = baseColumnCount + (showActualCompleteColumn ? 1 : 0);

  useEffect(() => {
    setPage(1);
  }, [search, startDate, endDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateSampleDevelopment({
          id: editId,
          style: form.style,
          samplemanName: form.samplemanName,
          sampleReceiveDate: new Date(form.sampleReceiveDate).toISOString(),
          sampleCompleteDate: new Date(form.sampleCompleteDate).toISOString(),
          sampleQuantity: Number(form.sampleQuantity),
        }).unwrap();
        toast.success("Sample Development updated successfully");
      } else {
        await createSampleDevelopment({
          style: form.style,
          samplemanName: form.samplemanName,
          sampleReceiveDate: new Date(form.sampleReceiveDate).toISOString(),
          sampleCompleteDate: new Date(form.sampleCompleteDate).toISOString(),
          sampleQuantity: Number(form.sampleQuantity),
        }).unwrap();
        toast.success("Sample Development created successfully");
      }
      setForm({
        style: "",
        samplemanName: "",
        sampleReceiveDate: "",
        sampleCompleteDate: "",
        sampleQuantity: "",
      });
      setEditId(null);
      setOpenForm(false);
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to submit Sample Development");
    }
  };

  // Direct complete handler (no modal)
  const handleComplete = async (row: any) => {
    try {
      await updateSampleDevelopment({
        id: row.id,
        acceptance: false,
      }).unwrap();
      toast.success("Sample Development completed successfully");
    } catch (error: any) {
      toast.error(
        error?.data?.error || "Failed to complete Sample Development"
      );
    }
  };

  // Accept handler
  const handleAccept = async (row: any, samplemanName: string, quantity: number | null) => {
    try {
      await updateSampleDevelopment({
        id: row.id,
        acceptance: true,
        samplemanName,
        sampleQuantity: quantity,
      }).unwrap();
      toast.success("Sample Development accepted successfully");
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to accept Sample Development");
    }
  };

  // Edit handler
  const handleEdit = (row: any) => {
    setForm({
      style: row.style || "",
      samplemanName: row.samplemanName || "",
      sampleReceiveDate: row.sampleReceiveDate
        ? new Date(row.sampleReceiveDate).toISOString().slice(0, 10)
        : "",
      sampleCompleteDate: row.sampleCompleteDate
        ? new Date(row.sampleCompleteDate).toISOString().slice(0, 10)
        : "",
      sampleQuantity: row.sampleQuantity?.toString() || "",
    });
    setEditId(row.id);
    setOpenForm(true);
  };

  return (
    <div className="p-4 space-y-6 ">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          Sample Development
        </h1>
      </div>

      {/* Search Controls */}
      <div className="flex flex-wrap gap-2 mb-4 items-end w-[85%]">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search By Style, Name"
        />
        <CustomDateInput
          ref={startDateRef}
          label="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <CustomDateInput
          ref={endDateRef}
          label="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <CustomDateInput
          ref={actualCompleteDateRef}
          label="Actual Complete Date"
          value={actualCompleteDate}
          onChange={(e) => setActualCompleteDate(e.target.value)}
        />
        <Button
          variant="outline"
          size="sm"
          className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600 hover:text-red-700"
          onClick={() => {
            setSearch("");
            setStartDate("");
            setEndDate("");
            setActualCompleteDate("");
          }}
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      {openForm && (
        <Card className="mt-4">
          <CardContent className="py-6">
            <form
              className="grid md:grid-cols-2 grid-cols-1 gap-4"
              onSubmit={handleSubmit}
            >
              <div>
                <label className="text-sm font-medium">Sampleman Name</label>
                <Input
                  name="samplemanName"
                  value={form.samplemanName}
                  onChange={handleChange}
                  placeholder="Enter sampleman name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Sample Quantity</label>
                <Input
                  name="sampleQuantity"
                  type="number"
                  value={form.sampleQuantity}
                  onChange={handleChange}
                  placeholder="Enter sample quantity"
                  required
                />
              </div>
              <div className="col-span-2 flex justify-center">
                <Button type="submit" disabled={isLoading || isUpdating}>
                  {editId ? "Update" : "Submit"}
                </Button>
                {editId && (
                  <Button
                    type="button"
                    variant="outline"
                    className="ml-2"
                    onClick={() => {
                      setEditId(null);
                      setForm({
                        style: "",
                        samplemanName: "",
                        sampleReceiveDate: "",
                        sampleCompleteDate: "",
                        sampleQuantity: "",
                      });
                      setOpenForm(false);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Sample Development Table */}
      <Card className="mt-4">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Style</TableHead>
                <TableHead>Item Image</TableHead>
                <TableHead>Merchandiser</TableHead>
                <TableHead>Sampleman Name</TableHead>
                <TableHead>Receive Date</TableHead>
                <TableHead>Estimated Date</TableHead>
                <TableHead>Actual Complete</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isTableLoading ? (
                <TableRow>
                  <TableCell colSpan={colCount} className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading Sample Developments...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : tableError ? (
                <TableRow>
                  <TableCell colSpan={colCount} className="text-center py-8">
                    <div className="text-red-500">
                      <p className="font-medium">
                        Failed to load Sample Developments
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {(tableError as any)?.data?.message ||
                          "Please try again later"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (data?.data || []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={colCount} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <FileX className="h-12 w-12 text-muted-foreground/50" />
                      <div className="text-muted-foreground">
                        <p className="font-medium text-lg">
                          No Sample Development data found
                        </p>
                        <p className="text-sm mt-1">
                          Try adjusting your search filters{" "}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                (data?.data || []).map((row: any, index: number) => {
                  // Calculate Sample values using the utility function
                  const { sampleRemaining, sampleActualBadge } =
                    calculateTnaValues({
                      id: row.id,
                      sampleDevelopment: {
                        sampleCompleteDate: row.sampleCompleteDate,
                        actualSampleCompleteDate: row.actualSampleCompleteDate,
                      },
                    });
                  return (
                    <TableRow
                      key={row.id}
                      className="animate__animated animate__fadeInUp"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <TableCell>{row.tna?.style}</TableCell>
                      <TableCell>
                        {row.tna?.itemImage ? (
                          <img
                            src={`${url.BASE_URL}${encodeURI(
                              row.tna.itemImage
                            )}`}
                            alt="Item"
                            className="h-12 w-12 object-cover rounded border"
                          />
                        ) : (
                          "No Image"
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          {row.tna?.merchandiser?.userName || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sky-500 font-medium ">
                          {row.samplemanName
                            ? `Developed By ${row.samplemanName}`
                            : "Not Assigned"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {row.sampleReceiveDate
                          ? new Date(row.sampleReceiveDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              }
                            )
                          : ""}
                      </TableCell>
                      <TableCell>
                        {sampleActualBadge ? (
                          sampleActualBadge
                        ) : sampleRemaining !== null ? (
                          <span
                            className={
                              sampleRemaining < 0
                                ? "text-red-500"
                                : "text-blue-600"
                            }
                          >
                            {sampleRemaining < 0
                              ? `${Math.abs(sampleRemaining)} days overdue`
                              : sampleRemaining === 0
                              ? "Due today"
                              : `${sampleRemaining} days left`}
                          </span>
                        ) : row.sampleCompleteDate ? (
                          new Date(row.sampleCompleteDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )
                        ) : (
                          ""
                        )}
                      </TableCell>
                      {showActualCompleteColumn && (
                        <TableCell>
                          {row.actualSampleCompleteDate
                            ? new Date(
                                row.actualSampleCompleteDate
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              })
                            : ""}
                        </TableCell>
                      )}
                      <TableCell>{row.sampleQuantity}</TableCell>
                      <TableCell className=" flex items-center gap-2">
                        {row.actualSampleCompleteDate ? (
                          <Button variant="outline" size="sm" disabled>
                            Completed
                          </Button>
                        ) : row.samplemanName ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleComplete(row)}
                          >
                            Complete
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRow(row);
                              setAcceptDialogOpen(true);
                            }}
                          >
                            Accept
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(row)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
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
              onClick={() =>
                setPage((p) =>
                  data?.totalPages ? Math.min(data.totalPages, p + 1) : p + 1
                )
              }
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Accept Dialog */}
      <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Sample Development</DialogTitle>
          </DialogHeader>
          <div>
            <label className="text-sm font-medium">Sampleman Name</label>
            <Input
              value={acceptSamplemanName}
              onChange={(e) => setAcceptSamplemanName(e.target.value)}
              placeholder="Enter sampleman name"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Sample Quantity</label>
            <Input
              name="sampleQuantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Enter sample quantity"
              required
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAcceptDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedRow && acceptSamplemanName) {
                  handleAccept(selectedRow, acceptSamplemanName, quantity);
                  setAcceptDialogOpen(false);
                  setAcceptSamplemanName("");
                }
              }}
            >
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SampleDevelopement;
