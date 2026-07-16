import { create } from "zustand";
import type { User } from "@/types";

const STORAGE_KEY = "payroll_auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  setAuth: (user: User, token?: string) => void;
  logout: () => void;
}

function readStoredAuth() {
  if (typeof window === "undefined") {
    return { user: null, isAuthenticated: false, token: null };
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return { user: null, isAuthenticated: false, token: null };

    const parsed = JSON.parse(stored) as { user?: User; token?: string };
    if (parsed.user && parsed.token) {
      return { user: parsed.user, isAuthenticated: true, token: parsed.token };
    }
  } catch {
    // Ignore malformed storage and fall back to logged-out state.
  }

  return { user: null, isAuthenticated: false, token: null };
}

export const useAuthStore = create<AuthState>()((set) => {
  const initial = readStoredAuth();

  return {
    user: initial.user,
    isAuthenticated: initial.isAuthenticated,
    token: initial.token,
    setAuth: (user, token) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token: token ?? null }));
      }
      set({ user, isAuthenticated: true, token: token ?? null });
    },
    logout: () => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEY);
      }
      set({ user: null, isAuthenticated: false, token: null });
    },
  };
});
