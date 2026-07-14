import api from "@/lib/axios";
import type { DashboardStats, PayrollRecord } from "@/types";

interface DashboardApiResponse {
  success: boolean;
  data: {
    total_employees: number;
    total_payroll_records: number;
    monthly_total: number;
    average_salary: number;
    employees_per_department: { department_name: string; employee_count: number }[];
    recent_payrolls: {
      id: number;
      employee_name: string;
      month: number;
      year: number;
      net_salary: number;
      status_name: string;
    }[];
  };
}

const MONTH_NAMES = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get<DashboardApiResponse>("/dashboard");
    const d = data.data;
    return {
      totalEmployees: d.total_employees,
      payrollRecords: d.total_payroll_records,
      monthlyPayroll: d.monthly_total,
      averageSalary: d.average_salary,
      employeeGrowth: 0, // Not tracked in current schema — placeholder
    };
  },

  getRecentPayroll: async (): Promise<PayrollRecord[]> => {
    const { data } = await api.get<DashboardApiResponse>("/dashboard");
    return data.data.recent_payrolls.map((r) => ({
      id: String(r.id),
      employeeName: r.employee_name,
      period: `${MONTH_NAMES[r.month]} ${r.year}`,
      amount: r.net_salary,
      status: r.status_name as PayrollRecord["status"],
    }));
  },
};
