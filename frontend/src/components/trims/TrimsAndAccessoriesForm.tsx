import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TrimsAccessoriesSectionCreate, { defaultTrims } from "@/components/cost-sheet/TrimsAccessoriesSectionCreate";
import {
  useCreateTrimsAndAccessoriesMutation,
  useGetTrimsAndAccessoriesByIdQuery,
  useUpdateTrimsAndAccessoriesMutation,
} from "@/redux/api/trimsAndAccessoriesApi";

interface Props {
  id?: number | null; // when provided, load for edit
  onSaved?: () => void;
  initialData?: any; // optional initial data for create mode
}

const TrimsAndAccessoriesForm: React.FC<Props> = ({ id = null, onSaved, initialData = null }) => {
  const { data, isLoading } = useGetTrimsAndAccessoriesByIdQuery(id as number, {
    skip: !id,
  });

  const navigate = useNavigate();

  // If an `id` was provided but the API returned no data (not loading),
  // redirect to the trims create page so user can create a new item.
  useEffect(() => {
    if (id && !isLoading && !data) {
      navigate("/management/trims/create");
    }
  }, [id, isLoading, data, navigate]);
  const [createItem, { isLoading: creating }] = useCreateTrimsAndAccessoriesMutation();
  const [updateItem, { isLoading: updating }] = useUpdateTrimsAndAccessoriesMutation();

  // Build default rows/json from exported defaultTrims
  const buildDefaultRows = () =>
    defaultTrims.map((trim, index) => ({ id: `trim-${index}`, description: trim, cost: "" }));
  const buildJsonFromRows = (rows: any[]) => ({
    tableName: "Trims & Accessories",
    columns: ["Item Description", "Rate"],
    rows: rows.map((r) => ({ description: r.description, cost: r.cost })),
    subtotal: 0,
    totalAccessoriesCost: 0,
  });

  const defaultRows = buildDefaultRows();
  const defaultDataObj = { rows: defaultRows, json: buildJsonFromRows(defaultRows) };

  const [name, setName] = useState(initialData?.name || "");
  const [rowsData, setRowsData] = useState<any>(
    initialData ?? (id ? { rows: [], json: {} } : defaultDataObj)
  );

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setRowsData({ rows: data.trimsRows?.rows || data.trimsRows || [], json: data.trimsRows || {} });
    }
  }, [data]);

  const handleSave = async () => {
    const payload = {
      name,
      trimsRows: rowsData.json || rowsData,
    };
    try {
      if (id) {
        await updateItem({ id: id as number, data: payload }).unwrap();
      } else {
        await createItem(payload).unwrap();
      }
      if (onSaved) onSaved();
    } catch (err) {
      console.error("Failed to save trims and accessories", err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{id ? "Edit" : "Create"} Trims & Accessories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <TrimsAccessoriesSectionCreate
          data={rowsData}
          onChange={(d) => setRowsData(d)}
        />

        <div className="mt-4 flex gap-2">
          <Button onClick={handleSave} disabled={creating || updating}>
            {id ? (updating ? "Updating..." : "Update") : creating ? "Creating..." : "Create"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrimsAndAccessoriesForm;
