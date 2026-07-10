import type { PayrollRecord } from "@/types";

export const productsService = {
  getPayrollRuns: async (): Promise<PayrollRecord[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [
      { id: "1", employeeName: "Jordan Smith", period: "Oct 01-15, 2024", amount: 5240, status: "Paid" },
      { id: "2", employeeName: "Emily Chen", period: "Oct 01-15, 2024", amount: 4850, status: "Pending" },
      { id: "3", employeeName: "Marcus Thorne", period: "Oct 01-15, 2024", amount: 6100, status: "Processing" },
      { id: "4", employeeName: "Sarah Johnson", period: "Oct 01-15, 2024", amount: 4200, status: "Paid" },
      { id: "5", employeeName: "Elena Zhao", period: "Oct 01-15, 2024", amount: 4400, status: "Pending" },
    ];
  },

  runPayroll: async (): Promise<{ message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { message: "Payroll processed successfully" };
  },
};
