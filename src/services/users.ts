import type { Employee } from "@/types";

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    email: "sarah.j@payrollpro.com",
    employeeId: "#EMP-20412",
    department: "Engineering",
    role: "Senior Frontend Dev",
    status: "Active",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBv8WDWQ_8RnlvZKio0zWlLJBYvpfxozo1CzsvId1iylWItlQVmGuTrEizDvDic5Zk8vhJs47d2GnxuxntJ9HFvNxQz_ZR4ky8nU6BBuzP6B76uY1MEs0dGsrH8DHyoGXc6GYM-SiH0C6ovYSsDxM0al7uypSH17WD8l5HZdnkICOSuxwo5JSfN4l5-f2hOpZ2z88wQzbxmsD_H3IpBUmJAs2LVuFJV8bUJg5n0S1m7I2ikSzakOW6glzJutazQ_LhKVCrQu2KZgO8",
    phone: "+1 (555) 123-4567",
    joinDate: "Jan 15, 2022",
    salary: 95000,
  },
  {
    id: "2",
    name: "Marcus Thorne",
    email: "marcus.t@payrollpro.com",
    employeeId: "#EMP-20415",
    department: "Product",
    role: "Lead Product Manager",
    status: "Active",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDY7z5ql6jWzu5hUT7rRXi7-TvXNUn6Dduwt7r_iQoRpm34rye0r2W3pw_MnBQn4_Rjvu__09JlT-phtVaaSL6lxzRPiLeXI9uC3Ke-iBID0QWBScrYX1b3BSHN-XmoUw2ItAlD4X3MkWY4vnBfGAc3KcSTD-DX-9-GMy9lMf34WKWqpqf_f_3PMWkYbXnvUDcWLVz5Sao5e82aohzUoQJ-ErSsQfXxz2PwoM3uoeXv23g8nRNILafmZSyXo22ofulnPeYy3UxOmWc",
    phone: "+1 (555) 234-5678",
    joinDate: "Mar 22, 2021",
    salary: 110000,
  },
  {
    id: "3",
    name: "Elena Zhao",
    email: "elena.z@payrollpro.com",
    employeeId: "#EMP-20398",
    department: "Design",
    role: "UX Strategist",
    status: "On Leave",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAyBGZ4MsMyK_yVMYh3Gz0KWsHCwrPCEyQow7ChtZnF2TtBbXzLUXOH94oCQhRAjQ1fxV29dJ4R4X1ejAbjipeB5_WPdNdlV5IQwjC7A3kUiM6m4QWhdMlGCR97pDqEVzok-J2wEU6439cLmXZVXJy6DZNKpVMK69SeZHZbWBH8M1_vphy237ulOVOtgbVb3iEzZd5HFdpY6jlw4ilB31P-LZA7A_SU_H-kWFApBy44qKIFUhc43J1PooCxWhJ6Bnk5j6oUR87eANw",
    phone: "+1 (555) 345-6789",
    joinDate: "Aug 10, 2023",
    salary: 88000,
  },
  {
    id: "4",
    name: "David Miller",
    email: "david.m@payrollpro.com",
    employeeId: "#EMP-20422",
    department: "Marketing",
    role: "Content Director",
    status: "Active",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBYPqU0I0nahFZERkAxUr47ILwKEMUGimnCdJavtOKAhpQxbjQr1E7ejOHDIHBxfvsvnfLky0LWISHf9boFm6JxI4OhlW7i2uMAuruoT1x-5tEiJo1NfydedwLPAB_TPywNlP8wrUjiakHB5A8-s7u-63qVcjj2Lh6VvojA0y9MyijJO6t9NL1DjSVEShEijCx6-q9xAJwvFJ4YoAOmsA7gVKIEdHNWpukl1ljPKJSv_2uwY7Dp-eYmBHtBeS8AoXPvXGHjIFG8Aw",
    phone: "+1 (555) 456-7890",
    joinDate: "Nov 5, 2020",
    salary: 92000,
  },
];

export const usersService = {
  getEmployees: async (): Promise<Employee[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_EMPLOYEES;
  },

  getEmployeeById: async (id: string): Promise<Employee | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_EMPLOYEES.find((e) => e.id === id);
  },

  createEmployee: async (employee: Omit<Employee, "id">): Promise<Employee> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return { ...employee, id: String(Date.now()) };
  },
};
