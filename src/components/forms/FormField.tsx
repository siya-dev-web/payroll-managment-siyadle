import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface FormFieldProps {
  label: string;
  id: string;
  icon?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  colSpan?: "full" | "half";
}

export function FormField({ label, id, icon, error, required, children, colSpan }: FormFieldProps) {
  return (
    <div className={`space-y-2 ${colSpan === "full" ? "col-span-2" : ""}`}>
      <label className="block font-label-md text-on-surface-variant" htmlFor={id}>
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      {icon ? (
        <div className="relative">
          <MaterialIcon
            icon={icon}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]"
          />
          {children}
        </div>
      ) : (
        children
      )}
      {error && <p className="text-error font-label-sm text-label-sm mt-1">{error}</p>}
    </div>
  );
}
