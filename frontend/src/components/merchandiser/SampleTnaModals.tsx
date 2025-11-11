import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
            <strong>Lead Time:</strong>{" "}
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
            <strong>
              {row.sampleSendingDate
                ? (() => {
                    const today = new Date();
                    const sampleSendDate = new Date(row.sampleSendingDate);
                    const remaining = Math.round(
                      (sampleSendDate.getTime() - today.setHours(0, 0, 0, 0)) /
                        (1000 * 60 * 60 * 24)
                    );
                    return remaining >= 0
                      ? `${remaining} days remaining`
                      : `${Math.abs(remaining)} days overdue`;
                  })()
                : ""}
            </strong>
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
}: any) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>CAD Details</DialogTitle>
      </DialogHeader>
      {cad && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Style:</strong> {cad.style}
          </div>
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
          <div>
            <label className="block text-sm font-medium">Actual File Received Date</label>
            <input
              type="date"
              className="border rounded px-2 py-1 w-full"
              value={finalFileReceivedDate}
              onChange={e => setFinalFileReceivedDate(e.target.value)}
              readOnly={readOnly}
            />
            {cad.finalFileReceivedDate && (
              <div className="text-xs text-muted-foreground mt-1">
                Current: {new Date(cad.finalFileReceivedDate).toLocaleDateString()}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Actual Complete Date</label>
            <input
              type="date"
              className="border rounded px-2 py-1 w-full"
              value={finalCompleteDate}
              onChange={e => setFinalCompleteDate(e.target.value)}
              readOnly={readOnly}
            />
            {cad.finalCompleteDate && (
              <div className="text-xs text-muted-foreground mt-1">
                Current: {new Date(cad.finalCompleteDate).toLocaleDateString()}
              </div>
            )}
          </div>
          <div className="col-span-2 flex justify-end">
            {readOnly ? (
              <Button onClick={() => onOpenChange(false)}>Close</Button>
            ) : (
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
}: any) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Fabric Booking Details</DialogTitle>
      </DialogHeader>
      {fabric && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Style:</strong> {fabric.style}
          </div>
          <div>
            <strong>Days Between:</strong>{" "}
            {fabric.bookingDate && fabric.receiveDate
              ? Math.round(
                  (new Date(fabric.receiveDate).getTime() -
                    new Date(fabric.bookingDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              : ""}
          </div>
          <div>
            <strong>Booking Date:</strong>{" "}
            {fabric.bookingDate ? new Date(fabric.bookingDate).toLocaleDateString() : ""}
          </div>
          <div>
            <strong>Receive Date:</strong>{" "}
            {fabric.receiveDate ? new Date(fabric.receiveDate).toLocaleDateString() : ""}
          </div>
          <div>
            <label className="block text-sm font-medium">Actual Booking Date</label>
            <input
              type="date"
              className="border rounded px-2 py-1 w-full"
              value={actualBookingDate}
              onChange={e => setActualBookingDate(e.target.value)}
              readOnly={readOnly}
            />
            {fabric.actualBookingDate && (
              <div className="text-xs text-muted-foreground mt-1">
                Current: {new Date(fabric.actualBookingDate).toLocaleDateString()}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Actual Receive Date</label>
            <input
              type="date"
              className="border rounded px-2 py-1 w-full"
              value={actualReceiveDate}
              onChange={e => setActualReceiveDate(e.target.value)}
              readOnly={readOnly}
            />
            {fabric.actualReceiveDate && (
              <div className="text-xs text-muted-foreground mt-1">
                Current: {new Date(fabric.actualReceiveDate).toLocaleDateString()}
              </div>
            )}
          </div>
          <div className="col-span-2 flex justify-end">
            {readOnly ? (
              <Button onClick={() => onOpenChange(false)}>Close</Button>
            ) : (
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
}: any) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Sample Development Details</DialogTitle>
      </DialogHeader>
      {sample && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Style:</strong> {sample.style}
          </div>
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
            <strong>Days Between:</strong>{" "}
            {sample.sampleReceiveDate && sample.sampleCompleteDate
              ? Math.round(
                  (new Date(sample.sampleCompleteDate).getTime() -
                    new Date(sample.sampleReceiveDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              : ""}
          </div>
          <div>
            <label className="block text-sm font-medium">Actual Sample Receive Date</label>
            <input
              type="date"
              className="border rounded px-2 py-1 w-full"
              value={actualSampleReceiveDate}
              onChange={e => setActualSampleReceiveDate(e.target.value)}
              readOnly={readOnly}
            />
            {sample.actualSampleReceiveDate && (
              <div className="text-xs text-muted-foreground mt-1">
                Current: {new Date(sample.actualSampleReceiveDate).toLocaleDateString()}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Actual Sample Complete Date</label>
            <input
              type="date"
              className="border rounded px-2 py-1 w-full"
              value={actualSampleCompleteDate}
              onChange={e => setActualSampleCompleteDate(e.target.value)}
              readOnly={readOnly}
            />
            {sample.actualSampleCompleteDate && (
              <div className="text-xs text-muted-foreground mt-1">
                Current: {new Date(sample.actualSampleCompleteDate).toLocaleDateString()}
              </div>
            )}
          </div>
          <div className="col-span-2 flex justify-end">
            {readOnly ? (
              <Button onClick={() => onOpenChange(false)}>Close</Button>
            ) : (
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
