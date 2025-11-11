import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import StyleInfoForm from "./StyleInfoForm";
import CadConsumptionSection from "./CadConsumptionSection";
import FabricCostSection from "./FabricCostSection";
import TrimsAccessoriesSection from "./TrimsAccessoriesSection";
import SummarySection from "./SummarySection";
import OthersSection from "./OthersSection";
import {
  useCreateCostSheetMutation,
  useCheckStyleQuery,
} from "@/redux/api/costSheetApi";

interface CostSheetFormProps {
  onClose: () => void;
  initialData?: Partial<any> | null;
  mode?: "create" | "edit" | "copy";
}

export interface CostSheetData {
  style: string;
  name?: string;
  item: string;
  group: string;
  size: string;
  fabricType: string;
  gsm: string;
  color: string;
  qty: string; // will be sent as quantity (Int) to backend
  buyer?: string;
  brand?: string;
  image?: File | string;
  cadConsumption: any;
  fabricCost: any;
  trimsAccessories: any;
  summary: any;
  others: any;
  styleRows?: any;
}

const CostSheetForm = ({ onClose, initialData = null, mode = "create" }: CostSheetFormProps) => {
  const [createCostSheet, { isLoading: isSaving }] =
    useCreateCostSheetMutation();

  // Unified state for each section
  const [cadData, setCadDataRaw] = useState<{ rows: any[]; json: any }>({
    rows: [],
    json: {},
  });
  const [fabricData, setFabricDataRaw] = useState<{ rows?: any[]; json?: any }>(
    { rows: [], json: {} }
  );
  const [trimsData, setTrimsDataRaw] = useState<{ rows: any[]; json: any; selectedJson?: any }>(
    {
      rows: [],
      json: {},
      selectedJson: undefined,
    }
  );
  const [othersData, setOthersDataRaw] = useState<{ rows: any[]; json?: any }>({
    rows: [],
    json: {},
  });
  const [summaryData, setSummaryData] = useState<{ summary: any; json: any }>({
    summary: {},
    json: {},
  });

  const form = useForm<CostSheetData>({
    defaultValues: {
      style: "",
      name: "",
      item: "",
      group: "",
      size: "",
      fabricType: "",
      gsm: "",
      color: "",
      qty: "",
    },
  });

  // If initialData is provided (copy action), populate section states and reset form
  useEffect(() => {
    if (!initialData) return;

    try {
      // Cad
      if (initialData.cadConsumption) {
        const cad = initialData.cadConsumption;
        if (cad.json) {
          setCadDataRaw({ rows: cad.rows || [], json: cad.json });
        } else if (cad.rows) {
          setCadDataRaw({ rows: cad.rows, json: cad });
        } else {
          setCadDataRaw({ rows: [], json: cad });
        }
      }

      // Fabric
      if (initialData.fabricCost) {
        setFabricDataRaw(initialData.fabricCost);
      }

      // Trims
      if (initialData.trimsAccessories) {
        const trims = initialData.trimsAccessories;
        if (trims.json) {
          setTrimsDataRaw({ rows: trims.rows || [], json: trims.json });
        } else if (trims.rows) {
          setTrimsDataRaw({ rows: trims.rows, json: trims });
        } else {
          setTrimsDataRaw({ rows: [], json: trims });
        }
      }

      // Others
      if (initialData.others) {
        const others = initialData.others;
        if (others.json) {
          setOthersDataRaw({ rows: others.rows || [], json: others.json });
        } else if (others.rows) {
          setOthersDataRaw({ rows: others.rows, json: others });
        } else {
          setOthersDataRaw({ rows: [], json: others });
        }
      }

      // Summary
      if (initialData.summary) {
        const s = initialData.summary;
        if (s.json) {
          setSummaryData({ summary: s.summary || {}, json: s.json });
        } else if (s.summary) {
          setSummaryData({ summary: s.summary, json: s });
        } else {
          setSummaryData({ summary: s || {}, json: s || {} });
        }
      }

      // Reset form values but keep style empty by requirement
      form.reset({
        style: "",
        name: initialData.name || "",
        item: initialData.item || "",
        group: initialData.group || "",
        size: initialData.size || "",
        fabricType: initialData.fabricType || "",
        gsm: initialData.gsm || "",
        color: initialData.color || "",
        qty: initialData.qty || "",
        buyer: initialData.buyer || undefined,
        brand: initialData.brand || undefined,
        image: initialData.image || undefined,
        // also restore styleRows if provided
        styleRows: initialData.styleRows || initialData.styleJson || undefined,
      });
    } catch (err) {
      // swallow errors — not critical
      // console.error("Failed to apply initialData", err);
    }
  }, [initialData]);

  // Watch style field and check style existence
  const styleValue = form.watch("style");
  const stylePattern = /^[A-Za-z0-9-]+$/;
  const { data: styleCheckData, isFetching: isStyleChecking } =
    useCheckStyleQuery(styleValue, {
      skip: !styleValue || !stylePattern.test(styleValue),
      refetchOnMountOrArgChange: true,
    });

  const calculateSummary = () => {
    // Use totalFabricCost from fabricData.json
    const fabricCost = fabricData.json?.totalFabricCost || 0;
    // Use correct accessories cost from trimsData.json
    const accessoriesCost =
      trimsData.json?.totalAccessoriesCost !== undefined
        ? Number(trimsData.json.totalAccessoriesCost)
        : trimsData.rows.reduce(
            (sum, item) => sum + (parseFloat(item.cost) || 0),
            0
          );
    // Use Others cost from othersData.json
    const othersCost =
      othersData.json?.total !== undefined ? Number(othersData.json.total) : 0;

    const factoryCM = 14.0;
    const totalCost = fabricCost + accessoriesCost + factoryCM + othersCost;
    const profitPercentage = 0.15;
    const commercialProfit = totalCost * profitPercentage;
    const fobPrice = totalCost + commercialProfit;
    const pricePerPiece = fobPrice / 12;

    return {
      fabricCost,
      accessoriesCost,
      factoryCM,
      othersCost,
      totalCost,
      commercialProfit,
      fobPrice,
      pricePerPiece,
      profitPercentage,
    };
  };

  const handleSave = async () => {
    const formData = form.getValues();

    // No need to convert image to base64 - send File object directly

    // Use summary data from SummarySection if available, otherwise calculate
    let summaryJsonToSend;

    if (summaryData.json && Object.keys(summaryData.json).length > 0) {
      // Use data from SummarySection component
      summaryJsonToSend = summaryData.json;
    } else {
      // Fallback to calculated summary
      const calculatedSummary = calculateSummary();
      summaryJsonToSend = {
        tableName: "Summary",
        fabricCost: calculatedSummary.fabricCost,
        accessoriesCost: calculatedSummary.accessoriesCost,
        factoryCM: calculatedSummary.factoryCM,
        othersTotal: calculatedSummary.othersCost,
        totalCost: calculatedSummary.totalCost,
        commercialPercent: 15,
        commercialCost: calculatedSummary.fabricCost + calculatedSummary.accessoriesCost + calculatedSummary.factoryCM + calculatedSummary.othersCost * 0.15,
        profitPercent: 0,
        profitCost: 0,
        fobPrice: calculatedSummary.fobPrice,
        pricePerPiece: calculatedSummary.pricePerPiece,
      };
    }

    // Helper to strip `id` fields from rows before create when copying
    const stripIdsFromRows = (obj: any) => {
      if (!obj) return obj;
      const cloned = JSON.parse(JSON.stringify(obj));
      if (Array.isArray(cloned.rows)) {
        cloned.rows = cloned.rows.map((r: any) => {
          if (r && typeof r === "object") {
            const { id, ...rest } = r;
            return rest;
          }
          return r;
        });
      }
      // Also handle nested rows for fabric (yarnRows etc.)
      if (cloned.rows && typeof cloned.rows === "object") {
        Object.keys(cloned.rows).forEach((k) => {
          if (Array.isArray(cloned.rows[k])) {
            cloned.rows[k] = cloned.rows[k].map((r: any) => {
              if (r && typeof r === "object") {
                const { id, ...rest } = r;
                return rest;
              }
              return r;
            });
          }
        });
      }
      return cloned;
    };

    // Determine trims JSON to send: prefer selectedJson (only selected items)
    const trimsJsonToSend =
      trimsData.selectedJson && Object.keys(trimsData.selectedJson).length > 0
        ? trimsData.selectedJson
        : trimsData.json ?? {};

    // Ensure fallback for missing sections
    const costSheetData: CostSheetData = {
      style: formData.style,
      name: formData.name,
      item: formData.item,
      group: formData.group,
      size: formData.size,
      fabricType: formData.fabricType,
      gsm: formData.gsm,
      color: formData.color,
      qty: formData.qty || "0",
      buyer: formData.buyer,
      brand: formData.brand,
      image: formData.image, // Send File object directly
      cadConsumption: mode === "copy" ? stripIdsFromRows(cadData.json ?? {}) : cadData.json ?? {},
      fabricCost: mode === "copy" ? stripIdsFromRows(fabricData.json ?? {}) : fabricData.json ?? {},
      trimsAccessories: mode === "copy" ? stripIdsFromRows(trimsJsonToSend ?? {}) : trimsJsonToSend ?? {},
      summary: summaryJsonToSend,
      others: mode === "copy" ? stripIdsFromRows(othersData.json ?? {}) : othersData.json ?? {},
      styleRows: mode === "copy" ? stripIdsFromRows(formData.styleRows ?? {}) : formData.styleRows ?? {},
    };

    try {
      await createCostSheet(costSheetData).unwrap();
      toast.success("Cost Sheet saved successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to save Cost Sheet");
    }
  };
  // Helper setters to extract both rows and json
  const setCadData = (data: any) =>
    setCadDataRaw(data || { rows: [], json: {} });
  const setTrimsData = (data: any) =>
    setTrimsDataRaw(
      data
        ? {
            // always keep full rows for UI
            rows: data.rows ?? data,
            // Only treat `data.json` as the UI json when it's a real
            // non-empty payload (for edit mode). Do NOT copy
            // `selectedJson` into `json` — keep it separate so the
            // parent doesn't think this is an edit payload.
            json: data.json && Object.keys(data.json).length > 0 ? data.json : {},
            // Keep selectedJson separately for saving (only selected rows)
            selectedJson: data.selectedJson ?? undefined,
          }
        : { rows: [], json: {}, selectedJson: undefined }
    );
  const setOthersData = (data: any) =>
    setOthersDataRaw(data || { rows: [], json: {} });
  const setFabricData = (data: any) =>
    setFabricDataRaw(data || { rows: [], json: {} });
  const handleSummaryChange = (data: any) =>
    setSummaryData(data || { summary: {}, json: {} });

  return (
    <div className="space-y-6">
      <StyleInfoForm
        form={form}
        mode={mode === "copy" ? "edit" : "create"}
      />

  {/* Show sections when copying (initialData) OR when style is validated as not existing (original create flow) */}
  {(initialData || styleCheckData?.exists === false) && (
        <div className="space-y-4">
            <div className="space-y-6">
            <CadConsumptionSection data={cadData.rows} onChange={setCadData} mode={mode === "copy" ? "edit" : "create"} />
            <FabricCostSection
              data={fabricData}
              onChange={setFabricData}
              cadData={cadData.rows}
              mode={mode === "copy" ? "edit" : "create"}
            />
            <TrimsAccessoriesSection
                data={{
                  rows: trimsData.rows,
                  json: trimsData.json,
                }}
              onChange={setTrimsData}
              mode={mode === "copy" ? "edit" : "create"}
              showUnits={true}
            />
            <OthersSection data={othersData} onChange={setOthersData} mode={mode === "copy" ? "edit" : "create"} />
            <SummarySection
              summary={summaryData.summary}
              fabricData={fabricData}
              trimsData={trimsData}
              othersData={othersData}
              onChange={handleSummaryChange}
              mode={mode === "copy" ? "edit" : "create"}
            />
          </div>
          <div className="sticky w-full left-0 bottom-0 z-50 flex items-center gap-3 bg-white/80 backdrop-blur-sm p-2 px-4 rounded-t-md shadow-lg justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || styleCheckData?.exists === true}
            >
              Save Cost Sheet
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostSheetForm;
