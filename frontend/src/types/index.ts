export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  role: string;
  status: "Active" | "On Leave" | "Terminated";
  avatar?: string;
  phone?: string;
  joinDate?: string;
  salary?: number;
}

export interface PayrollRecord {
  id: string;
  employeeName: string;
  period: string;
  amount: number;
  status: "Paid" | "Pending" | "Processing";
}

export interface DashboardStats {
  totalEmployees: number;
  payrollRecords: number;
  monthlyPayroll: number;
  averageSalary: number;
  employeeGrowth: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export type PayrollStatus = "Paid" | "Pending" | "Processing";
export type EmployeeStatus = "Active" | "On Leave" | "Terminated";
