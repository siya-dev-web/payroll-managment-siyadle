export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  hasLength: boolean;
  hasSpecial: boolean;
} {
  const hasLength = password.length >= 8;
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>0-9]/.test(password);
  return {
    isValid: hasLength && hasSpecial,
    hasLength,
    hasSpecial,
  };
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
