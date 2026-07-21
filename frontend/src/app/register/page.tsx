"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { APP_NAME } from "@/constants";
import { useRegister } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { extractApiError } from "@/utils";
import {
  Wallet,
  User,
  Mail,
  Lock,
  KeyRound,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

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
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
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

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#f8fafc]">
      <main className="relative z-10 w-full max-w-[480px]">
        <Card className="shadow-lg">
          <CardContent className="p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground mb-2">
                <Wallet className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">Create Account</h1>
              <p className="text-sm text-muted-foreground">
                Join {APP_NAME} to manage your enterprise team.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    required
                    type="text"
                    className="pl-10"
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    placeholder="name@company.com"
                    required
                    type="email"
                    className="pl-10"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      placeholder="••••••••"
                      required
                      type="password"
                      className="pl-10"
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      placeholder="••••••••"
                      required
                      type="password"
                      className={cn(
                        "pl-10",
                        form.confirmPassword &&
                          form.password !== form.confirmPassword &&
                          "border-destructive focus-visible:ring-destructive",
                      )}
                      value={form.confirmPassword}
                      onChange={(e) => update("confirmPassword", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 py-1">
                <Checkbox
                  id="terms"
                  required
                  className="mt-1"
                  checked={form.terms}
                  onCheckedChange={(checked) => update("terms", checked === true)}
                />
                <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
                  I agree to the{" "}
                  <a className="text-primary hover:underline" href="#">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a className="text-primary hover:underline" href="#">
                    Privacy Policy
                  </a>
                  .
                </Label>
              </div>

              {errorMessage ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {errorMessage}
                </div>
              ) : null}

              <Button
                type="submit"
                disabled={register.isPending || success}
                className={cn(
                  "w-full mt-2 gap-2",
                  success && "bg-green-600 hover:bg-green-600 text-white",
                )}
              >
                {register.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Success!
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link className="text-primary font-medium hover:underline" href="/login">
                  Log in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
