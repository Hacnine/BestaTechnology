import React, { useState, useRef } from "react";
import { Card } from "../ui/card";
import {
  useGetCostSheetByIdQuery,
  useGetCostSheetsQuery,
  useUpdateCostSheetMutation,
  useDeleteCostSheetMutation,
} from "@/redux/api/costSheetApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/redux/slices/userSlice";
import CadConsumptionSection from "./CadConsumptionSection";
import FabricCostSection from "./FabricCostSection";
import TrimsAccessoriesSection from "./TrimsAccessoriesSection";
import OthersSection from "./OthersSection";
import SummarySection from "./SummarySection";
import StyleInfoForm from "./StyleInfoForm";
import {
  Copy,
  Edit,
  Eye,
  EyeOff,
  Trash,
  Search,
  ChevronDown,
  ImageOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import FullScreenModal from "./FullScreenModal";
import url from "@/config/urls";

interface CostSheetTableProps {
  onCopy?: (sheet: any) => void;
}

// Small subcomponent to avoid repeating the header + search input
const SearchHeader: React.FC<{
  search: string;
  setSearch: (v: string) => void;
  isLoading: boolean;
  error?: any;
  scope: "all" | "own";
  setScope: (v: "all" | "own") => void;
  setPage?: (v: number) => void;
  isAdmin?: boolean;
}> = ({ search, setSearch, isLoading, error, scope, setScope, setPage, isAdmin }) => (
  <div className="flex items-center mb-4 w-full">
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-4">
        <div className="relative">
          <label className="block text-sm font-medium mb-1">Search</label>
          <Input
            type="text"
            className="md:w-[300px] placeholder:text-sm pl-8 border rounded-md"
            placeholder="Search By Style "
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            disabled={isLoading}
          />
          <Search className="absolute left-2 top-9 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        <div className="mt-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="w-[164px]">
              <Button
                variant="outline"
                size="sm"
                className="hidden py-5 md:inline-flex"
                disabled={isAdmin}
              >
                <ChevronDown className="w-4 h-4 mr-2" />
                {scope === "all" ? "All Cost Sheets" : "Own Cost Sheets"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-h-20 w-[164px]" side="bottom" align="start">
              <DropdownMenuItem
                onSelect={() => {
                  setScope("all");
                  if (setPage) setPage(1);
                }}
              >
                All Cost Sheets
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setScope("own");
                  if (setPage) setPage(1);
                }}
              >
                Own Cost Sheets
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  </div>
);

// Consolidate action buttons (view/copy/edit/delete) and permission checks
const ActionButtons: React.FC<{
  sheet: any;
  expandedId: number | null;
  setExpandedId: (id: number | null) => void;
  setEditModalId: (id: number | null) => void;
  onCopy?: (sheet: any) => void;
  deleteCostSheet: any;
  isDeleting: boolean;
  currentUser: any;
}> = ({
  sheet,
  expandedId,
  setExpandedId,
  setEditModalId,
  onCopy,
  deleteCostSheet,
  isDeleting,
  currentUser,
}) => {
  const ownerId = Number(sheet.createdBy?.id ?? sheet.createdById);
  const isOwner = currentUser && currentUser.id === ownerId;
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setExpandedId(expandedId === sheet.id ? null : sheet.id)}
      >
        {expandedId === sheet.id ? <EyeOff /> : <Eye />}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          if (expandedId === sheet.id) {
            setExpandedId(null);
            setEditModalId(null);
            setTimeout(() => onCopy && onCopy(sheet), 200);
          } else {
            onCopy && onCopy(sheet);
          }
        }}
        title="Copy Cost Sheet"
        className="-ml-3  text-yellow-600 hover:text-white"
      >
        <Copy />
      </Button>

      {(isOwner || currentUser?.role === "ADMIN") && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              // eslint-disable-next-line no-restricted-globals
              const confirmed = window.confirm(
                `Are you sure you want to delete cost sheet '${
                  sheet.style?.name || sheet.id
                }'? This cannot be undone.`
              );
              if (!confirmed) return;
              try {
                await deleteCostSheet(sheet.id).unwrap();
                if (expandedId === sheet.id) {
                  setExpandedId(null);
                  setEditModalId(null);
                }
              } catch (err) {
                console.error("Failed to delete cost sheet", err);
              }
            }}
            title="Delete Cost Sheet"
            className="ml-1 text-red-600 hover:text-white"
            disabled={isDeleting}
          >
            <Trash />
          </Button>
        </>
      )}

      {(isOwner || currentUser?.role === "MANAGEMENT") && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setExpandedId(sheet.id);
            setEditModalId(sheet.id);
          }}
          title="Edit Cost Sheet"
          className=" text-blue-600 hover:text-white"
        >
          <Edit />
        </Button>
      )}
    </>
  );
};

