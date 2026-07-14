import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

export function LoadingSpinner({ text = "Loading...", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}>
      <MaterialIcon icon="progress_activity" className="animate-spin text-primary text-[32px]" />
      <p className="font-body-md text-on-surface-variant">{text}</p>
    </div>
  );
}
