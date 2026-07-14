import api from "@/lib/axios";
import type { Employee } from "@/types";

interface ApiEmployee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  hire_date: string;
  base_salary: number;
  department_name: string;
  position_name: string;
  status_name: string;
  employeeId?: string;
  avatar?: string;
}

interface EmployeeListResponse {
  success: boolean;
  data: {
    employees: ApiEmployee[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  };
}

interface EmployeeDetailResponse {
  success: boolean;
  data: ApiEmployee & {
    department_id: number;
    position_id: number;
    status_id: number;
    created_at: string;
    updated_at: string;
  };
}

interface CreateEmployeePayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department_id: number;
  position_id: number;
  status_id: number;
  hire_date: string;
  base_salary: number;
}

function mapEmployee(raw: ApiEmployee): Employee {
  return {
    id: String(raw.id),
    name: `${raw.first_name} ${raw.last_name}`,
    email: raw.email,
    employeeId: `#EMP-${String(raw.id).padStart(5, "0")}`,
    department: raw.department_name,
    role: raw.position_name,
    status: raw.status_name as Employee["status"],
    phone: raw.phone ?? undefined,
    joinDate: raw.hire_date ? new Date(raw.hire_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : undefined,
    salary: raw.base_salary,
  };
}

export const usersService = {
  getEmployees: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    department_id?: number;
    status_id?: number;
  }): Promise<Employee[]> => {
    const { data } = await api.get<EmployeeListResponse>("/employees", { params });
    return data.data.employees.map(mapEmployee);
  },

  getEmployeeById: async (id: string): Promise<Employee | undefined> => {
    try {
      const { data } = await api.get<EmployeeDetailResponse>(`/employees/${id}`);
      return mapEmployee(data.data);
    } catch {
      return undefined;
    }
  },

  createEmployee: async (employee: Omit<Employee, "id">): Promise<Employee> => {
    // Map frontend shape → backend shape
    const [first_name, ...rest] = employee.name.split(" ");
    const last_name = rest.join(" ") || first_name;

    const payload: CreateEmployeePayload = {
      first_name,
      last_name,
      email: employee.email,
      phone: employee.phone,
      department_id: 1,  // default; real app would resolve from department name
      position_id: 1,
      status_id: 1,
      hire_date: new Date().toISOString().split("T")[0],
      base_salary: employee.salary ?? 0,
    };

    const { data } = await api.post<EmployeeDetailResponse>("/employees", payload);
    return mapEmployee(data.data);
  },

  updateEmployee: async (id: string, updates: Partial<CreateEmployeePayload>): Promise<Employee> => {
    const { data } = await api.put<EmployeeDetailResponse>(`/employees/${id}`, updates);
    return mapEmployee(data.data);
  },

  deleteEmployee: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },
};
