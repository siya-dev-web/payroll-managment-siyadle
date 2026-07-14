import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
}

export function EmptyState({ icon = "inbox", title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
        <MaterialIcon icon={icon} className="text-outline text-[32px]" />
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">{title}</h3>
      {description && (
        <p className="font-body-md text-on-surface-variant max-w-md">{description}</p>
      )}
    </div>
  );
}
