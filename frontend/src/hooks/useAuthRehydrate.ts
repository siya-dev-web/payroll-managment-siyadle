"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types";

export function useAuthRehydrate() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);
  const [loading, setLoading] = useState(true);

  useQuery<User>({
    queryKey: ["auth", "me"],
    queryFn: authService.getMe,
    retry: false,
    onSuccess: (user) => {
      setAuth(user);
      setLoading(false);
    },
    onError: () => {
      logout();
      setLoading(false);
    },
    enabled: true,
  });

  return { loading };
}
