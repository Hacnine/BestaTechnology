import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useDeleteTNAMutation, useGetTNASummaryQuery } from "@/redux/api/tnaApi";
import { useUpdateCadDesignMutation } from "@/redux/api/cadApi";
import { useUpdateFabricBookingMutation } from "@/redux/api/fabricBooking";
import { useUpdateSampleDevelopmentMutation } from "@/redux/api/sampleDevelopementApi";
import { getStatusBadge, getActualCompleteBadge } from "./SampleTnaBadges";
import {
  BuyerModal,
  CadModal,
  FabricModal,
  LeadTimeModal,
  SampleModal,
} from "./SampleTnaModals";
import { useUpdateDHLTrackingMutation } from "@/redux/api/dHLTrackingApi";
import { useUser } from "@/redux/slices/userSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Filter, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import CustomDateInput from "../ui/custom-date-input";
import url from "@/config/urls";
import * as XLSX from "xlsx";
import { exportSampleTnaExcel } from "../../utils/exportSampleTnaExcel";
import { calculateTnaValues } from "@/utils/tnaCalculations";

type SampleTnaTableProps = {
  readOnlyModals?: boolean;
};

const SampleTnaTable = ({ readOnlyModals = false }: SampleTnaTableProps) => {
  const [isBuyerModalVisible, setBuyerModalVisible] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState("");
  const [updateCadDesign, { isLoading: isUpdating }] =
    useUpdateCadDesignMutation();
  const [updateFabricBooking, { isLoading: isFabricUpdating }] =
    useUpdateFabricBookingMutation();
  const [updateSampleDevelopment, { isLoading: isSampleUpdating }] =
    useUpdateSampleDevelopmentMutation();
  const [updateDHLTracking, { isLoading: isCreatingDHL }] =
    useUpdateDHLTrackingMutation();

  const [deleteTNA, { isLoading: isDeleting }] = useDeleteTNAMutation();

  const { user } = useUser();
  const isAdmin = user?.role === "ADMIN";

  const [leadTimeModal, setLeadTimeModal] = useState<{
    open: boolean;
    row: any | null;
  }>({
    open: false,
    row: null,
  });
  const [cadModal, setCadModal] = useState<{ open: boolean; cad: any | null }>({
    open: false,
    cad: null,
  });
  const [fabricModal, setFabricModal] = useState<{
    open: boolean;
    fabric: any | null;
  }>({
    open: false,
    fabric: null,
  });
  const [sampleModal, setSampleModal] = useState<{
    open: boolean;
    sample: any | null;
  }>({
    open: false,
    sample: null,
  });
  const [dhlModal, setDhlModal] = useState<{
    open: boolean;
    style: string | null;
    tnaId: number | null;
  }>({ open: false, style: null, tnaId: null });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    tnaId: number | null;
    style: string | null;
  }>({ open: false, tnaId: null, style: null });
  const [finalFileReceivedDate, setFinalFileReceivedDate] = useState("");
  const [finalCompleteDate, setFinalCompleteDate] = useState("");
  const [actualBookingDate, setActualBookingDate] = useState("");
  const [actualReceiveDate, setActualReceiveDate] = useState("");
  const [actualSampleReceiveDate, setActualSampleReceiveDate] = useState("");
  const [actualSampleCompleteDate, setActualSampleCompleteDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Search state
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Add completed dropdown state
  const [completed, setCompleted] = useState<"false" | "true">("false");

  // Query with search, date range, and completed
  const { data: queryData, isLoading: queryLoading } = useGetTNASummaryQuery({
    page,
    pageSize,
    search: search || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    completed,
  });

  const tnaSummary = queryData?.data || [];
  const totalPages = queryData?.totalPages || 1;

  // Reset to first page on search/date change
  useEffect(() => {
    setPage(1);
  }, [search, startDate, endDate]);

  const showBuyerModal = (buyer: string) => {
    setBuyerInfo(buyer);
    setBuyerModalVisible(true);
  };

  const handleBuyerModalClose = () => {
    setBuyerModalVisible(false);
  };

  // When opening CAD modal, set editable fields
  const openCadModal = (cad: any) => {
    setCadModal({ open: true, cad });
    setFinalFileReceivedDate(
      cad?.finalFileReceivedDate
        ? new Date(cad.finalFileReceivedDate).toISOString().slice(0, 10)
        : ""
    );
    setFinalCompleteDate(
      cad?.finalCompleteDate
        ? new Date(cad.finalCompleteDate).toISOString().slice(0, 10)
        : ""
    );
  };

  // When opening Fabric modal, set editable fields
  const openFabricModal = (fabric: any) => {
    setFabricModal({ open: true, fabric });
    setActualBookingDate(
      fabric?.actualBookingDate
        ? new Date(fabric.actualBookingDate).toISOString().slice(0, 10)
        : ""
    );
    setActualReceiveDate(
      fabric?.actualReceiveDate
        ? new Date(fabric.actualReceiveDate).toISOString().slice(0, 10)
        : ""
    );
  };

  // When opening Sample modal, set editable fields
  const openSampleModal = (sample: any) => {
    setSampleModal({ open: true, sample });
    setActualSampleReceiveDate(
      sample?.actualSampleReceiveDate
        ? new Date(sample.actualSampleReceiveDate).toISOString().slice(0, 10)
        : ""
    );
    setActualSampleCompleteDate(
      sample?.actualSampleCompleteDate
        ? new Date(sample.actualSampleCompleteDate).toISOString().slice(0, 10)
        : ""
    );
  };

  // Update handler
  const handleUpdateCad = async () => {
    if (!cadModal.cad) return;
    try {
      await updateCadDesign({
        id: cadModal.cad.id,
        finalFileReceivedDate: finalFileReceivedDate
          ? new Date(finalFileReceivedDate).toISOString()
          : null,
        finalCompleteDate: finalCompleteDate
          ? new Date(finalCompleteDate).toISOString()
          : null,
      }).unwrap();
      setCadModal({ open: false, cad: null });
    } catch (err) {
      // handle error (toast, etc.)
    }
  };

  // Update handler for Fabric
  const handleUpdateFabric = async () => {
    if (!fabricModal.fabric) return;
    try {
      await updateFabricBooking({
        id: fabricModal.fabric.id,
        actualBookingDate: actualBookingDate
          ? new Date(actualBookingDate).toISOString()
          : null,
        actualReceiveDate: actualReceiveDate
          ? new Date(actualReceiveDate).toISOString()
          : null,
      }).unwrap();
      setFabricModal({ open: false, fabric: null });
    } catch (err) {
      // handle error (toast, etc.)
    }
  };

  // Update handler for Sample
  const handleUpdateSample = async () => {
    if (!sampleModal.sample) return;
    try {
      await updateSampleDevelopment({
        id: sampleModal.sample.id,
        actualSampleReceiveDate: actualSampleReceiveDate
          ? new Date(actualSampleReceiveDate).toISOString()
          : null,
        actualSampleCompleteDate: actualSampleCompleteDate
          ? new Date(actualSampleCompleteDate).toISOString()
          : null,
      }).unwrap();
      setSampleModal({ open: false, sample: null });
    } catch (err) {
      // handle error (toast, etc.)
    }
  };

  // Add DHL Tracking input state
  const [dhlTrackingInputs, setDhlTrackingInputs] = useState<{
    [style: string]: { trackingNumber: string; date: string };
  }>({});

  // Handler for DHL Tracking input changes
  const handleDHLInputChange = (
    field: "trackingNumber" | "date",
    value: string
  ) => {
    if (!dhlModal.style) return;
    setDhlTrackingInputs((prev) => ({
      ...prev,
      [dhlModal.style!]: {
        ...prev[dhlModal.style!],
        [field]: value,
      },
    }));
  };

  // Handler for DHL Tracking update
  const handleCreateDHLTracking = async () => {
    if (!dhlModal.tnaId) return;
    const { trackingNumber, date } =
      dhlTrackingInputs[dhlModal.style || ""] || {};
    if (!trackingNumber || !date) return;
    try {
      await updateDHLTracking({
        tnaId: dhlModal.tnaId,
        trackingNumber,
        date,
        isComplete: true,
      }).unwrap();
      setDhlTrackingInputs((prev) => ({
        ...prev,
        [dhlModal.style!]: { trackingNumber: "", date: "" },
      }));
      setDhlModal({ open: false, style: null, tnaId: null });
    } catch (err) {
      // handle error (toast, etc.)
    }
  };

  // Handler for TNA deletion
  const handleDeleteTNA = async () => {
    if (!deleteModal.tnaId) return;
    try {
      await deleteTNA(deleteModal.tnaId).unwrap();
      setDeleteModal({ open: false, tnaId: null, style: null });
    } catch (err) {
      // handle error (toast, etc.)
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div className="overflow-x-auto w-full">
        {/* Search Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap gap-2 mb-4 items-end w-[85%]">
            <div className="relative">
              <label className="block text-xs font-medium mb-1">Search</label>
              <Input
                type="text"
                className="md:w-[400px] placeholder:text-sm"
                placeholder="Name, Date, Style"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <CustomDateInput
              label="Start Date"
              value={startDate}
              onChange={(e: any) => setStartDate(e.target.value)}
            />

            <CustomDateInput
              label="End Date"
              value={endDate}
              onChange={(e: any) => setEndDate(e.target.value)}
            />

            {/* Completed Dropdown (shadcn Select) */}
            <div>
              <label className="block text-xs font-medium mb-1">Status</label>
              <Select
                value={completed}
                onValueChange={(v) => setCompleted(v as "false" | "true")}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">On Process</SelectItem>
                  <SelectItem value="true">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              Clear
            </Button>
          </div>

          <div className="flex items-center justify-end gap-2 ">
            <Button size="sm" onClick={() => exportSampleTnaExcel(tnaSummary)}>
              <Download className="h-4 w-4 " />
              Export All
            </Button>
          </div>
        </div>
        <Table className="min-w-max w-full">
          <TableHeader className="bg-background z-10">
            <TableRow>
              <TableHead className="text-nowrap sticky top-0 bg-background z-20">
                S/N
              </TableHead>
              <TableHead className="text-nowrap sticky left-0 top-0 bg-background z-30">
                Style
              </TableHead>
              {/* <TableHead className="text-nowrap sticky top-0 bg-background z-20">Item Name</TableHead> */}
              <TableHead className="text-nowrap sticky top-0 bg-background z-20">
                Image
              </TableHead>
              <TableHead className="text-nowrap sticky top-0 bg-background z-20">
                Merchandiser
              </TableHead>
              <TableHead className="sticky top-0 bg-background z-20">
                Buyer
              </TableHead>
              <TableHead className="text-nowrap sticky top-0 bg-background z-20">
                Sending Date
              </TableHead>
              <TableHead className="sticky top-0 bg-background z-20 text-left">
                Days Left
              </TableHead>
              <TableHead className="text-nowrap sticky top-0 bg-background z-20">
                Sample Type
              </TableHead>
              <TableHead className="sticky top-0 bg-background z-20">
                CAD
              </TableHead>
              <TableHead className="sticky top-0 bg-background z-20">
                Fabric
              </TableHead>
              <TableHead className="sticky top-0 bg-background z-20">
                Sample Swing
              </TableHead>
              <TableHead className="sticky top-0 bg-background z-20">
                DHL Tracking
              </TableHead>
              <TableHead className="sticky top-0 bg-background z-20">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queryLoading ? (
              <TableRow>
                <TableCell colSpan={13} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-2"></span>
                    <span className="text-muted-foreground">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              (tnaSummary || []).map((row: any, index: number) => {
                // Calculate all TNA values using the utility function
                const {
                  cadRemaining,
                  cadActualBadge,
                  leadTimeRemaining,
                  fabricRemaining,
                  fabricActualBadge,
                  sampleRemaining,
                  sampleActualBadge,
                  canAddDHLTracking,
                } = calculateTnaValues(row);

                const serial = (page - 1) * pageSize + index + 1;

                return (
                  <TableRow
                    key={row.id}
                    className="animate__animated animate__fadeInUp"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <TableCell>{serial}</TableCell>
                    <TableCell className="text-nowrap sticky left-0 bg-background z-20 uppercase">
                      {row.style || ""}
                    </TableCell>
                    {/* <TableCell>{row.itemName || ""}</TableCell> */}
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
                        <span className="text-xs text-muted-foreground">
                          No image
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="capitalize">{row.merchandiser || ""}</TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className=" -ml-4 capitalize"
                        onClick={() => showBuyerModal(row.buyerName || "")}
                      >
                        {row.buyerName || ""}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {row.sampleSendingDate
                        ? new Date(row.sampleSendingDate).toLocaleDateString(
                            undefined,
                            { timeZone: "UTC" }
                          )
                        : ""}
                    </TableCell>
                    <TableCell className="text-left">
                      {leadTimeRemaining !== null ? (
                        <Button
                          variant="link"
                          className="p-0 m-0  justify-start text-left"
                          onClick={() => setLeadTimeModal({ open: true, row })}
                        >
                          {/* If DHL tracking is complete, show blue badge, else normal */}
                          {row.dhlTracking?.isComplete ? (
                            <span className="bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded inline-block  text-left">
                              {leadTimeRemaining > 0
                                ? `+${leadTimeRemaining} days`
                                : leadTimeRemaining === 0
                                ? "0 days"
                                : `-${Math.abs(leadTimeRemaining)} days`}
                            </span>
                          ) : (
                            <span className="inline-block  text-left">
                              {getStatusBadge(leadTimeRemaining)}
                            </span>
                          )}
                        </Button>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell>{row.sampleType || ""}</TableCell>
                    <TableCell>
                      {row.cad ? (
                        <Button
                          variant="link"
                          className="-ml-4"
                          onClick={() => openCadModal(row.cad)}
                        >
                          {cadActualBadge
                            ? cadActualBadge
                            : getStatusBadge(cadRemaining)}
                        </Button>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell>
                      {row.fabricBooking ? (
                        <Button
                          variant="link"
                          className="-ml-4"
                          onClick={() => openFabricModal(row.fabricBooking)}
                        >
                          {fabricActualBadge
                            ? fabricActualBadge
                            : getStatusBadge(fabricRemaining)}
                        </Button>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell>
                      {row.sampleDevelopment ? (
                        <Button
                          variant="link"
                          className="-ml-4"
                          onClick={() => openSampleModal(row.sampleDevelopment)}
                        >
                          {sampleActualBadge
                            ? sampleActualBadge
                            : getStatusBadge(sampleRemaining)}
                        </Button>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell>
                      {row.dhlTracking ? (
                        <div>
                          {/* <div>
                    <span className="font-semibold">No:</span> {row.dhlTracking.trackingNumber}
                  </div>
                  <div>
                    <span className="font-semibold">Date:</span> {row.dhlTracking.date ? new Date(row.dhlTracking.date).toLocaleDateString() : ""}
                  </div> */}
                          <div className=" text-nowrap justify-center flex ">
                            <span className="font-semibold text-green-700  bg-green-100 rounded px-2 py-0.5">
                              {" "}
                              {row.dhlTracking.isComplete
                                ? `${row.dhlTracking.trackingNumber}`
                                : "Not Completed"}
                            </span>
                            <p>
                              {/* {row.dhlTracking.date
                        ? new Date(row.dhlTracking.date).toLocaleDateString(undefined, { timeZone: "UTC" })
                        : ""} */}
                            </p>
                          </div>
                        </div>
                      ) : (
                        !readOnlyModals && (
                          <Button
                            size="sm"
                            className=" bg-green-700 text-white"
                            variant="outline"
                            onClick={() =>
                              setDhlModal({
                                open: true,
                                style: row.style,
                                tnaId: row.id,
                              })
                            }
                            disabled={!canAddDHLTracking}
                            title={
                              canAddDHLTracking
                                ? "Add DHL Tracking"
                                : "Complete CAD, Fabric, and Sample first"
                            }
                          >
                            Add DHL Tracking
                          </Button>
                        )
                      )}
                    </TableCell>
                    <TableCell>
                      {isAdmin && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            setDeleteModal({
                              open: true,
                              tnaId: row.id,
                              style: row.style,
                            })
                          }
                          disabled={isDeleting}
                        >
                          <Trash className="h-4 w-4" />
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
        <div className="flex justify-end items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Prev
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
        {/* Buyer Modal */}
        <BuyerModal
          visible={isBuyerModalVisible}
          onClose={handleBuyerModalClose}
          buyerInfo={buyerInfo}
        />
        {/* Days Left Modal */}
        <LeadTimeModal
          open={leadTimeModal.open}
          onOpenChange={(open) =>
            setLeadTimeModal({ open, row: open ? leadTimeModal.row : null })
          }
          row={leadTimeModal.row}
        />
        {/* CAD Modal */}
        <CadModal
          open={cadModal.open}
          onOpenChange={(open) =>
            setCadModal({ open, cad: open ? cadModal.cad : null })
          }
          cad={cadModal.cad}
          finalFileReceivedDate={finalFileReceivedDate}
          setFinalFileReceivedDate={setFinalFileReceivedDate}
          finalCompleteDate={finalCompleteDate}
          setFinalCompleteDate={setFinalCompleteDate}
          onUpdate={handleUpdateCad}
          isUpdating={isUpdating}
          readOnly={readOnlyModals}
        />
        {/* Fabric Modal */}
        <FabricModal
          open={fabricModal.open}
          onOpenChange={(open) =>
            setFabricModal({ open, fabric: open ? fabricModal.fabric : null })
          }
          fabric={fabricModal.fabric}
          actualBookingDate={actualBookingDate}
          setActualBookingDate={setActualBookingDate}
          actualReceiveDate={actualReceiveDate}
          setActualReceiveDate={setActualReceiveDate}
          onUpdate={handleUpdateFabric}
          isUpdating={isFabricUpdating}
          readOnly={readOnlyModals}
        />
        {/* Sample Development Modal */}
        <SampleModal
          open={sampleModal.open}
          onOpenChange={(open) =>
            setSampleModal({ open, sample: open ? sampleModal.sample : null })
          }
          sample={sampleModal.sample}
          actualSampleReceiveDate={actualSampleReceiveDate}
          setActualSampleReceiveDate={setActualSampleReceiveDate}
          actualSampleCompleteDate={actualSampleCompleteDate}
          setActualSampleCompleteDate={setActualSampleCompleteDate}
          onUpdate={handleUpdateSample}
          isUpdating={isSampleUpdating}
          readOnly={readOnlyModals}
        />
        {/* DHL Tracking Modal */}
        <Dialog
          open={dhlModal.open}
          onOpenChange={(open) =>
            setDhlModal(
              open ? dhlModal : { open: false, style: null, tnaId: null }
            )
          }
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add DHL Tracking</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Input
                type="text"
                placeholder="Tracking Number"
                value={
                  dhlTrackingInputs[dhlModal.style || ""]?.trackingNumber || ""
                }
                onChange={(e) =>
                  handleDHLInputChange("trackingNumber", e.target.value)
                }
              />
              <CustomDateInput
                label=""
                value={dhlTrackingInputs[dhlModal.style || ""]?.date || ""}
                onChange={(e) => handleDHLInputChange("date", e.target.value)}
              />
              <Button
                size="sm"
                onClick={handleCreateDHLTracking}
                disabled={
                  !dhlTrackingInputs[dhlModal.style || ""]?.trackingNumber ||
                  !dhlTrackingInputs[dhlModal.style || ""]?.date ||
                  isCreatingDHL
                }
              >
                {isCreatingDHL ? "Saving..." : "Complete"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Delete Confirmation Modal */}
        <Dialog
          open={deleteModal.open}
          onOpenChange={(open) =>
            setDeleteModal(
              open ? deleteModal : { open: false, tnaId: null, style: null }
            )
          }
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <p>
                Are you sure you want to delete the TNA record for style{" "}
                <strong>{deleteModal.style}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setDeleteModal({ open: false, tnaId: null, style: null })
                  }
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteTNA}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SampleTnaTable;
