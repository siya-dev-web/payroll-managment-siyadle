import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardFooter } from "@/components/layout/DashboardFooter";

export const metadata: Metadata = {
  title: {
    template: "%s | PayRoll Pro",
    default: "Dashboard | PayRoll Pro",
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-on-background antialiased overflow-x-hidden min-h-screen">
      <Sidebar />
      <div className="ml-[260px] min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col">{children}</main>
        <DashboardFooter />
      </div>
    </div>
  );
}
