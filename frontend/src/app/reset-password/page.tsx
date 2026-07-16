"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { APP_NAME } from "@/constants";
import { useResetPassword } from "@/hooks/useAuth";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

// ─── Password strength helpers ────────────────────────────────────────────────

function getStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length > 8) score += 25;
  if (password.match(/[A-Z]/)) score += 25;
  if (password.match(/[0-9]/)) score += 25;
  if (password.match(/[^A-Za-z0-9]/)) score += 25;
  if (score <= 25) return { score, label: "Weak",   color: "bg-error"   };
  if (score <= 75) return { score, label: "Medium", color: "bg-tertiary" };
  return              { score, label: "Strong", color: "bg-primary"  };
}

function strengthTextColor(label: string): string {
  if (label === "Weak")   return "text-error";
  if (label === "Medium") return "text-tertiary";
  return "text-primary";
}

// ─── Success overlay ──────────────────────────────────────────────────────────

function SuccessOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm">
      <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-2xl max-w-[360px] w-full text-center mx-4">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <MaterialIcon icon="check_circle" className="text-[40px]" filled />
        </div>
        <h2 className="font-display-md text-display-md text-on-surface mb-2">
          Password Updated
        </h2>
        <p className="font-body-md text-on-surface-variant mb-8">
          Your password has been successfully reset. You will be redirected to the login
          screen in 3 seconds.
        </p>
        <button
          className="w-full py-3 bg-primary-container text-on-primary font-label-md rounded-[10px] hover:brightness-110 active:scale-[0.98] transition-all"
          onClick={onClose}
        >
          Return to Login Now
        </button>
      </div>
    </div>
  );
}

// ─── Inner form — must be inside Suspense because it uses useSearchParams ─────

function ResetPasswordForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const resetPassword = useResetPassword();

  // 1. Read the token from the URL query string into React state.
  //    This is the ONLY place the token ever lives on the client.
  const [token] = useState<string>(() => searchParams.get("token") ?? "");

  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew,         setShowNew]         = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [validationError, setValidationError] = useState("");
  const [showSuccess,     setShowSuccess]     = useState(false);

  // Token remains visible in the URL — intentional.

  // 3. Show an error immediately if the page was opened without a token
  //    (e.g. someone navigated to /reset-password directly).
  useEffect(() => {
    if (!token) {
      setValidationError(
        "No reset token found. Please use the link from your email.",
      );
    }
  }, [token]);

  const strength = getStrength(newPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!token) {
      setValidationError("No reset token found. Please use the link from your email.");
      return;
    }
    if (newPassword.length < 8) {
      setValidationError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    // 4. Submit — token comes from React state, never from a visible input.
    resetPassword.mutate(
      { token, password: newPassword },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => router.push("/login"), 3000);
        },
        onError: (err: unknown) => {
          const message =
            err instanceof Error
              ? err.message
              : "Token is invalid or has expired. Please request a new one.";
          setValidationError(message);
        },
      },
    );
  };

  return (
    <>
      {showSuccess && <SuccessOverlay onClose={() => router.push("/login")} />}

      {/* Background blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">

        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <MaterialIcon icon="payments" className="text-on-primary text-display-md" filled />
          </div>
          <h1 className="font-display-md text-display-md text-on-surface tracking-tight">
            {APP_NAME}
          </h1>
          <p className="font-body-md text-on-surface-variant mt-1 text-center px-6">
            Choose a new password for your account.
          </p>
        </div>

        {/* Card */}
        <div className="auth-card bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                Reset Password
              </h2>
              <p className="font-body-md text-on-surface-variant mt-1">
                Enter and confirm your new password below.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>

              {/* ── New Password ── */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label
                    className="font-label-md text-label-md text-on-surface-variant"
                    htmlFor="newPassword"
                  >
                    New Password
                  </label>
                  {newPassword && (
                    <span className={`font-label-sm text-label-sm ${strengthTextColor(strength.label)}`}>
                      {strength.label}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <MaterialIcon
                    icon="lock"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]"
                  />
                  <input
                    className="w-full pl-10 pr-12 py-3 bg-surface border border-outline-variant rounded-[10px] font-body-md text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    id="newPassword"
                    placeholder="Min. 8 characters"
                    required
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setValidationError(""); }}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                    onClick={() => setShowNew((s) => !s)}
                    type="button"
                    aria-label={showNew ? "Hide password" : "Show password"}
                  >
                    <MaterialIcon icon={showNew ? "visibility_off" : "visibility"} className="text-[20px]" />
                  </button>
                </div>
                {/* Strength bar */}
                <div className="h-1 w-full bg-surface-container rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${strength.color}`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>

              {/* ── Confirm Password ── */}
              <div className="space-y-1">
                <label
                  className="font-label-md text-label-md text-on-surface-variant"
                  htmlFor="confirmPassword"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <MaterialIcon
                    icon="verified_user"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]"
                  />
                  <input
                    className="w-full pl-10 pr-12 py-3 bg-surface border border-outline-variant rounded-[10px] font-body-md text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    id="confirmPassword"
                    placeholder="Repeat your new password"
                    required
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setValidationError(""); }}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                    onClick={() => setShowConfirm((s) => !s)}
                    type="button"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    <MaterialIcon icon={showConfirm ? "visibility_off" : "visibility"} className="text-[20px]" />
                  </button>
                </div>
              </div>

              {/* ── Validation error ── */}
              {validationError && (
                <div className="flex items-start gap-2 p-3 bg-error-container/30 border border-error/20 rounded-lg">
                  <MaterialIcon icon="error" className="text-error text-[20px] shrink-0 mt-0.5" />
                  <p className="font-body-md text-on-error-container">{validationError}</p>
                </div>
              )}

              {/* ── Requirements checklist ── */}
              <ul className="space-y-1 text-label-sm font-label-sm text-on-surface-variant/60">
                <li className={`flex items-center gap-2 transition-colors ${newPassword.length >= 8 ? "text-primary" : ""}`}>
                  <MaterialIcon icon={newPassword.length >= 8 ? "check_circle" : "circle"} className="text-[14px]" filled={newPassword.length >= 8} />
                  At least 8 characters long
                </li>
                <li className={`flex items-center gap-2 transition-colors ${/[A-Z]/.test(newPassword) ? "text-primary" : ""}`}>
                  <MaterialIcon icon={/[A-Z]/.test(newPassword) ? "check_circle" : "circle"} className="text-[14px]" filled={/[A-Z]/.test(newPassword)} />
                  Contains at least one uppercase letter
                </li>
                <li className={`flex items-center gap-2 transition-colors ${/[0-9]/.test(newPassword) ? "text-primary" : ""}`}>
                  <MaterialIcon icon={/[0-9]/.test(newPassword) ? "check_circle" : "circle"} className="text-[14px]" filled={/[0-9]/.test(newPassword)} />
                  Contains at least one number
                </li>
              </ul>

              {/* ── Submit ── */}
              <button
                className="w-full py-3.5 bg-primary-container text-on-primary font-label-md rounded-[10px] flex items-center justify-center gap-2 hover:bg-primary active:scale-[0.98] transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={resetPassword.isPending || !token}
              >
                {resetPassword.isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <MaterialIcon icon="arrow_forward" className="text-[18px]" />
                  </>
                )}
              </button>
            </form>

            {/* Back to login */}
            <div className="mt-8 flex flex-col items-center pt-8 border-t border-outline-variant">
              <Link
                href="/login"
                className="group flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-md"
              >
                <MaterialIcon icon="arrow_back" className="text-[18px] group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-between items-center px-4 text-on-surface-variant/60 font-label-sm">
          <p>© 2024 {APP_NAME}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary underline decoration-transparent hover:decoration-primary transition-all">Support</a>
            <a href="#" className="hover:text-primary underline decoration-transparent hover:decoration-primary transition-all">Privacy</a>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc]">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-on-surface-variant font-body-md">
            <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
