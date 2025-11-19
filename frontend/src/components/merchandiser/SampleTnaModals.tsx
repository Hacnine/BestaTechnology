import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppSelector, selectCurrentUser } from "@/redux/slices/userSlice";

// Buyer Modal
export const BuyerModal = ({ open, onClose, buyerInfo }: any) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Buyer Info</DialogTitle>
      </DialogHeader>
      <div>{buyerInfo}</div>
      <Button onClick={onClose}>OK</Button>
    </DialogContent>
  </Dialog>
);

// Lead Time Modal
export const LeadTimeModal = ({ open, onOpenChange, row }: any) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Lead Time Details</DialogTitle>
      </DialogHeader>
      {row && (
        <div className="space-y-2">
          <div>
            <strong>Order Date:</strong>{" "}
            {row.orderDate ? new Date(row.orderDate).toLocaleDateString() : ""}
          </div>
          <div>
            <strong>Sending Date:</strong>{" "}
            {row.sampleSendingDate ? new Date(row.sampleSendingDate).toLocaleDateString() : ""}
          </div>
          <div>
            <strong>Complete Date:</strong>{" "} 
            {row.dhlTracking.date ? new Date(row.dhlTracking.date).toLocaleDateString() : ""}
          </div>
          <div>
            <strong>Calculated Lead Time:</strong>{" "}
            {row.sampleSendingDate && row.orderDate
              ? Math.round(
                  (new Date(row.sampleSendingDate).getTime() -
                    new Date(row.orderDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              : ""}{" "}
            days
          </div>
          <div>
          </div>
        </div>
      )}
      <Button onClick={() => onOpenChange(false)}>Close</Button>
    </DialogContent>
  </Dialog>
);

// CAD, Fabric, and Sample modals
export const CadModal = ({
  open,
  onOpenChange,
  cad,
  finalFileReceivedDate,
  setFinalFileReceivedDate,
  finalCompleteDate,
  setFinalCompleteDate,
  onUpdate,
  isUpdating,
  readOnly = false,
}: any) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>CAD Details</DialogTitle>
        </DialogHeader>
        {cad && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>CAD Master Name:</strong> {cad.CadMasterName}
            </div>
            <div>
              <strong>File Receive Date:</strong>{" "}
              {cad.fileReceiveDate ? new Date(cad.fileReceiveDate).toLocaleDateString() : ""}
            </div>
            <div>
              <strong>Complete Date:</strong>{" "}
              {cad.completeDate ? new Date(cad.completeDate).toLocaleDateString() : ""}
            </div>
            <div className="flex items-center">
              <strong>Actual Complete Date:</strong>
              {isAdmin && (
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-full"
                  value={finalCompleteDate}
                  onChange={e => setFinalCompleteDate(e.target.value)}
                  readOnly={readOnly}
                />
              )}
              {cad.finalCompleteDate && (
                <span>
                 {new Date(cad.finalCompleteDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="col-span-full border-t pt-4 mt-4 flex justify-end gap-2">
              <Button onClick={() => onOpenChange(false)}>Close</Button>
              {isAdmin && !readOnly && (
                <Button onClick={onUpdate} disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const FabricModal = ({
  open,
  onOpenChange,
  fabric,
  actualBookingDate,
  setActualBookingDate,
  actualReceiveDate,
  setActualReceiveDate,
  onUpdate,
  isUpdating,
  readOnly = false,
}: any) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fabric Booking Details</DialogTitle>
        </DialogHeader>
        {fabric && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Receiver Store:</strong>{" "}
              <p>{fabric.createdBy ? fabric.createdBy.userName : ""}</p>
            </div>
            <div>
              <strong>Receive Date:</strong>{" "}
              <p>{fabric.receiveDate ? new Date(fabric.receiveDate).toLocaleDateString() : ""}</p>
            </div>
            <div>
              <strong>Target Complete Date:</strong>{" "}
              {fabric.completeDate ? new Date(fabric.completeDate).toLocaleDateString() : ""}
            </div>
            <div>
              <strong className="">Actual Complete Date</strong>
              {isAdmin && (
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-full"
                  value={actualBookingDate}
                  onChange={e => setActualBookingDate(e.target.value)}
                  readOnly={readOnly}
                />
              )}
              {fabric.actualCompleteDate && (
                <div className=" mt-1">
                   {new Date(fabric.actualCompleteDate).toLocaleDateString()}
                </div>
              )}
            </div>
            
            <div className="col-span-full border-t pt-4 mt-4 flex justify-end gap-2">
              <Button onClick={() => onOpenChange(false)}>Close</Button>
              {isAdmin && !readOnly && (
                <Button onClick={onUpdate} disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const SampleModal = ({
  open,
  onOpenChange,
  sample,
  actualSampleReceiveDate,
  setActualSampleReceiveDate,
  actualSampleCompleteDate,
  setActualSampleCompleteDate,
  onUpdate,
  isUpdating,
  readOnly = false,
}: any) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sample Development Details</DialogTitle>
        </DialogHeader>
        {sample && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Sampleman Name:</strong> {sample.samplemanName}
            </div>
            <div>
              <strong>Sample Receive Date:</strong>{" "}
              {sample.sampleReceiveDate ? new Date(sample.sampleReceiveDate).toLocaleDateString() : ""}
            </div>
            <div>
              <strong>Sample Complete Date:</strong>{" "}
              {sample.sampleCompleteDate ? new Date(sample.sampleCompleteDate).toLocaleDateString() : ""}
            </div>
            <div>
              <strong>Sample Quantity:</strong> {sample.sampleQuantity}
            </div>
            <div>
              <label className="font-bold">Actual Sample Complete Date</label>
              {isAdmin && (
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-full"
                  value={actualSampleCompleteDate}
                  onChange={e => setActualSampleCompleteDate(e.target.value)}
                  readOnly={readOnly}
                />
              )}
              {sample.actualSampleCompleteDate && (
                <div className=" mt-1">
                   {new Date(sample.actualSampleCompleteDate).toLocaleDateString()}
                </div>
              )}
            </div>
            <div className="col-span-full border-t pt-4 mt-4 flex justify-end gap-2">
              <Button onClick={() => onOpenChange(false)}>Close</Button>
              {isAdmin && !readOnly && (
                <Button onClick={onUpdate} disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
