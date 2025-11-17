import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import url from "@/config/urls";

import {
  useGetFabricBookingsQuery,
  useCreateFabricBookingMutation,
  useUpdateFabricBookingMutation,
} from "@/redux/api/fabricBooking";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Search, X, Loader2, FileX } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import CustomDateInput from "@/components/ui/custom-date-input";
import { calculateFabricValues } from "@/utils/fabricCalculations";
import SearchInput from "@/components/ui/search-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FabricBooking = () => {
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({
    style: "",
    receiveDate: "",
    completeDate: "",
  });
  const [createFabricBooking, { isLoading }] = useCreateFabricBookingMutation();
  const [updateFabricBooking, { isLoading: isUpdating }] =
    useUpdateFabricBookingMutation();

  const [editId, setEditId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Search and date filter state
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ownBooking, setOwnBooking] = useState(true);

  // Refs for date inputs
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  // Query with search and date range
  const { data: fabricBookings, isLoading: isTableLoading, error: tableError } =
    useGetFabricBookingsQuery({
      page,
      pageSize,
      search: search || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      ownFabric: ownBooking,
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
        await updateFabricBooking({
          id: editId,
          style: form.style,
          receiveDate: new Date(form.receiveDate).toISOString(),
          completeDate: new Date(form.completeDate).toISOString(),
        }).unwrap();
        toast.success("Fabric Booking updated successfully");
      } else {
        // Create mode
        await createFabricBooking({
          style: form.style,
          receiveDate: new Date(form.receiveDate).toISOString(),
          completeDate: new Date(form.completeDate).toISOString(),
        }).unwrap();
        toast.success("Fabric Booking created successfully");
      }
      setForm({
        style: "",
        receiveDate: "",
        completeDate: "",
      });
      setOpenForm(false);
      setEditId(null);
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to submit Fabric Booking");
    }
  };

  // Mark booking accepted/complete
  const handleAccept = async (row: any, acceptance: boolean, isComplete: boolean) => {
    try {
      await updateFabricBooking({
        id: row.id,
        // send isComplete flag to the backend as requested
        acceptance,
        isComplete
      }).unwrap();
      toast.success("Fabric Booking updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to update Fabric Booking");
    }
  };

  return (
    <div className="p-4 space-y-6 ">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Fabric Booking"
          description="Manage fabric bookings and track their status efficiently."
        />

        <Button onClick={() => setOpenForm((prev) => !prev)}>
          {openForm ? "Close Form" : "Add Fabric Booking"}
        </Button>
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
            setOwnBooking(false);
          }}
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-40">
              {ownBooking ? "Own Bookings" : "Unaccepted Bookings"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onSelect={() => {
                setOwnBooking(true);
                setPage(1);
              }}
            >
              Own Bookings
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setOwnBooking(false);
                setPage(1);
              }}
            >
              Unaccepted Bookings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
                <label className="text-sm font-medium">Receive Date</label>
                <Input
                  name="receiveDate"
                  type="date"
                  value={form.receiveDate}
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
                        receiveDate: "",
                        completeDate: "",
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

      {/* Fabric Booking Table */}
      <Card className="mt-4">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SN</TableHead>
                <TableHead>Style</TableHead>
                <TableHead>Item Image</TableHead>
                <TableHead>Merchandiser</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Receive Date</TableHead>
                <TableHead>Complete Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isTableLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading fabric bookings...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : tableError ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-red-500">
                      <p className="font-medium">Failed to load fabric bookings</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {(tableError as any)?.data?.message || "Please try again later"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (fabricBookings?.data || []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <FileX className="h-12 w-12 text-muted-foreground/50" />
                      <div className="text-muted-foreground">
                        <p className="font-medium text-lg">No fabric booking data found</p>
                        <p className="text-sm mt-1">Try adjusting your search filters</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                (fabricBookings?.data || []).map((row: any, index: number) => {
                  // Calculate fabric values using the utility function
                  const { fabricRemaining, fabricActualBadge } = calculateFabricValues({
                    completeDate: row.completeDate,
                    actualCompleteDate: row.actualCompleteDate,
                  });
                  return (
                    <TableRow key={row.id} className="animate__animated animate__fadeInUp" style={{ animationDelay: `${index * 0.05}s` }}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.tna?.style}</TableCell>
                      <TableCell>
                        {row.tna?.itemImage ? (
                          <img
                            src={`${url.BASE_URL}${encodeURI(row.tna.itemImage)}`}
                            alt="Item"
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          "--"
                        )}
                      </TableCell>
                      <TableCell>{row.tna?.merchandiser?.userName || "--"}</TableCell>
                      <TableCell>{row.createdBy?.userName || "--"}</TableCell>
                      <TableCell>
                        {row.receiveDate
                          ? new Date(row.receiveDate).toLocaleDateString()
                          : "--"}
                      </TableCell>
                      <TableCell>
                        {fabricActualBadge ? (
                          fabricActualBadge
                        ) : fabricRemaining !== null ? (
                          <span className={fabricRemaining < 0 ? "text-red-500" : "text-blue-600"}>
                            {fabricRemaining < 0
                              ? `${Math.abs(fabricRemaining)} days overdue`
                              : fabricRemaining === 0
                              ? "Due today"
                              : `${fabricRemaining} days left`}
                          </span>
                        ) : (
                          row.completeDate
                            ? new Date(row.completeDate).toLocaleDateString()
                            : "--"
                        )}
                      </TableCell>
                      <TableCell>
                        {row.actualCompleteDate ? (
                          <span className="text-green-600 font-medium">
                            Completed {new Date(row.actualCompleteDate).toLocaleDateString()}
                          </span>
                        ) : row.receiveDate ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAccept(row, false, true)}
                          >
                            Complete
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAccept(row, true, false)}
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
              Page {fabricBookings?.page || page} of{" "}
              {fabricBookings?.totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={fabricBookings?.page >= fabricBookings?.totalPages}
              onClick={() =>
                setPage((p) =>
                  fabricBookings?.totalPages
                    ? Math.min(fabricBookings.totalPages, p + 1)
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

export default FabricBooking;
