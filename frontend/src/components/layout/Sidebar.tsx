"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME, NAV_ITEMS } from "@/constants";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useLogout } from "@/hooks/useAuth";
import { cn } from "@/utils";

export function Sidebar() {
  const pathname = usePathname();
  const logout = useLogout();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-[260px] h-screen fixed left-0 top-0 bg-inverse-surface dark:bg-surface-container-lowest border-r border-outline-variant shadow-sm flex flex-col py-stack-lg z-50">
      <div className="px-6 mb-10">
        <h1 className="font-display-md text-display-md font-bold text-on-primary-container">
          {APP_NAME}
        </h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant/70 uppercase tracking-widest mt-1">
          Enterprise Admin
        </p>
      </div>
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-6 py-3 transition-colors cursor-pointer active:scale-95 group",
              isActive(item.href)
                ? "text-on-primary border-l-4 border-primary bg-primary/10"
                : "text-on-surface-variant/70 hover:text-on-primary hover:bg-primary/5",
            )}
          >
            <MaterialIcon
              icon={item.icon}
              className={isActive(item.href) ? "text-primary" : ""}
            />
            <span className="font-label-md text-label-md">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="px-6 pt-4 mt-auto border-t border-outline-variant/20">
        <button
          onClick={() => logout.mutate()}
          className="flex items-center gap-3 py-3 text-on-surface-variant/70 hover:text-error transition-colors cursor-pointer group w-full"
        >
          <MaterialIcon icon="logout" />
          <span className="font-label-md text-label-md">Logout</span>
        </button>
      </div>
    </aside>
  );
}
