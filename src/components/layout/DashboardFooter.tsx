import Link from "next/link";
import { APP_NAME } from "@/constants";

export function DashboardFooter() {
  return (
    <footer className="mt-auto h-16 w-full py-stack-md bg-surface-container-lowest dark:bg-surface-container-lowest border-t border-outline-variant flex justify-between items-center px-gutter">
      <div className="flex items-center gap-4">
        <span className="font-label-md text-label-md font-bold text-secondary">{APP_NAME}</span>
        <span className="text-on-surface-variant/30">|</span>
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          © 2024 {APP_NAME}. All rights reserved.
        </p>
      </div>
      <div className="flex gap-6">
        <Link
          href="#"
          className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-opacity"
        >
          Privacy Policy
        </Link>
        <Link
          href="#"
          className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-opacity"
        >
          Terms of Service
        </Link>
        <Link
          href="#"
          className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-opacity"
        >
          Help Center
        </Link>
      </div>
    </footer>
  );
}
