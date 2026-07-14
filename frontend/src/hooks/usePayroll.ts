"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsService } from "@/services/products";

export function usePayrollRuns() {
  return useQuery({
    queryKey: ["payroll", "runs"],
    queryFn: () => productsService.getPayrollRuns(),
  });
}

export function useRunPayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      employeeId: number;
      bonus?: number;
      deduction?: number;
      periodId?: number;
    }) => productsService.runPayroll(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["payroll"] });
    },
  });
}
