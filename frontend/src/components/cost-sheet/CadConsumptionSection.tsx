import CadConsumptionSectionCreate from "./CadConsumptionSectionCreate";
import CadConsumptionSectionEdit from "./CadConsumptionSectionEdit";
import CadConsumptionSectionShow from "./CadConsumptionSectionShow";

interface CadConsumptionSectionProps {
  data: any;
  onChange?: (data: any) => void;
  mode?: "create" | "edit" | "show";
}

const CadConsumptionSection = ({ data, onChange, mode = "create" }: CadConsumptionSectionProps) => {
  if (mode === "show") {
    return <CadConsumptionSectionShow data={data} />;
  }

  if (mode === "edit") {
    return <CadConsumptionSectionEdit data={data} onChange={onChange} />;
  }

  if (mode === "create") {
    return <CadConsumptionSectionCreate data={data} onChange={onChange} />;
  }

  return null;
};

export default CadConsumptionSection;