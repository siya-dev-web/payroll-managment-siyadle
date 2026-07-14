"use client";

import Image from "next/image";
import { DEFAULT_USER } from "@/constants";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/store/uiStore";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

export function DashboardHeader({
  title = "Payroll Management",
  subtitle,
  showSearch = true,
  searchPlaceholder = "Search employee or record...",
}: DashboardHeaderProps) {
  const { user } = useAuth();
  const searchQuery = useUIStore((s) => s.searchQuery);
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);

  const displayUser = user ?? DEFAULT_USER;

  return (
    <header className="h-16 sticky top-0 z-40 bg-surface dark:bg-surface-dim border-b border-outline-variant flex justify-between items-center px-gutter w-full">
      <div className="flex items-center gap-4">
        <h2 className="font-headline-sm text-headline-sm font-bold text-primary">{title}</h2>
        {subtitle && (
          <>
            <div className="h-6 w-px bg-outline-variant mx-2" />
            <span className="text-on-surface-variant font-label-md">{subtitle}</span>
          </>
        )}
        {showSearch && (
          <div className="hidden md:flex items-center bg-surface-container-low rounded-lg px-3 py-1.5 border border-outline-variant">
            <MaterialIcon icon="search" className="text-outline text-[20px] mr-2" />
            <input
              className="bg-transparent border-none focus:ring-0 text-body-md placeholder:text-on-surface-variant/50 w-64 outline-none"
              placeholder={searchPlaceholder}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-surface-container-low transition-all duration-200 relative">
          <MaterialIcon icon="notifications" className="text-on-surface-variant" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface" />
        </button>
        <div className="h-8 w-px bg-outline-variant mx-1" />
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="font-label-md text-label-md text-on-surface">{displayUser.name}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant/70">
              {displayUser.role ?? "Admin User"}
            </p>
          </div>
          <Image
            className="w-10 h-10 rounded-full border border-outline-variant object-cover"
            src={displayUser.avatar ?? DEFAULT_USER.avatar}
            alt={displayUser.name}
            width={40}
            height={40}
          />
        </div>
      </div>
    </header>
  );
}
