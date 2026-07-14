import type { PayrollStatus, EmployeeStatus } from "@/types";

type BadgeStatus = PayrollStatus | EmployeeStatus | string;

const STATUS_STYLES: Record<string, string> = {
  Paid: "bg-primary/10 text-primary",
  Active: "bg-primary/10 text-primary",
  Pending: "bg-tertiary-fixed-dim/20 text-tertiary",
  Processing: "bg-primary/10 text-primary",
  "On Leave": "bg-tertiary/10 text-tertiary",
  Terminated: "bg-error-container text-on-error-container",
  Draft: "bg-surface-variant text-on-surface-variant",
};

interface StatusBadgeProps {
  status: BadgeStatus;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const styles = STATUS_STYLES[status] ?? "bg-surface-variant text-on-surface-variant";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full font-label-sm font-semibold status-chip ${styles} ${className}`}
    >
      {status}
    </span>
  );
}
