import axios, { AxiosHeaders } from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "development" ? "/api" : process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  try {
    const stored = window.localStorage.getItem("payroll_auth");
    if (!stored) return config;

    const parsed = JSON.parse(stored) as { token?: string };
    if (parsed.token) {
      const headers = new AxiosHeaders(config.headers);
      headers.set("Authorization", `Bearer ${parsed.token}`);
      config.headers = headers;
    }
  } catch {
    // Ignore malformed storage and continue without an auth header.
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default api;
