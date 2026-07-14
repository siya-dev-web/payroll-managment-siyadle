import api from "@/lib/axios";
import type { PayrollRecord } from "@/types";

interface ApiPayroll {
  id: number;
  employee_name: string;
  month: number;
  year: number;
  net_salary: number;
  status_name: string;
  base_salary: number;
  bonus: number;
  deduction: number;
  generated_by_name: string;
}

interface PayrollListResponse {
  success: boolean;
  data: {
    payrolls: ApiPayroll[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  };
}

interface CreatePayrollPayload {
  employeeId?: number;
  employee_id?: number;
  month?: number;
  year?: number;
  bonus?: number;
  deduction?: number;
  periodId?: number;
  status_id?: number;
}

const MONTH_NAMES = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function mapPayroll(raw: ApiPayroll): PayrollRecord {
  return {
    id: String(raw.id),
    employeeName: raw.employee_name,
    period: `${MONTH_NAMES[raw.month]} ${raw.year}`,
    amount: raw.net_salary,
    status: raw.status_name as PayrollRecord["status"],
  };
}

export const productsService = {
  getPayrollRuns: async (): Promise<PayrollRecord[]> => {
    const { data } = await api.get<PayrollListResponse>("/payroll");
    return data.data.payrolls.map(mapPayroll);
  },

  runPayroll: async (payload?: CreatePayrollPayload): Promise<{ message: string }> => {
    if (!payload) return { message: "Payroll processed successfully" };

    const normalizedPayload = {
      employee_id: payload.employee_id ?? payload.employeeId,
      month: payload.month ?? new Date().getMonth() + 1,
      year: payload.year ?? new Date().getFullYear(),
      bonus: payload.bonus ?? 0,
      deduction: payload.deduction ?? 0,
      status_id: payload.status_id ?? 1,
      ...(payload.periodId !== undefined ? { period_id: payload.periodId } : {}),
    };

    await api.post("/payroll", normalizedPayload);
    return { message: "Payroll processed successfully" };
  },
};
