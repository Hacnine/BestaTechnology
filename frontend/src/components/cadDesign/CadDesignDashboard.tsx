import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  useCreateCadApprovalMutation,
  useGetCadApprovalQuery,
  useUpdateCadDesignMutation,
} from "@/redux/api/cadApi";
import toast from "react-hot-toast";
import { PageHeader } from "../ui/page-header";
import CustomDateInput from "../ui/custom-date-input";
import url from "@/config/urls";
import { calculateTnaValues } from "@/utils/tnaCalculations";
import { Loader2 } from "lucide-react";
import { FileX } from "lucide-react";
import { Search } from "lucide-react";
import { X } from "lucide-react";
import "animate.css";
import SearchInput from "@/components/ui/search-input";

const CadDesignDashboard = () => {
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({
    style: "",
    fileReceiveDate: "",
    completeDate: "",
    cadMasterName: "",
  });
  const [createCadApproval, { isLoading }] = useCreateCadApprovalMutation();
  const [updateCadDesign, { isLoading: isUpdating }] =
    useUpdateCadDesignMutation(); 

  const [editId, setEditId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Search and date filter state
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Refs for date inputs
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  // Query with search and date range
  const { data: cadApprovals, isLoading: isTableLoading, error: tableError } =
    useGetCadApprovalQuery({
      page,
      pageSize,
      search: search || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });

  // Reset to first page on filter change
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
        // Edit mode
        await updateCadDesign({
          id: editId,
          style: form.style,
          fileReceiveDate: new Date(form.fileReceiveDate).toISOString(),
          completeDate: new Date(form.completeDate).toISOString(),
          CadMasterName: form.cadMasterName,
        }).unwrap();
        toast.success("CAD Design approval updated successfully");
      } else {
        // Create mode
        await createCadApproval({
          style: form.style,
          fileReceiveDate: new Date(form.fileReceiveDate).toISOString(),
          completeDate: new Date(form.completeDate).toISOString(),
          cadMasterName: form.cadMasterName,
        }).unwrap();
        toast.success("CAD Design approval created successfully");
      }
      setForm({
        style: "",
        fileReceiveDate: "",
        completeDate: "",
        cadMasterName: "",
      });
      setOpenForm(false);
      setEditId(null);
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to submit CAD Design approval");
    }
  };

  // Accept handler
  const handleAccept = async (row: any, completed: boolean) => {
    try {
      await updateCadDesign({
        id: row.id,
        acceptance: completed,
      }).unwrap();
      toast.success("CAD Design accepted successfully");
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to accept CAD Design");
    }
  };

  return (
    <div className="p-4 space-y-6 ">
      <div className="flex items-center justify-between">
        <PageHeader
          title="CAD Design Approval"
          description=" Manage CAD design entries and track progress efficiently."
        />

        {/* <Button onClick={() => setOpenForm((prev) => !prev)}>
          {openForm ? "Close Form" : "Add CAD Approval"}
        </Button> */}
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
        <Button
          variant="outline"
          size="sm"
          className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600 hover:text-red-700"
          onClick={() => {
            setSearch("");
            setStartDate("");
            setEndDate("");
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
                <label className="text-sm font-medium">Style</label>
                <Input
                  name="style"
                  value={form.style}
                  onChange={handleChange}
                  placeholder="Enter style"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Cad Master Name</label>
                <Input
                  name="cadMasterName"
                  value={form.cadMasterName}
                  onChange={handleChange}
                  placeholder="Enter CAD master name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">File Receive Date</label>
                <Input
                  name="fileReceiveDate"
                  type="date"
                  value={form.fileReceiveDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Complete Date</label>
                <Input
                  name="completeDate"
                  type="date"
                  value={form.completeDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-span-2  flex justify-center">
                <Button
                  className=""
                  type="submit"
                  disabled={isLoading || isUpdating}
                >
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
                        fileReceiveDate: "",
                        completeDate: "",
                        cadMasterName: "",
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

      {/* CAD Approval Table */}
      <Card className="mt-4">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Style</TableHead>
                <TableHead>Item Image</TableHead>
                <TableHead>Merchandiser</TableHead>
                <TableHead>CAD Master Name</TableHead>
                <TableHead>File Receive Date</TableHead>
                <TableHead>Estimated Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isTableLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading CAD approvals...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : tableError ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-red-500">
                      <p className="font-medium">Failed to load CAD approvals</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {(tableError as any)?.data?.message || "Please try again later"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (cadApprovals?.data || []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <FileX className="h-12 w-12 text-muted-foreground/50" />
                      <div className="text-muted-foreground">
                        <p className="font-medium text-lg">No CAD data found</p>
                        <p className="text-sm mt-1">Try adjusting your search filters </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                (cadApprovals?.data || []).map((row: any, index: number) => {
                  // Calculate CAD values using the utility function
                  const { cadRemaining, cadActualBadge } = calculateTnaValues({
                    id: row.id,
                    cad: {
                      completeDate: row.completeDate,
                      finalCompleteDate: row.finalCompleteDate,
                    },
                  });
                  return (
                  <TableRow key={row.id} className="animate__animated animate__fadeInUp" style={{ animationDelay: `${index * 0.05}s` }}>
                    <TableCell>{row.tna?.style}</TableCell>
                    <TableCell>
                      {row.tna?.itemImage ? (
                        <img
                          src={`${url.BASE_URL}${encodeURI(row.tna.itemImage)}`}
                          alt="Item"
                          className="h-12 w-12 object-cover rounded border"
                        />
                      ) : (
                        "No Image"
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{row.tna?.merchandiser?.userName || "N/A"}</span>
                    </TableCell>
                    <TableCell><span className="text-sky-500 font-medium ">{row.CadMasterName ? `Accepted By ${row.CadMasterName}` : "Not Assigned"}</span></TableCell>
                    <TableCell>
                      {row.fileReceiveDate
                        ? new Date(row.fileReceiveDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: '2-digit', 
                            day: '2-digit' 
                          })
                        : ""}
                    </TableCell>

                    <TableCell>
                      {cadActualBadge ? (
                        cadActualBadge
                      ) : cadRemaining !== null ? (
                        <span className={cadRemaining < 0 ? "text-red-500" : "text-blue-600"}>
                          {cadRemaining < 0
                            ? `${Math.abs(cadRemaining)} days overdue`
                            : cadRemaining === 0
                            ? "Due today"
                            : `${cadRemaining} days left`}
                        </span>
                      ) : (
                        row.completeDate
                          ? new Date(row.completeDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: '2-digit', 
                              day: '2-digit' 
                            })
                          : ""
                      )}
                    </TableCell>

                    <TableCell>
                      {row.finalCompleteDate ? (
                        <span className="text-green-600 font-medium">
                          CAD is finished ({new Date(row.finalCompleteDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: '2-digit', 
                            day: '2-digit' 
                          })})
                        </span>
                      ) : row.CadMasterName ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-2 border-green-700 hover:border-transparent text-green-700"
                          onClick={() => handleAccept(row, false)}
                        >
                          Finish
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAccept(row, true)}
                        >
                          Accept
                        </Button>
                      )}
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
              Page {cadApprovals?.page || page} of{" "}
              {cadApprovals?.totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={cadApprovals?.page >= cadApprovals?.totalPages}
              onClick={() =>
                setPage((p) =>
                  cadApprovals?.totalPages
                    ? Math.min(cadApprovals.totalPages, p + 1)
                    : p + 1
                )
              }
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CadDesignDashboard;
