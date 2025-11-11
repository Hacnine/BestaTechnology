import React from 'react';

export interface FabricRow {
  completeDate?: string;
  actualCompleteDate?: string;
}

export interface FabricCalculations {
  fabricRemaining: number | null;
  fabricActualBadge: React.JSX.Element | null;
}

export const calculateFabricValues = (row: FabricRow): FabricCalculations => {
  let fabricRemaining: number | null = null;
  let fabricActualBadge: JSX.Element | null = null;

  if (row.completeDate) {
    if (row.actualCompleteDate) {
      // Show days difference (negative = late, positive = early/0 day)
      const planned = new Date(row.completeDate);
      const actual = new Date(row.actualCompleteDate);
      const diffDays = Math.round(
        (planned.getTime() - actual.getTime()) / (1000 * 60 * 60 * 24)
      );
      fabricActualBadge = (
        <span
          className="bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded"
        >
          {diffDays < 0
            ? `${diffDays} days`
            : diffDays > 0
            ? `+ ${Math.abs(diffDays)} days`
            : "0 day"}
        </span>
      );
    } else {
      // Show remaining days from today to planned complete date
      const completeDate = new Date(row.completeDate);
      const today = new Date();
      fabricRemaining = Math.round(
        (completeDate.getTime() - today.setHours(0, 0, 0, 0)) /
          (1000 * 60 * 60 * 24)
      );
    }
  }

  return {
    fabricRemaining,
    fabricActualBadge,
  };
};