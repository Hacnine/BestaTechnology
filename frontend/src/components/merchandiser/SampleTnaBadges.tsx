// Badge helpers for SampleTnaTable

export const getStatusBadge = (remaining: number | null) => {
  if (remaining === null) return null;
  if (remaining > 0) {
    return (
      <span className=" inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 font-medium">
        +{remaining} days
      </span>
    );
  } else if (remaining === 0) {
    return (
      <span className="-ml-0 inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 font-medium">
        0 days
      </span>
    );
  } else {
    return (
      <span className=" inline-block px-2 py-0.5 rounded bg-red-100 text-red-700 font-medium">
        -{Math.abs(remaining)} days
      </span>
    );
  }
};

export const getActualCompleteBadge = (actual: Date, planned: Date) => {
  const diff = Math.round((actual.getTime() - planned.getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) {
    return (
      <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
        {Math.abs(diff)} days
      </span>
    );
  } else {
    return (
      <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
        -{diff} days
      </span>
    );
  }
};
