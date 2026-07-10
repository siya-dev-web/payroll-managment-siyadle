import api from "@/lib/axios";
import type { AuthCredentials, RegisterData, User } from "@/types";

export const authService = {
  login: async (credentials: AuthCredentials): Promise<{ user: User; token: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      user: {
        id: "1",
        name: "Alex Rivera",
        email: credentials.email,
        role: "Admin User",
      },
      token: "mock-jwt-token",
    };
  },

  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      user: {
        id: "1",
        name: data.fullName,
        email: data.email,
        role: "Admin User",
      },
      token: "mock-jwt-token",
    };
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return { message: `Reset link sent to ${email}` };
  },

  resetPassword: async (password: string): Promise<{ message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { message: "Password reset successfully" };
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout").catch(() => undefined);
  },
};
