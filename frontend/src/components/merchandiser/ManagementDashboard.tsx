import React from "react";
import { PageHeader } from "../ui/page-header";
import SampleTnaTable from "./SampleTnaTable";
import TnaSummaryCards from "./TnaSummaryCards";

const ManagementDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Management Dashboard"
        description=" Overview of all samples and their statuses"
        // actions={
        // }
      />

      <TnaSummaryCards />
      <SampleTnaTable readOnlyModals />
    </div>
  );
};

export default ManagementDashboard;
