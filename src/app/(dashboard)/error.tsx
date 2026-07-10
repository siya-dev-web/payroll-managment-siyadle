"use client";

import { useEffect } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="ml-[260px] min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center">
        <MaterialIcon icon="error" className="text-error text-[32px]" />
      </div>
      <h2 className="font-display-md text-on-surface">Something went wrong</h2>
      <p className="font-body-md text-on-surface-variant max-w-md text-center">{error.message}</p>
      <button
        className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-md hover:brightness-110 active:scale-95 transition-all"
        onClick={reset}
      >
        Try Again
      </button>
    </div>
  );
}
