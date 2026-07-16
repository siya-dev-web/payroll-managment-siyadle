"use client";

import { useAuthRehydrate } from "@/hooks/useAuthRehydrate";
import type { ReactNode } from "react";

export function AuthLoader({ children }: { children: ReactNode }) {
  const { loading } = useAuthRehydrate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-background">
        <p className="text-lg font-medium">Loading authentication status…</p>
      </div>
    );
  }

  return <>{children}</>;
}
