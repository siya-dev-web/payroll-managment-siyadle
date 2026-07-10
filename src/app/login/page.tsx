"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { APP_NAME } from "@/constants";
import { useLogin } from "@/hooks/useAuth";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { email, password, remember },
      { onSuccess: () => router.push("/dashboard") },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-gutter bg-[#f8fafc]">
      <main className="w-full max-w-[440px]">
        <div className="login-card bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col gap-6">
          <header className="text-center space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
                <MaterialIcon icon="payments" className="text-[28px]" />
              </div>
            </div>
            <h1 className="font-display-md text-display-md text-on-surface tracking-tight">
              {APP_NAME}
            </h1>
            <p className="font-body-md text-on-surface-variant">
              Sign in to manage your enterprise payroll
            </p>
          </header>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <div className="space-y-1.5">
              <label className="font-label-md text-on-surface-variant ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <MaterialIcon
                  icon="mail"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                />
                <input
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-on-surface font-body-md"
                  id="email"
                  name="email"
                  placeholder="admin@enterprise.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="font-label-md text-on-surface-variant" htmlFor="password">
                  Password
                </label>
                <Link
                  className="font-label-sm text-primary hover:underline transition-all"
                  href="/forgot-password"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <MaterialIcon
                  icon="lock"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                />
                <input
                  className="w-full pl-10 pr-12 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-on-surface font-body-md"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  <MaterialIcon icon={showPassword ? "visibility_off" : "visibility"} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <input
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label
                className="font-label-md text-on-surface-variant cursor-pointer select-none"
                htmlFor="remember"
              >
                Remember me for 30 days
              </label>
            </div>

            <button
              className="w-full bg-[#2563eb] text-white py-3.5 rounded-lg font-label-md hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-md shadow-blue-500/10 mt-2 flex items-center justify-center gap-2 disabled:opacity-70"
              type="submit"
              disabled={login.isPending}
            >
              {login.isPending ? (
                <>
                  <MaterialIcon icon="progress_activity" className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <span>Login</span>
                  <MaterialIcon icon="arrow_forward" className="text-[18px]" />
                </>
              )}
            </button>
          </form>

          <footer className="pt-4 border-t border-outline-variant/50 text-center">
            <p className="font-body-md text-on-surface-variant">
              New to {APP_NAME}?{" "}
              <Link className="text-primary font-label-md hover:underline ml-1" href="/register">
                Register for an account
              </Link>
            </p>
          </footer>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 opacity-60">
          <p className="font-label-sm text-on-surface-variant">
            © 2024 {APP_NAME}. Enterprise Grade Security.
          </p>
        </div>
      </main>
    </div>
  );
}
