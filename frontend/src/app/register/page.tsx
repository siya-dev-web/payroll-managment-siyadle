"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { APP_NAME } from "@/constants";
import { useRegister } from "@/hooks/useAuth";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { extractApiError } from "@/utils";

const INPUT_CLASS =
  "w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface font-body-md";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const update = (field: string, value: string | boolean) => {
    setErrorMessage("");
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!form.terms) {
      setErrorMessage("Please accept the terms and conditions.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    register.mutate(form, {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 1000);
      },
      onError: (error: unknown) => {
        setErrorMessage(extractApiError(error));
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#f8fafc]">
      <main className="w-full max-w-[480px]">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-6 md:p-8">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-container text-on-primary mb-2">
              <MaterialIcon icon="payments" className="text-[28px]" />
            </div>
            <h1 className="font-display-md text-display-md text-on-surface mb-1">
              Create Account
            </h1>
            <p className="font-body-md text-on-surface-variant">
              Join {APP_NAME} to manage your enterprise team.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="font-label-md text-on-surface-variant" htmlFor="fullName">
                Full Name
              </label>
              <div className="relative">
                <MaterialIcon
                  icon="person"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]"
                />
                <input
                  className={INPUT_CLASS}
                  id="fullName"
                  placeholder="John Doe"
                  required
                  type="text"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="font-label-md text-on-surface-variant" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <MaterialIcon
                  icon="mail"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]"
                />
                <input
                  className={INPUT_CLASS}
                  id="email"
                  placeholder="name@company.com"
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>
            </div>

            {/* Password grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-label-md text-on-surface-variant" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <MaterialIcon
                    icon="lock"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]"
                  />
                  <input
                    className="w-full pl-10 pr-10 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface font-body-md"
                    id="password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    <MaterialIcon icon={showPassword ? "visibility_off" : "visibility"} />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-label-md text-on-surface-variant" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <MaterialIcon
                    icon="lock_reset"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]"
                  />
                  <input
                    className={`w-full pl-10 pr-10 py-3 bg-surface-container-low border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface font-body-md ${
                      form.confirmPassword && form.password !== form.confirmPassword
                        ? "border-error"
                        : "border-outline-variant"
                    }`}
                    id="confirmPassword"
                    placeholder="••••••••"
                    required
                    type={showConfirm ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                    onClick={() => setShowConfirm((s) => !s)}
                  >
                    <MaterialIcon icon={showConfirm ? "visibility_off" : "visibility"} />
                  </button>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 py-1">
              <input
                className="mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                id="terms"
                type="checkbox"
                checked={form.terms}
                onChange={(e) => update("terms", e.target.checked)}
              />
              <label
                className="font-body-md text-label-sm text-on-surface-variant cursor-pointer"
                htmlFor="terms"
              >
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

            {/* Error banner */}
            {errorMessage && (
              <div className="flex items-start gap-2 p-3 bg-error-container/30 border border-error/30 rounded-lg">
                <MaterialIcon icon="error" className="text-error text-[20px] shrink-0 mt-0.5" />
                <p className="font-body-md text-on-error-container flex-1">{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => setErrorMessage("")}
                  className="text-error hover:opacity-70 shrink-0"
                >
                  <MaterialIcon icon="close" className="text-[16px]" />
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              className={`w-full mt-2 py-3.5 rounded-lg font-label-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-md ${
                success
                  ? "bg-green-600 text-white"
                  : "bg-primary-container text-on-primary hover:brightness-110"
              }`}
              type="submit"
              disabled={register.isPending || success}
            >
              {register.isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : success ? (
                <>
                  <MaterialIcon icon="check_circle" className="text-[20px]" />
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

          <div className="mt-8 text-center border-t border-outline-variant/50 pt-6">
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
