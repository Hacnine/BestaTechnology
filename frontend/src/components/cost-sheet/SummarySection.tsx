import SummarySectionCreate from "./SummarySectionCreate";
import SummarySectionEdit from "./SummarySectionEdit";
import SummarySectionShow from "./SummarySectionShow";

export interface SummarySectionChange {
  summary: any;
  json: any;
}

interface SummarySectionProps {
  summary: any;
  fabricData: any;
  trimsData: any; 
  othersData: any;
  onChange?: (data: SummarySectionChange) => void;
  mode?: "create" | "edit" | "show";
}

const SummarySection = ({
  summary,
  fabricData,
  trimsData,
  othersData,
  onChange,
  mode = "create",
}: SummarySectionProps) => {
  if (mode === "show") {
    return (
      <SummarySectionShow
        summary={summary}
        fabricData={fabricData}
        trimsData={trimsData}
        othersData={othersData}
      />
    );
  }

  if (mode === "edit") {
    return (
      <SummarySectionEdit
        summary={summary}
        fabricData={fabricData}
        trimsData={trimsData}
        othersData={othersData}
        onChange={onChange}
      />
    );
  }

  if (mode === "create") {
    return (
      <SummarySectionCreate
        summary={summary}
        fabricData={fabricData}
        trimsData={trimsData}
        othersData={othersData}
        onChange={onChange}
      />
    );
  }

  return null;
};

export default SummarySection;