const CostSheetTable = ({ onCopy }: CostSheetTableProps) => {
  const { user } = useUser();
  // Pagination state
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editModalId, setEditModalId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [scope, setScope] = useState<"all" | "own">(
    user?.role === "ADMIN" ? "all" : "own"
  );
  // API call with pagination
  // include `scope` explicitly so the query args change when scope changes
  const { data, isLoading, error } = useGetCostSheetsQuery(
    {
      page,
      limit,
      search: search || undefined,
      scope,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Normalize API response: older backend returned `sanitized` array, newer returns an object with `data` array.
  // `sheets` will always be an array for rendering.
  const sheets: any[] = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data as any[]; // legacy shape
    if ((data as any).sanitized) return (data as any).sanitized as any[];
    if ((data as any).data) return (data as any).data as any[];
    return [];
  }, [data]);

  const totalPages = (data && (data as any).totalPages) || 1;
  const hasNextPage = (data && (data as any).hasNextPage) || false;

  // If user is admin, ensure scope stays 'all' and reset to first page
  React.useEffect(() => {
    if (user?.role === "ADMIN") {
      setScope("all");
      setPage(1);
    }
  }, [user?.role]);

  const {
    data: singleSheetData,
    isLoading: isSheetLoading,
    isFetching: isSheetFetching,
    error: sheetError,
    refetch: refetchSheet,
  } = useGetCostSheetByIdQuery(expandedId ?? 0, {
    skip: expandedId === null,
  });
  // console.log(sheetData, "sheet data in table");
  const [updateCostSheet, { isLoading: isUpdating }] =
    useUpdateCostSheetMutation();
  const [deleteCostSheet, { isLoading: isDeleting }] =
    useDeleteCostSheetMutation();
  // console.log(data)
  // Add a form instance for edit mode
  const editForm = useForm({
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
      buyer: "",
      brand: "",
      image: null,
      styleRows: {},
      styleJson: {},
    },
  });

  // Local state for edited sections
  const [editedCadRows, setEditedCadRows] = useState<any>(null);
  const [editedFabricRows, setEditedFabricRows] = useState<any>({
    rows: { yarnRows: [], knittingRows: [], dyeingRows: [] },
    json: {},
  });
  const [editedTrimsRows, setEditedTrimsRows] = useState<any>(null);
  const [editedOthersRows, setEditedOthersRows] = useState<any>(null);
  const [editedSummaryRows, setEditedSummaryRows] = useState<any>(null);
  const currentSheet = (singleSheetData as any) ?? null;
  const currentUser = user || null;
  const isEditMode = expandedId !== null && editModalId === expandedId;

  React.useEffect(() => {
    if (expandedId !== null) {
      const base = singleSheetData || sheets.find((s: any) => s.id === expandedId);

      const incomingCad = base?.cadRows;
      if (incomingCad) {
        if (Array.isArray(incomingCad)) {
          setEditedCadRows({ rows: incomingCad, json: {} });
        } else if (incomingCad.rows) {
          setEditedCadRows(incomingCad);
        } else {
          // fallback: wrap whatever was provided into rows if possible
          setEditedCadRows({ rows: incomingCad as any, json: {} });
        }
      } else {
        setEditedCadRows(null);
      }
      const fabricData = base?.fabricRows;
      if (fabricData && (fabricData as any).yarnRows) {
        // Old flat format
        setEditedFabricRows({
          rows: {
            yarnRows: (fabricData as any).yarnRows,
            knittingRows: (fabricData as any).knittingRows,
            dyeingRows: (fabricData as any).dyeingRows,
          },
          json: fabricData as any,
        });
      } else if (fabricData && (fabricData as any).json) {
        // New format with json and rows
        setEditedFabricRows({
          rows: (fabricData as any).rows || {
            yarnRows: [],
            knittingRows: [],
            dyeingRows: [],
          },
          json: (fabricData as any).json,
        });
      } else {
        // Default empty
        setEditedFabricRows({
          rows: { yarnRows: [], knittingRows: [], dyeingRows: [] },
          json: {},
        });
      }
      setEditedTrimsRows(base?.trimsRows);
      setEditedOthersRows(base?.othersRows);
      setEditedSummaryRows(
        (base as any)?.summaryRows?.json ||
          (base as any)?.summaryRows?.summary ||
          (base as any)?.summaryRows
      );
    }
  }, [expandedId, editModalId, data, singleSheetData]);
  console.log(scope, "scope value");

  // Set form values when entering edit mode
  React.useEffect(() => {
    if (isEditMode && currentSheet && editForm) {
      editForm.reset({
        style:
          (currentSheet as any).style?.name ||
          (currentSheet as any).style ||
          "",
        name: (currentSheet as any).name || "",
        item: (currentSheet as any).item || "",
        group: (currentSheet as any).group || "",
        size: (currentSheet as any).size || "",
        fabricType: (currentSheet as any).fabricType || "",
        gsm: (currentSheet as any).gsm || "",
        color: (currentSheet as any).color || "",
        qty: (currentSheet as any).quantity ?? "",
        buyer: (currentSheet as any).buyer || "",
        brand: (currentSheet as any).brand || "",
        image: (currentSheet as any).image || null,
        // ensure styleRows are available to the edit form (StyleCustomFields reads this)
        styleRows:
          (currentSheet as any).styleRows ||
          (currentSheet as any).styleJson ||
          {},
      });
    }
  }, [isEditMode, currentSheet, editForm]);

  // Render logic
  let content;
  if (isLoading) {
    content = (
      <Card className="p-4 w-full ">
        <div className="text-center text-muted-foreground">Loading...</div>
      </Card>
    );
  } else if (error) {
    content = (
      <Card className="p-4 w-full">
        <SearchHeader
          search={search}
          setSearch={(v) => {
            setSearch(v);
            setPage(1);
          }}
          isLoading={isLoading}
          error={error}
          scope={scope}
          setScope={setScope}
          setPage={setPage}
          isAdmin={user?.role === "ADMIN"}
        />
        <div className="text-center text-destructive py-8">
          Failed to load cost sheets. Please try again.
        </div>
      </Card>
    );
  } else if (!data || sheets.length === 0) {
    content = (
      <Card className="p-4 w-full">
        <SearchHeader
          search={search}
          setSearch={(v) => {
            setSearch(v);
            setPage(1);
          }}
          isLoading={isLoading}
          scope={scope}
          setScope={setScope}
          setPage={setPage}
          isAdmin={user?.role === "ADMIN"}
        />
        <div className="text-center text-muted-foreground py-8">
          No cost sheets found.
        </div>
      </Card>
    );
  } else {
    content = (
      <Card className="p-4 w-full ">
        <SearchHeader
          search={search}
          setSearch={(v) => {
            setSearch(v);
            setPage(1);
          }}
          isLoading={isLoading}
          error={error}
          scope={scope}
          setScope={setScope}
          setPage={setPage}
          isAdmin={user?.role === "ADMIN"}
        />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-2">S/N</th>
                <th className="text-left p-2">Image</th>
                <th className="text-left p-2">Style</th>
                <th className="text-left p-2">Merchandiser</th>
                <th className="text-left p-2">Item</th>
                <th className="text-left p-2">Group</th>
                {/* <th className="text-left p-2">Size</th> */}
                <th className="text-left p-2">Fabric Type</th>
                <th className="text-left p-2">GSM</th>
                {/* <th className="text-left p-2">Color</th> */}
                <th className="text-left p-2">Quantity</th>
                <th className="text-left p-2">Created At</th>
                <th className="text-left p-2">Price Per Piece</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sheets.map((sheet: any, index: number) => (
                <React.Fragment key={sheet.id}>
                  <tr className="border-b hover:bg-muted/20">
                    <td className="p-2 font-medium">{(page - 1) * limit + index + 1}</td>
                    <td className="p-2">
                      {sheet.image ? (
                        <img
                          src={`${url.BASE_URL}${encodeURI(sheet.image)}`}
                          alt={sheet.style?.name || "Cost Sheet Image"}
                          className="w-16 h-16 object-cover"
                        />
                      ) : (
                        <ImageOff className="text-gray-600" />
                      )}
                    </td>
                    <td className="p-2 uppercase text-xs">
                      {sheet.style?.name || "-"}
                    </td>
                    <td className="p-2 text-sm capitalize">
                      {sheet.name || "-"}
                    </td>
                    <td className="p-2 text-sm">{sheet.item || "-"}</td>
                    <td className="p-2 text-sm">{sheet.group || "-"}</td>
                    {/* <td className="p-2 text-sm">{sheet.size || "-"}</td> */}
                    <td className="p-2 text-sm">{sheet.fabricType || "-"}</td>
                    <td className="p-2 text-sm">{sheet.gsm || "-"}</td>
                    {/* <td className="p-2 text-sm">{sheet.color || "-"}</td> */}
                    <td className="p-2 text-sm">{sheet.quantity ?? "-"}</td>
                    <td className="p-2 text-sm">
                      {sheet.createdAt
                        ? new Date(sheet.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-2 text-sm">
                      {sheet.summaryRows?.json?.summary?.pricePerPiece ||
                        sheet.summaryRows?.summary?.pricePerPiece ||
                        Number(sheet.summaryRows?.pricePerPiece).toFixed(3) ||
                        "-"}
                    </td>

                    <td className="p-2">
                      <ActionButtons
                        sheet={sheet}
                        expandedId={expandedId}
                        setExpandedId={setExpandedId}
                        setEditModalId={setEditModalId}
                        onCopy={onCopy}
                        deleteCostSheet={deleteCostSheet}
                        isDeleting={isDeleting}
                        currentUser={currentUser}
                      />
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="px-2">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasNextPage}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
        {/* Fullscreen modal for expanded details */}
        <FullScreenModal
          open={expandedId !== null}
          onClose={() => {
            setExpandedId(null);
            setEditModalId(null);
          }}
          isEditMode={isEditMode}
          isUpdating={isUpdating}
          onSave={async () => {
            const editedValues = editForm.getValues();

            // No need to convert image to base64 - send File object directly

            const payload = {
              id: (currentSheet as any)?.id,
              data: {
                style: editedValues.style,
                name: editedValues.name,
                // include styleRows from the edit form so custom fields are saved
                styleRows:
                  editedValues.styleRows || editedValues.styleJson || undefined,
                item: editedValues.item,
                group: editedValues.group,
                size: editedValues.size,
                fabricType: editedValues.fabricType,
                gsm: editedValues.gsm,
                color: editedValues.color,
                quantity: editedValues.qty,
                buyer: editedValues.buyer,
                brand: editedValues.brand,
                image: editedValues.image, // Send File object directly
                cadRows: editedCadRows,
                fabricRows: editedFabricRows,
                trimsRows: editedTrimsRows,
                othersRows: editedOthersRows,
                summaryRows: editedSummaryRows,
              },
            };
            try {
              await updateCostSheet(payload).unwrap();
              if (refetchSheet) {
                await refetchSheet();
              }
              setEditModalId(null);
            } catch (err) {
              console.error("Failed to update cost sheet:", err);
              alert("Failed to update cost sheet. Please try again.");
            }
          }}
        >
          {expandedId !== null &&
            (isSheetLoading || isSheetFetching) &&
            !singleSheetData && (
              <div className="w-full h-[60vh] flex items-center justify-center text-muted-foreground">
                Loading details...
              </div>
            )}
          {expandedId !== null && sheetError && (
            <div className="p-4 text-center text-destructive">
              Failed to load cost sheet details.
            </div>
          )}
          {expandedId !== null &&
            !!currentSheet &&
            !isSheetLoading &&
            !isSheetFetching && (
              <div className="space-y-5">
                <StyleInfoForm
                  mode={isEditMode ? "edit" : "show"}
                  data={{
                    image: (currentSheet as any).image || "-",
                    style:
                      (currentSheet as any).style?.name ||
                      (currentSheet as any).style ||
                      "-",
                    name: (currentSheet as any).name || "",
                    buyer: (currentSheet as any).buyer || "-",
                    brand: (currentSheet as any).brand || "-",
                    createdBy: (currentSheet as any).createdBy || "-",
                    styleRows: (currentSheet as any).styleRows || {},
                    item: (currentSheet as any).item,
                    group: (currentSheet as any).group,
                    size: (currentSheet as any).size,
                    fabricType: (currentSheet as any).fabricType,
                    gsm: (currentSheet as any).gsm,
                    color: (currentSheet as any).color,
                    qty: (currentSheet as any).quantity ?? "-",
                  }}
                  form={isEditMode ? editForm : undefined}
                />
                <div className="flex gap-6 ">
                  <div className="w-1/2 space-y-6 print-hide-left">
                    <CadConsumptionSection
                      data={
                        isEditMode
                          ? editedCadRows?.rows || []
                          : (currentSheet as any)?.cadRows?.rows ||
                            (currentSheet as any)?.cadRows?.json?.rows ||
                            []
                      }
                      mode={isEditMode ? "edit" : "show"}
                      onChange={
                        isEditMode ? (d) => setEditedCadRows(d) : undefined
                      }
                    />
                    <FabricCostSection
                      data={
                        isEditMode
                          ? editedFabricRows
                          : (currentSheet as any)?.fabricRows?.json ||
                            (currentSheet as any)?.fabricRows?.rows ||
                            (currentSheet as any)?.fabricRows
                      }
                      mode={isEditMode ? "edit" : "show"}
                      onChange={
                        isEditMode ? (d) => setEditedFabricRows(d) : undefined
                      }
                      cadData={
                        isEditMode
                          ? editedCadRows?.rows || []
                          : currentSheet?.cadRows
                      }
                    />
                    <OthersSection
                      data={
                        isEditMode
                          ? editedOthersRows
                          : (currentSheet as any)?.othersRows
                      }
                      mode={isEditMode ? "edit" : "show"}
                      onChange={
                        isEditMode ? (d) => setEditedOthersRows(d) : undefined
                      }
                    />
                  </div>
                  <div className="w-1/2 space-y-5">
                    <TrimsAccessoriesSection
                      data={
                        isEditMode
                          ? editedTrimsRows
                          : (currentSheet as any)?.trimsRows
                      }
                      mode={isEditMode ? "edit" : "show"}
                      onChange={
                        isEditMode ? (d) => setEditedTrimsRows(d) : undefined
                      }
                      showUnits={true}
                    />

                    <SummarySection
                      summary={
                        isEditMode
                          ? editedSummaryRows?.summary || editedSummaryRows
                          : (currentSheet as any)?.summaryRows?.summary ||
                            (currentSheet as any)?.summaryRows?.json?.summary ||
                            (currentSheet as any)?.summaryRows
                      }
                      fabricData={
                        isEditMode
                          ? editedFabricRows
                          : (currentSheet as any)?.fabricRows?.json ||
                            (currentSheet as any)?.fabricRows?.rows ||
                            (currentSheet as any)?.fabricRows
                      }
                      trimsData={
                        isEditMode
                          ? editedTrimsRows?.rows || []
                          : (currentSheet as any)?.trimsRows?.rows || []
                      }
                      othersData={
                        isEditMode
                          ? editedOthersRows?.rows ||
                            editedOthersRows?.json ||
                            []
                          : (currentSheet as any)?.othersRows?.rows || []
                      }
                      mode={isEditMode ? "edit" : "show"}
                      onChange={
                        isEditMode ? (d) => setEditedSummaryRows(d) : undefined
                      }
                    />
                  </div>
                </div>
              </div>
            )}
        </FullScreenModal>
      </Card>
    );
  }

  return content;
};

export default CostSheetTable;
