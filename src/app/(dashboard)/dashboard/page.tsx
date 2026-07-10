"use client";

import Link from "next/link";
import Image from "next/image";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { StatCard } from "@/components/dashboard/StatCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useDashboardStats, useRecentPayroll } from "@/hooks/useDashboard";
import { formatCurrency } from "@/utils";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentPayroll, isLoading: payrollLoading } = useRecentPayroll();

  return (
    <>
      <DashboardHeader title="Payroll Management" showSearch />
      <div className="p-gutter flex-1 max-w-[1440px]">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Dashboard" }]} />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-stack-lg mb-stack-xl">
          {statsLoading ? (
            <div className="col-span-4"><LoadingSpinner /></div>
          ) : (
            <>
              <StatCard
                icon="group"
                iconBg="bg-primary/10"
                iconColor="text-primary"
                badge="+12%"
                label="Total Employees"
                value={stats?.totalEmployees.toLocaleString() ?? "—"}
                filled
              />
              <StatCard
                icon="description"
                iconBg="bg-secondary/10"
                iconColor="text-secondary"
                label="Payroll Records"
                value={stats?.payrollRecords.toLocaleString() ?? "—"}
                filled
              />
              <StatCard
                icon="payments"
                iconBg="bg-tertiary-container/10"
                iconColor="text-tertiary-container"
                label="Monthly Payroll"
                value={stats ? formatCurrency(stats.monthlyPayroll) : "—"}
                filled
              />
              <StatCard
                icon="trending_up"
                iconBg="bg-surface-variant"
                iconColor="text-on-surface-variant"
                label="Average Salary"
                value={stats ? formatCurrency(stats.averageSalary) : "—"}
                filled
              />
            </>
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg mb-stack-xl">
          {/* Payroll Trends */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl custom-shadow overflow-hidden">
            <div className="px-gutter py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/30">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Monthly Payroll Trends</h3>
              <button className="text-primary font-label-md hover:underline">Download CSV</button>
            </div>
            <div className="p-gutter min-h-[300px] flex items-center justify-center">
              <svg className="w-full h-full text-primary" viewBox="0 0 400 150">
                <defs>
                  <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "currentColor", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "currentColor", stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
                <path
                  d="M0 120 Q 50 100, 100 110 T 200 60 T 300 80 T 400 40"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
                <path
                  d="M0 120 Q 50 100, 100 110 T 200 60 T 300 80 T 400 40 V 150 H 0 Z"
                  fill="url(#grad1)"
                  opacity="0.1"
                />
                <circle cx="200" cy="60" fill="white" r="4" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Employee Growth */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl custom-shadow overflow-hidden">
            <div className="px-gutter py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/30">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Employee Growth</h3>
              <div className="flex gap-2 items-center">
                <span className="w-3 h-3 bg-primary rounded-full inline-block" />
                <span className="font-label-sm text-label-sm text-on-surface-variant">Active</span>
              </div>
            </div>
            <div className="p-gutter min-h-[300px] flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 400 150">
                {[
                  { x: 20, h: 70, fill: "#cbd5e1" },
                  { x: 70, h: 90, fill: "#cbd5e1" },
                  { x: 120, h: 110, fill: "#cbd5e1" },
                  { x: 170, h: 80, fill: "#cbd5e1" },
                  { x: 220, h: 120, fill: "#004ac6" },
                  { x: 270, h: 100, fill: "#004ac6" },
                  { x: 320, h: 130, fill: "#004ac6" },
                  { x: 370, h: 140, fill: "#004ac6" },
                ].map((bar) => (
                  <rect
                    key={bar.x}
                    fill={bar.fill}
                    height={bar.h}
                    rx="4"
                    width="30"
                    x={bar.x}
                    y={150 - bar.h}
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* History & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
          {/* Recent History Table */}
          <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl custom-shadow overflow-hidden">
            <div className="px-gutter py-4 border-b border-outline-variant bg-surface-container-low/30">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Payroll History</h3>
            </div>
            <div className="overflow-x-auto">
              {payrollLoading ? (
                <LoadingSpinner />
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                    <tr>
                      {["Employee Name", "Period", "Amount", "Status", "Action"].map((h) => (
                        <th key={h} className="px-gutter py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant font-body-md text-body-md">
                    {recentPayroll?.map((record) => (
                      <tr key={record.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-gutter py-4 font-medium text-on-surface">{record.employeeName}</td>
                        <td className="px-gutter py-4 text-on-surface-variant">{record.period}</td>
                        <td className="px-gutter py-4 text-on-surface">{formatCurrency(record.amount)}</td>
                        <td className="px-gutter py-4">
                          <StatusBadge status={record.status} />
                        </td>
                        <td className="px-gutter py-4">
                          <button className="text-on-surface-variant/50 hover:text-primary transition-colors">
                            <MaterialIcon icon="more_vert" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="px-gutter py-3 border-t border-outline-variant text-center">
              <Link href="/payroll" className="text-primary font-label-md hover:underline">
                View All Records
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl custom-shadow overflow-hidden h-fit">
            <div className="px-gutter py-4 border-b border-outline-variant bg-surface-container-low/30">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Quick Actions</h3>
            </div>
            <div className="p-gutter space-y-3">
              <Link
                href="/employees/add"
                className="w-full flex items-center justify-between p-4 bg-primary text-on-primary rounded-lg shadow-sm hover:brightness-110 active:scale-[0.98] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <MaterialIcon icon="person_add" />
                  <span className="font-label-md">Add Employee</span>
                </div>
                <MaterialIcon icon="arrow_forward" className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/payroll/run"
                className="w-full flex items-center justify-between p-4 border border-outline-variant text-on-surface bg-surface-container-lowest rounded-lg hover:bg-surface-container-low active:scale-[0.98] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <MaterialIcon icon="account_balance_wallet" className="text-primary" />
                  <span className="font-label-md">Generate Payroll</span>
                </div>
                <MaterialIcon icon="arrow_forward" className="text-on-surface-variant/50" />
              </Link>

              <button className="w-full flex items-center justify-between p-4 border border-outline-variant text-on-surface bg-surface-container-lowest rounded-lg hover:bg-surface-container-low active:scale-[0.98] transition-all group">
                <div className="flex items-center gap-3">
                  <MaterialIcon icon="file_download" className="text-primary" />
                  <span className="font-label-md">Export Reports</span>
                </div>
                <MaterialIcon icon="arrow_forward" className="text-on-surface-variant/50" />
              </button>

              <div className="pt-4 mt-4 border-t border-outline-variant">
                <p className="font-label-sm text-on-surface-variant mb-4 px-1">Upcoming Deadlines</p>
                <div className="bg-error-container/20 p-3 rounded-lg border border-error/10">
                  <div className="flex gap-3">
                    <MaterialIcon icon="warning" className="text-error text-[20px]" />
                    <div>
                      <p className="font-label-md font-semibold text-on-error-container">Tax Compliance Due</p>
                      <p className="font-body-md text-on-surface-variant/80">Submit by Oct 31st</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <Link
        href="/employees/add"
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"
      >
        <MaterialIcon icon="add" className="text-[28px] group-hover:rotate-90 transition-transform duration-300" />
      </Link>
    </>
  );
}
