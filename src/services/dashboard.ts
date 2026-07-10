import type { DashboardStats, PayrollRecord } from "@/types";

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      totalEmployees: 1248,
      payrollRecords: 8420,
      monthlyPayroll: 142580,
      averageSalary: 4250,
      employeeGrowth: 12,
    };
  },

  getRecentPayroll: async (): Promise<PayrollRecord[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [
      { id: "1", employeeName: "Jordan Smith", period: "Oct 2024", amount: 5240, status: "Paid" },
      { id: "2", employeeName: "Emily Chen", period: "Oct 2024", amount: 4850, status: "Pending" },
      { id: "3", employeeName: "Marcus Thorne", period: "Sep 2024", amount: 6100, status: "Paid" },
      { id: "4", employeeName: "Sarah Johnson", period: "Sep 2024", amount: 4200, status: "Paid" },
    ];
  },
};
