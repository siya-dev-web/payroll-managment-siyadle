"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";

function AuthRehydrator({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    // Read persisted auth from localStorage synchronously on first client render.
    // This is synchronous so there is no async hang — just one paint cycle.
    try {
      const stored = window.localStorage.getItem("payroll_auth");
      if (stored) {
        const parsed = JSON.parse(stored) as { user?: import("@/types").User; token?: string };
        if (parsed.user && parsed.token) {
          setAuth(parsed.user, parsed.token);
        } else {
          logout();
        }
      }
    } catch {
      logout();
    }
    setReady(true);
  }, [setAuth, logout]);

  if (!ready) return null;

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthRehydrator>{children}</AuthRehydrator>
    </QueryClientProvider>
  );
}
