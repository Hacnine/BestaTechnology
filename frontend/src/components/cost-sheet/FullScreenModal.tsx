import React from "react";
import { CircleX, Printer } from "lucide-react";
import { Button } from "../ui/button";

interface FullScreenModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isEditMode?: boolean;
  isUpdating?: boolean;
  onSave?: () => void;
}

const FullScreenModal = ({
  open,
  onClose,
  children,
  isEditMode = false,
  isUpdating = false,
  onSave,
}: FullScreenModalProps) => {
  const handlePrint = () => {
    const printArea = document.getElementById("costsheet-print-area");
    if (!printArea) return;

    // Get all stylesheets from the document
    let styles = "";
    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        if (sheet.cssRules) {
          Array.from(sheet.cssRules).forEach((rule) => {
            styles += rule.cssText;
          });
        }
      } catch (e) {
        // Ignore CORS errors for external stylesheets
      }
    });

    // Print-specific styles for Excel-like table
    styles += `
      @media print {
        body { background: white !important; }
        .print-hide { display: none !important; }
        .print\\:overflow-visible { overflow: visible !important; }
        .print\\:p-0 { padding: 0 !important; }
        .bg-black.bg-opacity-70 { background: none !important; }
        .shadow-lg, .rounded-lg { box-shadow: none !important; border-radius: 0 !important; }
        .w-\\[90vw\\],.h-\\[90vh\\] { width: 100vw !important; height: auto !important; }
        .p-8 { padding: 0 !important; }
        /* Excel-like table styles */
        table { border-collapse: collapse !important; width: 100% !important; font-size: 12px !important; }
        th, td { border: 1px solid #222 !important; padding: 2px 6px !important; text-align: left !important; background: white !important; }
        th { background: #eaeaea !important; font-weight: bold !important; }
        tr { background: white !important; }
        .bg-muted\\/10, .bg-muted\\/20, .bg-muted\\/30 { background: white !important; }
        .text-primary { color: #000 !important; }
        .font-semibold { font-weight: bold !important; }
        .text-lg, .text-sm { font-size: 12px !important; }
        .border-b { border-bottom: 1px solid #222 !important; }
        .border-t-2 { border-top: 2px solid #222 !important; }
        .separator { border-top: 1px solid #222 !important; }
        /* Remove card styles */
        .card, .Card { box-shadow: none !important; border: none !important; background: none !important; }
        input, .border-none {
          border: none !important;
          box-shadow: none !important;
        }
        .print-header { display: flex; justify-content: space-between; align-items: center; }
        .company-logo { display: flex; align-items: center; gap: 12px; }
        .company-logo img { width: 100px; height: auto; }
        .company-logo h1 { font-size: 20px; font-weight: bold; }
        .print-footer { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); font-size: 12px; text-align: center; }
        .print-note { text-align: center; margin-top:30px;}
      }
    `;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    // Create print header with company logo
    const printHeader = `
      <div class="print-header">
        <div class="company-logo">
          <img src="/images/logo.webp" alt="Besta Apparels Logo" />
           <h1>Besta Apparels</h1>
        </div>
        <div class="company-info">
 
          <p>Cost Sheet Report - ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Cost Sheet</title>
          <style>${styles}</style>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/dist/tailwind.min.css">
        </head>
        <body>
          ${printHeader}
          <div>
            ${printArea.innerHTML}
            <p class="print-note">* This is system generated Buyer Cost Sheet - Validity for 15 days.</p>

          </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      style={{ animation: "fadeIn 0.2s" }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className="bg-white rounded-lg shadow-lg w-[95vw] h-[90vh] overflow-y-auto pt-12 p-4 relative flex flex-col"
          id="costsheet-modal-content"
        >
          <div className="absolute top-1 right-1 flex gap-2 print-hide">
            {isEditMode && onSave && (
              <Button
                variant="default"
                size="sm"
                disabled={isUpdating}
                onClick={onSave}
                className="bg-green-600 text-white hover:bg-green-700 print:hidden"
              >
                Save
              </Button>
            )}
            {!isEditMode && (
              <Button
              variant="default"
              size="sm"
              onClick={handlePrint}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Printer className="size-4" />
            </Button>
            )}
            
            <Button
              variant="default"
              size="sm"
              onClick={onClose}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              <CircleX className="size-4" />
            </Button>
          </div>
          <div
            className="flex-1 overflow-y-auto print:overflow-visible print:p-0"
            id="costsheet-print-area"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenModal;
