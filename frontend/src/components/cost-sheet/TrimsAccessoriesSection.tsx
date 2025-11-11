import TrimsAccessoriesSectionCreate from "./TrimsAccessoriesSectionCreate";
import TrimsAccessoriesSectionEdit from "./TrimsAccessoriesSectionEdit";
import TrimsAccessoriesSectionShow from "./TrimsAccessoriesSectionShow";

interface TrimRow {
  id: string;
  description: string;
  cost: string;
}

interface TrimsAccessoriesSectionChange {
  rows: TrimRow[];
  json: any;
}

interface TrimsAccessoriesSectionProps {
  data: any;
  onChange?: (data: TrimsAccessoriesSectionChange) => void;
  mode?: "create" | "edit" | "show";
  showUnits?: boolean;
}

const TrimsAccessoriesSection = ({
  data,
  onChange,
  mode = "create",
  showUnits = false,
}: TrimsAccessoriesSectionProps) => {
  if (mode === "show") {
    return <TrimsAccessoriesSectionShow data={data} showUnits={showUnits} />;
  }

  if (mode === "edit") {
    return <TrimsAccessoriesSectionEdit data={data} onChange={onChange} showUnits={showUnits} />;
  }
 if (mode === "create") {
    // In create mode we want the Create UI even if `data.rows` exists
    // (parent may supply rows as the user types). Avoid auto-switching
    // to the Edit component to prevent remounts and input focus loss.
    return <TrimsAccessoriesSectionCreate data={data} onChange={onChange} showUnits={showUnits} />;
  }

  return null;
};

export default TrimsAccessoriesSection;