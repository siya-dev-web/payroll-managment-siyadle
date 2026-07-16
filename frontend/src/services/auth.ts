import api from "@/lib/axios";
import type { AuthCredentials, RegisterData, User } from "@/types";

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      full_name: string;
      email: string;
      is_verified: number;
    };
    token: string;
  };
}

interface MeResponse {
  success: boolean;
  data: {
    id: number;
    full_name: string;
    email: string;
    is_verified: number;
    created_at: string;
  };
}

function mapUser(raw: AuthResponse["data"]["user"]): User {
  return {
    id: String(raw.id),
    name: raw.full_name,
    email: raw.email,
    role: "Admin User",
  };
}

export const authService = {
  login: async (credentials: AuthCredentials): Promise<{ user: User; token: string }> => {
    const { data } = await api.post<AuthResponse>("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    return {
      user: mapUser(data.data.user),
      token: data.data.token,
    };
  },

  register: async (formData: RegisterData): Promise<{ user: User; token: string }> => {
    const { data } = await api.post<AuthResponse>("/auth/register", {
      full_name: formData.fullName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    return {
      user: mapUser(data.data.user),
      token: data.data.token,
    };
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get<MeResponse>("/auth/me");
    return {
      id: String(data.data.id),
      name: data.data.full_name,
      email: data.data.email,
      role: "Admin User",
    };
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const { data } = await api.post<{ success: boolean; message: string }>(
      "/auth/forgot-password",
      { email },
    );
    return { message: data.message };
  },

  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const { data } = await api.post<{ success: boolean; message: string }>("/auth/reset-password", {
      token,
      password,
    });
    return { message: data.message };
  },

  logout: async (): Promise<void> => {
    // JWT is stateless — no server endpoint needed. Token is cleared client-side.
  },
};
