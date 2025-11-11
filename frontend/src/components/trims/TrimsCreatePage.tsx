import React from "react";
import TrimsAndAccessoriesForm from "./TrimsAndAccessoriesForm";
import TrimsAccessoriesSectionCreate, { defaultTrims } from "@/components/cost-sheet/TrimsAccessoriesSectionCreate";

const TrimsCreatePage: React.FC = () => {
  // Build initial data using defaultTrims
  const initialRows = defaultTrims.map((trim, index) => ({ id: `trim-${index}`, description: trim, cost: "" }));
  const initialData = { name: "", rows: initialRows, json: { tableName: "Trims & Accessories", columns: ["Item Description", "Rate"], rows: initialRows.map(r => ({ description: r.description, cost: r.cost })), subtotal: 0, totalAccessoriesCost: 0 } };

  return <TrimsAndAccessoriesForm initialData={initialData} />;
};

export default TrimsCreatePage;
