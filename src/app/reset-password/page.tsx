"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { APP_NAME } from "@/constants";
import { useResetPassword } from "@/hooks/useAuth";
import { validatePassword } from "@/utils";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function ResetPasswordPage() {
  const router = useRouter();
  const resetPassword = useResetPassword();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const validation = validatePassword(newPassword);
  const strength = (validation.hasLength ? 50 : 0) + (validation.hasSpecial ? 50 : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    resetPassword.mutate(newPassword, {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-gutter bg-[#f8fafc]">
      <main className="w-full max-w-[440px]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <MaterialIcon icon="payments" className="text-white text-3xl" filled />
          </div>
          <h1 className="font-display-md text-display-md text-on-surface tracking-tight">
            {APP_NAME}
          </h1>
          <p className="font-body-md text-on-surface-variant/70 mt-1 text-center">
            Secure Enterprise Access Control
          </p>
        </div>

        <div className="auth-card p-8">
          <div className="mb-6">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Reset Password</h2>
            <p className="font-body-md text-on-surface-variant mt-1">
              Please enter your new password to regain access to your administrator account.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="font-label-md text-on-surface-variant" htmlFor="newPassword">
                New Password
              </label>
              <div className="relative">
                <MaterialIcon
                  icon="lock"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                />
                <input
                  className="w-full pl-10 pr-12 py-3 bg-white border border-outline-variant rounded-[10px] font-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  id="newPassword"
                  placeholder="Min. 8 characters"
                  required
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface-variant p-1"
                  onClick={() => setShowNew(!showNew)}
                  type="button"
                >
                  <MaterialIcon icon={showNew ? "visibility_off" : "visibility"} className="text-[20px]" />
                </button>
              </div>
              <div className="flex gap-1 mt-1 px-1">
                <div className="h-1 flex-1 bg-surface-variant rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${strength === 100 ? "bg-primary" : "bg-error"}`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-label-md text-on-surface-variant" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <div className="relative">
                <MaterialIcon
                  icon="verified_user"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                />
                <input
                  className="w-full pl-10 pr-12 py-3 bg-white border border-outline-variant rounded-[10px] font-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  id="confirmPassword"
                  placeholder="Repeat your password"
                  required
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface-variant p-1"
                  onClick={() => setShowConfirm(!showConfirm)}
                  type="button"
                >
                  <MaterialIcon icon={showConfirm ? "visibility_off" : "visibility"} className="text-[20px]" />
                </button>
              </div>
            </div>

            <ul className="space-y-1 text-label-sm font-label-sm text-on-surface-variant/60">
              <li className={`flex items-center gap-2 ${validation.hasLength ? "text-primary" : ""}`}>
                <MaterialIcon icon={validation.hasLength ? "check_circle" : "circle"} className="text-[14px]" />
                At least 8 characters long
              </li>
              <li className={`flex items-center gap-2 ${validation.hasSpecial ? "text-primary" : ""}`}>
                <MaterialIcon icon={validation.hasSpecial ? "check_circle" : "circle"} className="text-[14px]" />
                Contains a special character or number
              </li>
            </ul>

            <button
              className={`w-full py-3 px-6 font-label-md rounded-[10px] shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 ${success ? "bg-tertiary-container text-on-tertiary-container" : "bg-[#2563eb] text-white hover:bg-primary-container"}`}
              type="submit"
              disabled={resetPassword.isPending || success}
            >
              {resetPassword.isPending ? (
                <>
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  <span>Updating...</span>
                </>
              ) : success ? (
                <>
                  <MaterialIcon icon="check_circle" />
                  <span>Success! Redirecting...</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <MaterialIcon icon="arrow_forward" className="text-[18px]" />
                </>
              )}
            </button>

            <div className="text-center mt-4">
              <Link
                className="font-label-sm text-primary hover:underline flex items-center justify-center gap-1"
                href="/login"
              >
                <MaterialIcon icon="arrow_back" className="text-[14px]" />
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
