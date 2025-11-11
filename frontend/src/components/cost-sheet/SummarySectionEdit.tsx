import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SummarySectionChange } from "./SummarySection";

interface SummarySectionEditProps {
  summary: any;
  fabricData: any;
  trimsData: any; 
  othersData: any;
  onChange?: (data: SummarySectionChange) => void;
}

const SummarySectionEdit = ({
  summary = {},
  fabricData,
  trimsData,
  othersData,
  onChange,
}: SummarySectionEditProps) => {
  // Initialize with existing data or defaults
  const [factoryCM, setFactoryCM] = useState(14.0);
  const [profitPercent, setProfitPercent] = useState(0);
  const [commercialPercent, setCommercialPercent] = useState(5);
  // Guard to avoid notifying parent immediately after syncing from props
  const justInitializedRef = useRef(false);

  // Initialize values from summary prop when available
  useEffect(() => {
    if (summary) {
      // Handle both direct summary object and json-wrapped structure
      const summaryData = (summary as any).json || summary;

      // Only update local state if values are actually different
      const nextFactoryCM =
        (summaryData?.factoryCM !== undefined && Number(summaryData.factoryCM)) ?? factoryCM;
      const nextProfitPercent =
        (summaryData?.profitPercent !== undefined && Number(summaryData.profitPercent)) ?? profitPercent;
      const nextCommercialPercent =
        (summaryData?.commercialPercent !== undefined && Number(summaryData.commercialPercent)) ?? commercialPercent;

      const changed =
        nextFactoryCM !== factoryCM ||
        nextProfitPercent !== profitPercent ||
        nextCommercialPercent !== commercialPercent;

      if (changed) {
        setFactoryCM(nextFactoryCM);
        setProfitPercent(nextProfitPercent);
        setCommercialPercent(nextCommercialPercent);
        // Suppress one notify after syncing from props to prevent feedback loop
        justInitializedRef.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary]);

  // Calculate fabric cost
  const getFabricCost = () => {
    if (fabricData?.totalFabricCost !== undefined) {
      return fabricData.totalFabricCost;
    }
    if (fabricData?.json?.totalFabricCost !== undefined) {
      return fabricData.json.totalFabricCost;
    }
    let total = 0;
    if (fabricData?.yarnRows && Array.isArray(fabricData.yarnRows)) {
      total += fabricData.yarnRows.reduce(
        (sum: number, row: any) => sum + (Number(row.value) || 0),
        0
      );
    }
    if (fabricData?.knittingRows && Array.isArray(fabricData.knittingRows)) {
      total += fabricData.knittingRows.reduce(
        (sum: number, row: any) => sum + (Number(row.value) || 0),
        0
      );
    }
    if (fabricData?.dyeingRows && Array.isArray(fabricData.dyeingRows)) {
      total += fabricData.dyeingRows.reduce(
        (sum: number, row: any) => sum + (Number(row.value) || 0),
        0
      );
    }
    return total;
  };
  const fabricCost = getFabricCost();

  // Calculate accessories cost FRESH from rows — ignore stale backend values.
  let accessoriesCost = 0;
  const trimsRows = trimsData?.json?.rows || trimsData?.rows || (Array.isArray(trimsData) ? trimsData : []);
  if (Array.isArray(trimsRows)) {
    accessoriesCost = trimsRows.reduce((sum: number, item: any) => {
      const rowTotal = Number(item.total) || (Number(item.unit || 0) * Number(item.cost || 0));
      return sum + rowTotal;
    }, 0);
  }

  // Dynamically calculate total for 'othersData' if it's an array
  let othersTotal = 0;
  if (Array.isArray(othersData)) {
    othersTotal = othersData.reduce((sum, item) => {
      const val = parseFloat(item.value);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  } else if (typeof othersData?.total === "number") {
    othersTotal = othersData.total;
  } else if (typeof othersData?.json?.total === "number") {
    othersTotal = othersData.json.total;
  }

    // Notify parent of current values whenever they change
  useEffect(() => {
    if (justInitializedRef.current) {
      // Skip the immediate notify caused by syncing from incoming props
      justInitializedRef.current = false;
      return;
    }
    notifyChange(factoryCM, profitPercent, commercialPercent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [factoryCM, profitPercent, commercialPercent, fabricCost, accessoriesCost, othersTotal]);

  const totalCost = fabricCost + accessoriesCost + factoryCM + othersTotal;
  const commercialCost = totalCost * (commercialPercent / 100);
  // Add commercialCost to totalCost for display
  const totalCostWithCommercial = totalCost + commercialCost;
  const profitCost = totalCostWithCommercial * (profitPercent / 100);
  const fobPrice = totalCostWithCommercial + profitCost;
  const pricePerPiece = fobPrice / 12;

  // Helper to send summary data to parent
  const notifyChange = (nextFactoryCM: number, nextProfitPercent: number, nextCommercialPercent: number) => {
    if (onChange) {      
      const nextTotalCost = fabricCost + accessoriesCost + nextFactoryCM + othersTotal;
      const nextCommercialCost = nextTotalCost * (nextCommercialPercent / 100);
      const nextTotalCostWithCommercial = nextTotalCost + nextCommercialCost;
      const nextProfitCost = nextTotalCostWithCommercial * (nextProfitPercent / 100);
      const nextFobPrice = nextTotalCostWithCommercial + nextProfitCost;
      const nextPricePerPiece = Number(nextFobPrice / 12).toFixed(3);
      onChange({
        summary: {
          factoryCM: nextFactoryCM,
          commercialPercent: nextCommercialPercent,
          profitPercent: nextProfitPercent,
          pricePerPiece: nextPricePerPiece
        },
        json: {
          tableName: "Summary",
          factoryCM: nextFactoryCM,
          commercialPercent: nextCommercialPercent,
          profitPercent: nextProfitPercent,
          pricePerPiece: nextPricePerPiece,
        }
      });
    }
  };

  // Only call notifyChange when user changes factoryCM or profitPercent
  const handleFactoryCMChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) || 0;
    setFactoryCM(value);
    notifyChange(value, profitPercent, commercialPercent);
  };

  const handleProfitPercentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value) || 0;
    setProfitPercent(value);
    notifyChange(factoryCM, value, commercialPercent);
  };

  const handleCommercialPercentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value) || 0;
    setCommercialPercent(value);
    notifyChange(factoryCM, profitPercent, value);
  };

  return (
    <Card className="print:p-0 print:shadow-none print:border-none print:bg-white">
      <CardHeader className="print:p-0 print:mb-0 print:border-none print:bg-white">
        <CardTitle className="text-lg print:text-base print:mb-0">
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="print:p-0 print:space-y-0 print:bg-white">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 pb-4 border-b">
            <div className="space-y-2">
              <Label htmlFor="factoryCM">Factory CM / Dzn Garments</Label>
              <Input
                id="factoryCM"
                type="number"
                value={factoryCM}
                onChange={handleFactoryCMChange}
                className="font-semibold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commercialPercent">Commercial %</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="commercialPercent"
                  type="number"
                  value={commercialPercent}
                  onChange={handleCommercialPercentChange}
                  className="font-semibold"
                />
                 <span className="font-semibold">
                $
                {Number(commercialCost)
                  ? Number(commercialCost).toFixed(3)
                  : "0.000"}
              </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profitPercent">Profit %</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="profitPercent"
                  type="number"
                  value={profitPercent}
                  onChange={handleProfitPercentChange}
                  className="font-semibold"
                />
                 <span className="font-semibold">
                $
                {Number(profitCost)
                  ? Number(profitCost).toFixed(3)
                  : "0.000"}
              </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="font-medium">Fabric Cost / Dzn Garments</span>
              <span className="font-semibold">
                $
                {Number(fabricCost) ? Number(fabricCost).toFixed(3) : "0.000"}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="font-medium">
                Accessories Cost / Dzn Garments
              </span>
              <span className="font-semibold">
                $
                {Number(accessoriesCost)
                  ? Number(accessoriesCost).toFixed(3)
                  : "0.000"}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="font-medium">Factory CM / Dzn Garments</span>
              <span className="font-semibold">
                ${Number(factoryCM) ? Number(factoryCM).toFixed(3) : "0.000"}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="font-medium">Others Cost</span>
              <span className="font-semibold">
                  $
                  {Number(othersTotal)
                    ? Number(othersTotal).toFixed(3)
                    : "0.000"}
              </span>
            </div>

              <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                <span className="font-medium">
                  Commercial Cost ({commercialPercent}%)
                </span>
                <span className="font-semibold">
                  $
                  {Number(commercialCost)
                    ? Number(commercialCost).toFixed(3)
                    : "0.000"}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-primary/10 rounded border border-primary/20">
                <span className="font-bold">Total Cost (with Commercial)</span>
                <span className="font-bold text-lg">
                  ${Number(totalCostWithCommercial) ? Number(totalCostWithCommercial).toFixed(3) : "0.000"}
                </span>
              </div>

            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="font-medium">
                Profit ({profitPercent}%)
              </span>
              <span className="font-semibold">
                $
                {Number(profitCost)
                  ? Number(profitCost).toFixed(3)
                  : "0.000"}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-accent/10 rounded border border-accent/20">
              <span className="font-bold text-lg">FOB Price / Dzn</span>
              <span className="font-bold text-xl text-accent">
                ${Number(fobPrice) ? Number(fobPrice).toFixed(3) : "0.000"}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-primary/20 rounded-lg border-2 border-primary">
              <span className="font-bold text-lg">Price / Pc Garments</span>
              <span className="font-bold text-2xl text-primary">
                $
                {Number(pricePerPiece)
                  ? Number(pricePerPiece).toFixed(3)
                  : "0.000"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummarySectionEdit;