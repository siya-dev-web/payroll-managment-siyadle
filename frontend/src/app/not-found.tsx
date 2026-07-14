import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background">
      <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center">
        <MaterialIcon icon="search_off" className="text-outline text-[40px]" />
      </div>
      <h1 className="font-display-lg text-display-lg text-on-surface">404 – Page Not Found</h1>
      <p className="font-body-lg text-on-surface-variant">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-primary text-on-primary rounded-lg font-label-md hover:brightness-110 transition-all"
      >
        Go Home
      </Link>
    </div>
  );
}
