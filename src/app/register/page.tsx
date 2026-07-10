"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { APP_NAME } from "@/constants";
import { useRegister } from "@/hooks/useAuth";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function RegisterPage() {
  const router = useRouter();
  const register = useRegister();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return;
    register.mutate(form, {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 1000);
      },
    });
  };

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen flex items-center justify-center p-margin-mobile md:p-8 bg-[#f8fafc]">
      <main className="relative z-10 w-full max-w-[480px]">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-container text-on-primary mb-2">
              <MaterialIcon icon="payments" className="text-[28px]" />
            </div>
            <h1 className="font-display-md text-display-md text-on-surface mb-1">Create Account</h1>
            <p className="font-body-md text-on-surface-variant">
              Join {APP_NAME} to manage your enterprise team.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="font-label-md text-on-surface" htmlFor="fullName">
                Full Name
              </label>
              <div className="relative">
                <MaterialIcon
                  icon="person"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]"
                />
                <input
                  className="block w-full pl-10 pr-3 py-3 border border-outline-variant rounded-lg font-body-md bg-surface-bright text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  id="fullName"
                  placeholder="John Doe"
                  required
                  type="text"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-label-md text-on-surface" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <MaterialIcon
                  icon="mail"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]"
                />
                <input
                  className="block w-full pl-10 pr-3 py-3 border border-outline-variant rounded-lg font-body-md bg-surface-bright text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  id="email"
                  placeholder="name@company.com"
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-label-md text-on-surface" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <MaterialIcon
                    icon="lock"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]"
                  />
                  <input
                    className="block w-full pl-10 pr-3 py-3 border border-outline-variant rounded-lg font-body-md bg-surface-bright text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    id="password"
                    placeholder="••••••••"
                    required
                    type="password"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-label-md text-on-surface" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <MaterialIcon
                    icon="lock_reset"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]"
                  />
                  <input
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg font-body-md bg-surface-bright text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${form.confirmPassword && form.password !== form.confirmPassword ? "border-error" : "border-outline-variant"}`}
                    id="confirmPassword"
                    placeholder="••••••••"
                    required
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 py-1">
              <input
                className="mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary-container"
                id="terms"
                required
                type="checkbox"
                checked={form.terms}
                onChange={(e) => update("terms", e.target.checked)}
              />
              <label className="font-body-md text-label-sm text-on-surface-variant" htmlFor="terms">
                I agree to the{" "}
                <a className="text-primary hover:underline" href="#">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a className="text-primary hover:underline" href="#">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            <button
              className={`w-full font-label-md py-3 rounded-lg shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200 mt-2 flex items-center justify-center gap-2 disabled:opacity-70 ${success ? "bg-green-600 text-white" : "bg-primary-container text-on-primary"}`}
              type="submit"
              disabled={register.isPending || success}
            >
              {register.isPending ? (
                <>
                  <MaterialIcon icon="progress_activity" className="animate-spin" />
                  Processing...
                </>
              ) : success ? (
                <>
                  <MaterialIcon icon="check_circle" />
                  Success!
                </>
              ) : (
                <>
                  Create Account
                  <MaterialIcon icon="arrow_forward" className="text-[20px]" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="font-body-md text-on-surface-variant">
              Already have an account?{" "}
              <Link className="text-primary font-label-md hover:underline" href="/login">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
