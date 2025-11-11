import FabricCostSectionCreate from "./FabricCostSectionCreate";
import FabricCostSectionEdit from "./FabricCostSectionEdit";
import FabricCostSectionShow from "./FabricCostSectionShow";

interface FabricCostSectionProps {
  data: any;
  onChange?: (data: any) => void;
  mode?: "create" | "edit" | "show";
  cadData?: any[];
}

const FabricCostSection = ({ data, onChange, mode = "create", cadData }: FabricCostSectionProps) => {
  if (mode === "show") {
    return <FabricCostSectionShow data={data} />;
  }

  if (mode === "edit") {
    return <FabricCostSectionEdit data={data?.json || data || {}} onChange={onChange}  cadData={cadData}/>;
  }

  // If we're in create mode but `data` looks like prefilled sheet data (copy action),
  // prefer the Edit component so fields are editable and match the edit UI.
  if (mode === "create") {
    // Treat as prefilled only when JSON-shaped data has actual content
    const json = data?.json || data || {};
    const rowsPresent = [json.yarnRows, json.knittingRows, json.dyeingRows].some(
      (r) => Array.isArray(r) && r.length > 0
    );
    const totalsPresent = [json.yarnTotal, json.knittingTotal, json.dyeingTotal].some(
      (t) => Number(t || 0) > 0
    );

    if ((data && (data.json || data.yarnRows || data.knittingRows || data.dyeingRows)) && (rowsPresent || totalsPresent) && !cadData) {
      return <FabricCostSectionEdit data={json} onChange={onChange} cadData={cadData}/>;
    }

    return <FabricCostSectionCreate data={data} onChange={onChange} cadData={cadData} />;
  }

  return null;
};

export default FabricCostSection;
