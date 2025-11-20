import { PageHeader } from "@/components/ui/page-header";
import SampleTnaTable from "./SampleTnaTable";

export default function Reports() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Reports"
        description="Business intelligence and analytics reports"
      />
      <SampleTnaTable/>
    </div>
  );
}