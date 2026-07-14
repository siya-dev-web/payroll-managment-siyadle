import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="mb-stack-lg flex items-center gap-2 text-on-surface-variant/60 font-label-md text-label-md">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && <MaterialIcon icon="chevron_right" className="text-[16px]" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span className="text-on-surface font-semibold">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
