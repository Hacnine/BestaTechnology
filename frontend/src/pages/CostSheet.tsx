import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import CostSheetForm from "@/components/cost-sheet/CostSheetForm";
import CostSheetTable from "@/components/cost-sheet/CostSheetTable";
import { PageHeader } from "@/components/ui/page-header";

const CostSheet = () => {
  const [openCostSheet, setOpenCostSheet] = useState(false);
  const [initialCreateData, setInitialCreateData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <PageHeader
              title="Cost Sheet Management"
              description=" Create and manage detailed cost sheets for your apparel
                manufacturing"
            />
            <Button
              onClick={() => setOpenCostSheet(!openCostSheet)}
              className="text-sm "
            >
              <Plus className="h-4 w-4 mr-2" />
              {openCostSheet === true
                ? "Close Cost Sheet"
                : "Create Cost Sheet"}
            </Button>
          </div>

          {/* Cost Sheet Form */}
          {openCostSheet && (
            <Card className="p-4 w-full ">
              <CostSheetForm
                mode={initialCreateData ? "copy" : "create"}
                onClose={() => {
                  setOpenCostSheet(false);
                  setInitialCreateData(null);
                }}
                initialData={initialCreateData}
              />
            </Card>
          )}

          {/* Placeholder for Cost Sheet Table/List */}
          <CostSheetTable
            onCopy={(sheet: any) => {
              // Prepare initial data for the create form — copy everything except style
              const initial = {
                style: "",
                item: sheet.item,
                group: sheet.group,
                size: sheet.size,
                fabricType: sheet.fabricType,
                gsm: sheet.gsm,
                color: sheet.color,
                qty:
                  sheet.quantity !== undefined && sheet.quantity !== null
                    ? String(sheet.quantity)
                    : "",
                buyer: sheet.buyer,
                brand: sheet.brand,
                image: sheet.image || undefined,
                // Use backend shapes if available (json preferred)
                cadConsumption: sheet.cadRows?.json ||
                  sheet.cadRows || { rows: sheet.cadRows?.rows || [] },
                fabricCost: sheet.fabricRows?.json || sheet.fabricRows || {},
                trimsAccessories: (() => {
                  const t = sheet.trimsRows;
                  if (!t) return { rows: [], json: {} };
                  if (t.json) return { rows: t.rows || [], json: t.json };
                  if (Array.isArray(t)) return { rows: t, json: {} };
                  if (t.rows) return { rows: t.rows, json: t };
                  return { rows: [], json: t };
                })(),
                summary:
                  sheet.summaryRows?.json ||
                  sheet.summaryRows?.summary ||
                  sheet.summaryRows ||
                  {},
                others: (() => {
                  const o = sheet.othersRows;
                  if (!o) return { rows: [], json: {} };
                  if (o.json) return { rows: o.rows || [], json: o.json };
                  if (Array.isArray(o)) return { rows: o, json: {} };
                  if (o.rows) return { rows: o.rows, json: o };
                  return { rows: [], json: o };
                })(),
                styleRows: sheet.styleRows || sheet.styleJson || {},
              };
              setInitialCreateData(initial);
              setOpenCostSheet(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CostSheet;
