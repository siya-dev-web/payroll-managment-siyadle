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

/**
 * Extract a human-readable error message from an Axios error.
 *
 * The backend returns two possible shapes:
 *
 * Validation error (422):
 *   { success: false, message: "Validation failed.", errors: [{ field, message }] }
 *
 * General error (4xx / 5xx):
 *   { success: false, message: "Something went wrong." }
 *
 * Returns a single string ready to display in the UI.
 */
export function extractApiError(error: unknown): string {
  if (!error || typeof error !== "object") return "An unexpected error occurred.";

  const err = error as {
    response?: {
      data?: {
        message?: string;
        errors?: { field?: string; message?: string }[];
      };
    };
    message?: string;
  };

  const data = err.response?.data;
  if (!data) return err.message ?? "An unexpected error occurred.";

  // If there are field-level validation errors, join them all into one message.
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors
      .map((e) => (e.field ? `${e.field}: ${e.message}` : e.message))
      .filter(Boolean)
      .join(" • ");
  }

  return data.message ?? "An unexpected error occurred.";
}
