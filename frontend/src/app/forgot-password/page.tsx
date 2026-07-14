"use client";

import Link from "next/link";
import { useState } from "react";
import { APP_NAME } from "@/constants";
import { useForgotPassword } from "@/hooks/useAuth";
import { validateEmail } from "@/utils";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
    forgotPassword.mutate(email, { onSuccess: () => setSuccess(true) });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-gutter bg-[#f8fafc]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <main className="w-full max-w-[440px]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-on-primary-container">
              <MaterialIcon icon="payments" filled />
            </div>
            <h1 className="font-display-md text-display-md text-on-surface">{APP_NAME}</h1>
          </div>
        </div>

        <div className="auth-card p-8">
          {!success ? (
            <>
              <div className="text-center mb-6">
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                  Forgot Password?
                </h2>
                <p className="font-body-md text-on-surface-variant/80">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <div className="relative">
                  <label
                    className="block font-label-md text-on-surface-variant mb-1.5"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <MaterialIcon
                      icon="mail"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                    />
                    <input
                      aria-required
                      className={`form-input-payroll font-body-md ${emailError ? "border-error" : ""}`}
                      id="email"
                      placeholder="name@company.com"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(false);
                      }}
                    />
                  </div>
                  {emailError && (
                    <div className="mt-1.5 text-error font-label-sm">
                      Please enter a valid email address.
                    </div>
                  )}
                </div>

                <button
                  className="w-full btn-primary-payroll py-3 font-label-md flex items-center justify-center gap-2 disabled:opacity-70"
                  type="submit"
                  disabled={forgotPassword.isPending}
                >
                  {forgotPassword.isPending ? (
                    <MaterialIcon icon="progress_activity" className="animate-spin" />
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <MaterialIcon icon="arrow_forward" className="!text-[18px]" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <Link
                    className="inline-flex items-center gap-1.5 font-label-md text-on-surface-variant hover:text-primary transition-colors"
                    href="/login"
                  >
                    <MaterialIcon icon="arrow_back" className="!text-[18px]" />
                    Back to Login
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                <MaterialIcon icon="check_circle" className="!text-[32px]" filled />
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                Check your email
              </h3>
              <p className="font-body-md text-on-surface-variant/80 mb-6">
                We&apos;ve sent a password reset link to{" "}
                <span className="font-bold text-on-surface">{email}</span>.
              </p>
              <button
                className="font-label-md text-primary hover:underline"
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
              >
                Didn&apos;t receive the email? Click to retry
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
