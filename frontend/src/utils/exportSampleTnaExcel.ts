import * as XLSX from "xlsx";

// Accept tnaSummary as argument
export function exportSampleTnaExcel(tnaSummary: any[]) {
  // Build header row (add Days Left, CAD, Fabric, Sample)
  const header = [
    "Item Name",
    "Style",
    "Merchandiser",
    "Buyer",
    "Sample Sending Date",
    "Sample Type",
    "Days Left",
    "CAD",
    "Fabric",
    "Sample",
    "DHL Tracking",
    "DHL Date",
    "DHL Status",
  ];
  const aoa = [header];

  (tnaSummary || []).forEach((row: any) => {
    // --- Days Left ---
    let leadTimeRemaining = null;
    if (row.sampleSendingDate) {
      const sampleSendDate = new Date(row.sampleSendingDate);
      let referenceDate = new Date();
      if (row.dhlTracking && row.dhlTracking.date) {
        referenceDate = new Date(row.dhlTracking.date);
      }
      const sampleSendDateUTC = Date.UTC(
        sampleSendDate.getUTCFullYear(),
        sampleSendDate.getUTCMonth(),
        sampleSendDate.getUTCDate()
      );
      const referenceDateUTC = Date.UTC(
        referenceDate.getUTCFullYear(),
        referenceDate.getUTCMonth(),
        referenceDate.getUTCDate()
      );
      leadTimeRemaining = Math.ceil(
        (sampleSendDateUTC - referenceDateUTC) / (1000 * 60 * 60 * 24)
      );
    }
    let daysLeftText = "";
    if (leadTimeRemaining !== null) {
      if (row.dhlTracking?.isComplete) {
        daysLeftText =
          leadTimeRemaining > 0
            ? `+${leadTimeRemaining} days`
            : leadTimeRemaining === 0
            ? "0 days"
            : `-${Math.abs(leadTimeRemaining)} days`;
      } else {
        daysLeftText =
          leadTimeRemaining > 0
            ? `+${leadTimeRemaining} days`
            : leadTimeRemaining === 0
            ? "0 days"
            : `-${Math.abs(leadTimeRemaining)} days`;
      }
    }

    // --- CAD ---
    let cadBadge = "";
    if (row.cad && row.cad.completeDate) {
      if (row.cad.finalCompleteDate) {
        const planned = new Date(row.cad.completeDate);
        const actual = new Date(row.cad.finalCompleteDate);
        const diffDays = Math.round(
          (planned.getTime() - actual.getTime()) / (1000 * 60 * 60 * 24)
        );
        cadBadge =
          diffDays < 0
            ? `-${diffDays} days`
            : diffDays > 0
            ? `+${Math.abs(diffDays)} days`
            : "0 day";
      } else {
        const completeDate = new Date(row.cad.completeDate);
        const today = new Date();
        const cadRemaining = Math.round(
          (completeDate.getTime() - today.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
        );
        cadBadge =
          cadRemaining > 0
            ? `+${cadRemaining} days`
            : cadRemaining === 0
            ? "0 days"
            : `-${Math.abs(cadRemaining)} days`;
      }
    }

    // --- Fabric ---
    let fabricBadge = "";
    if (row.fabricBooking && row.fabricBooking.receiveDate) {
      if (row.fabricBooking.actualReceiveDate) {
        const planned = new Date(row.fabricBooking.receiveDate);
        const actual = new Date(row.fabricBooking.actualReceiveDate);
        const diffDays = Math.round(
          (planned.getTime() - actual.getTime()) / (1000 * 60 * 60 * 24)
        );
        fabricBadge =
          diffDays < 0
            ? `-${Math.abs(diffDays)} days`
            : diffDays > 0
            ? `+${Math.abs(diffDays)} days`
            : "0 day";
      } else {
        const receiveDate = new Date(row.fabricBooking.receiveDate);
        const today = new Date();
        const fabricRemaining = Math.round(
          (receiveDate.getTime() - today.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
        );
        fabricBadge =
          fabricRemaining > 0
            ? `+${fabricRemaining} days`
            : fabricRemaining === 0
            ? "0 days"
            : `-${Math.abs(fabricRemaining)} days`;
      }
    }

    // --- Sample ---
    let sampleBadge = "";
    if (row.sampleDevelopment && row.sampleDevelopment.sampleCompleteDate) {
      if (row.sampleDevelopment.actualSampleCompleteDate) {
        const planned = new Date(row.sampleDevelopment.sampleCompleteDate);
        const actual = new Date(row.sampleDevelopment.actualSampleCompleteDate);
        const diffDays = Math.round(
          (planned.getTime() - actual.getTime()) / (1000 * 60 * 60 * 24)
        );
        sampleBadge =
          diffDays < 0
            ? `-${Math.abs(diffDays)} days`
            : diffDays > 0
            ? `+${Math.abs(diffDays)} days`
            : "0 day";
      } else {
        const completeDate = new Date(row.sampleDevelopment.sampleCompleteDate);
        const today = new Date();
        const sampleRemaining = Math.round(
          (completeDate.getTime() - today.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
        );
        sampleBadge =
          sampleRemaining > 0
            ? `+${sampleRemaining} days`
            : sampleRemaining === 0
            ? "0 days"
            : `-${Math.abs(sampleRemaining)} days`;
      }
    }

    // --- DHL Status ---
    const dhlStatus = row.dhlTracking?.isComplete ? "Completed" : "Not Completed";

    aoa.push([
      row.itemName || "",
      row.style || "",
      row.merchandiser || "",
      row.buyerName || "",
      row.sampleSendingDate ? new Date(row.sampleSendingDate).toLocaleDateString() : "",
      row.sampleType || "",
      daysLeftText,
      cadBadge,
      fabricBadge,
      sampleBadge,
      row.dhlTracking?.trackingNumber || "",
      row.dhlTracking?.date ? new Date(row.dhlTracking.date).toLocaleDateString() : "",
      dhlStatus,
    ]);
  });

  // Create worksheet and workbook
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "SampleTNA");
  XLSX.writeFile(workbook, "SampleTNA.xlsx");
}