"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboardService.getStats(),
  });
}

export function useRecentPayroll() {
  return useQuery({
    queryKey: ["dashboard", "recent-payroll"],
    queryFn: () => dashboardService.getRecentPayroll(),
  });
}
