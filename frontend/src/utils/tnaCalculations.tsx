import React from 'react';

export interface TnaRow {
  id: string;
  cad?: {
    completeDate?: string;
    finalCompleteDate?: string;
  };
  sampleSendingDate?: string;
  dhlTracking?: {
    date?: string;
    isComplete?: boolean;
  };
  fabricBooking?: {
    completeDate?: string;
    actualCompleteDate?: string;
  };
  sampleDevelopment?: {
    sampleCompleteDate?: string;
    actualSampleCompleteDate?: string;
  };
}

export interface TnaCalculations {
  // CAD calculations
  cadRemaining: number | null;
  cadActualBadge: React.JSX.Element | null;

  // Lead time calculations
  leadTimeRemaining: number | null;

  // Fabric calculations
  fabricRemaining: number | null;
  fabricActualBadge: React.JSX.Element | null;

  // Sample calculations
  sampleRemaining: number | null;
  sampleActualBadge: React.JSX.Element | null;

  // Completion status
  isCadComplete: boolean;
  isFabricComplete: boolean;
  isSampleComplete: boolean;
  canAddDHLTracking: boolean;
}

export const calculateTnaValues = (row: TnaRow): TnaCalculations => {
  // CAD calculations
  let cadRemaining: number | null = null;
  let cadActualBadge: JSX.Element | null = null;

  if (row.cad && row.cad.completeDate) {
    if (row.cad.finalCompleteDate) {
      // Show days difference (negative = late, positive = early/0 day)
      const planned = new Date(row.cad.completeDate);
      const actual = new Date(row.cad.finalCompleteDate);
      const diffDays = Math.round(
        (planned.getTime() - actual.getTime()) / (1000 * 60 * 60 * 24)
      );
      const isCadStepComplete = !!row.cad.finalCompleteDate;
      cadActualBadge = (
        <span
          className={
            isCadStepComplete
              ? "bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded"
              : diffDays < 0
              ? "text-red-500"
              : "bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded"
          }
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
      const completeDate = new Date(row.cad.completeDate);
      const today = new Date();
      cadRemaining = Math.round(
        (completeDate.getTime() - today.setHours(0, 0, 0, 0)) /
          (1000 * 60 * 60 * 24)
      );
    }
  }

  // Days left calculations
  let leadTimeRemaining: number | null = null;
  if (row.sampleSendingDate) {
    const sampleSendDate = new Date(row.sampleSendingDate);
    // If DHLTracking date exists, use it as the reference date, else use today
    let referenceDate = new Date();
    if (row.dhlTracking && row.dhlTracking.date) {
      referenceDate = new Date(row.dhlTracking.date);
    }
    // Set both dates to midnight UTC to avoid timezone issues
    const sampleSendDateUTC = Date.UTC(
      sampleSendDate.getUTCFullYear(),
      sampleSendDate.getUTCMonth(),
      sampleSendDate.getUTCDate()
    );
    const referenceDateUTC = Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate()
    );
    leadTimeRemaining = Math.ceil(
      (sampleSendDateUTC - referenceDateUTC) / (1000 * 60 * 60 * 24)
    );
    // If DHLTracking date exceeds target date, leadTimeRemaining will be negative
  }

  // Fabric calculations
  let fabricRemaining: number | null = null;
  let fabricActualBadge: JSX.Element | null = null;

  if (row.fabricBooking && row.fabricBooking.completeDate) {
    if (row.fabricBooking.actualCompleteDate) {
      // Show days difference (negative = late, positive = early/0 day)
      const planned = new Date(row.fabricBooking.completeDate);
      const actual = new Date(row.fabricBooking.actualCompleteDate);
      const diffDays = Math.round(
        (planned.getTime() - actual.getTime()) / (1000 * 60 * 60 * 24)
      );
      const isFabricStepComplete = !!row.fabricBooking.actualCompleteDate;
      fabricActualBadge = (
        <span
          className={
            isFabricStepComplete
              ? "bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded"
              : diffDays < 0
              ? "text-red-500"
              : "bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded"
          }
        >
          {diffDays < 0
            ? `${diffDays} days `
            : diffDays > 0
            ? `+ ${Math.abs(diffDays)} days`
            : "0 day"}
        </span>
      );
    } else {
      // Show remaining days from today to planned complete date
      const completeDate = new Date(row.fabricBooking.completeDate);
      const today = new Date();
      fabricRemaining = Math.round(
        (completeDate.getTime() - today.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
      );
    }
  }

  // Sample calculations
  let sampleRemaining: number | null = null;
  let sampleActualBadge: JSX.Element | null = null;

  if (row.sampleDevelopment && row.sampleDevelopment.sampleCompleteDate) {
    if (row.sampleDevelopment.actualSampleCompleteDate) {
      // Show days difference (negative = late, positive = early/0 day)
      const planned = new Date(row.sampleDevelopment.sampleCompleteDate);
      const actual = new Date(row.sampleDevelopment.actualSampleCompleteDate);
      const diffDays = Math.round(
        (planned.getTime() - actual.getTime()) / (1000 * 60 * 60 * 24)
      );
      const isSampleStepComplete = !!row.sampleDevelopment.actualSampleCompleteDate;
      sampleActualBadge = (
        <span
          className={
            isSampleStepComplete
              ? "bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded"
              : diffDays < 0
              ? "text-red-500"
              : "bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded"
          }
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
      const completeDate = new Date(row.sampleDevelopment.sampleCompleteDate);
      const today = new Date();
      sampleRemaining = Math.round(
        (completeDate.getTime() - today.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
      );
    }
  }

  // Check if CAD, Fabric, and Sample are complete
  const isCadComplete = !!row.cad?.finalCompleteDate;
  const isFabricComplete = !!row.fabricBooking?.actualCompleteDate;
  const isSampleComplete = !!row.sampleDevelopment?.actualSampleCompleteDate;
  const canAddDHLTracking = isCadComplete && isFabricComplete && isSampleComplete;

  return {
    cadRemaining,
    cadActualBadge,
    leadTimeRemaining,
    fabricRemaining,
    fabricActualBadge,
    sampleRemaining,
    sampleActualBadge,
    isCadComplete,
    isFabricComplete,
    isSampleComplete,
    canAddDHLTracking,
  };
};