import OthersSectionCreate from "./OthersSectionCreate";
import OthersSectionEdit from "./OthersSectionEdit";
import OthersSectionShow from "./OthersSectionShow";

interface OthersSectionProps {
  data: any;
  onChange?: (data: any) => void;
  mode?: "create" | "edit" | "show";
}

const OthersSection = ({ data, onChange, mode = "create" }: OthersSectionProps) => {
  if (mode === "show") {
    return <OthersSectionShow data={data} />;
  }

  if (mode === "edit") {
    return <OthersSectionEdit data={data} onChange={onChange} />;
  }

  if (mode === "create") {
    const hasPrefill = !!(data && (data.json || data.rows || (Array.isArray(data) && data.length > 0)));
    if (hasPrefill) {
      return <OthersSectionEdit data={data?.json || data || { rows: [] }} onChange={onChange} />;
    }
    return <OthersSectionCreate data={data} onChange={onChange} />;
  }

  return null;
};

export default OthersSection;
