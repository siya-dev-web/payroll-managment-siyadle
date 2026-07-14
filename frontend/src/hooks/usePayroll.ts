"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/products";

export function usePayrollRuns() {
  return useQuery({
    queryKey: ["payroll", "runs"],
    queryFn: () => productsService.getPayrollRuns(),
  });
}

export function useRunPayroll() {
  return useMutation({
    mutationFn: () => productsService.runPayroll(),
  });
}
