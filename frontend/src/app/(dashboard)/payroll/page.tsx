"use client";

import Link from "next/link";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { usePayrollRuns } from "@/hooks/usePayroll";
import { formatCurrency } from "@/utils";

const PAYROLL_RUNS = [
  {
    id: "PR-2024-10-A",
    description: "October Mid-Month Full-Time",
    payDate: "Oct 15, 2024",
    employees: 182,
    total: 428540,
    status: "Processing",
  },
  {
    id: "PR-2024-09-B",
    description: "September End-Month Contractor",
    payDate: "Sep 30, 2024",
    employees: 45,
    total: 89200,
    status: "Paid",
  },
  {
    id: "PR-2024-Q3-BON",
    description: "Q3 Performance Bonuses",
    payDate: "Oct 25, 2024",
    employees: 60,
    total: 150000,
    status: "Draft",
  },
];

export default function PayrollDashboardPage() {
  const { isLoading } = usePayrollRuns();

  return (
    <>
      <DashboardHeader
        title="Payroll Management"
        showSearch
        searchPlaceholder="Search employees, payroll ID..."
      />
      <div className="p-8 max-w-[1440px] mx-auto w-full space-y-stack-xl flex-1">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-display-md text-display-md text-on-surface">Payroll Overview</h2>
            <p className="font-body-lg text-on-surface-variant">
              Cycle Period: Oct 1 – Oct 15, 2024
            </p>
          </div>
          <Link
            href="/payroll/run"
            className="bg-primary text-white font-label-md px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-primary-container active:scale-95 transition-all shadow-sm w-fit"
          >
            <MaterialIcon icon="play_circle" filled />
            Run Payroll
          </Link>
        </div>

        {/* Stats Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
          {/* Status Card */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl border border-outline-variant card-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
              <MaterialIcon icon="account_balance_wallet" className="text-[120px]" />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-tertiary animate-pulse" />
              <span className="font-label-sm text-tertiary uppercase tracking-wider">
                Current Cycle Status
              </span>
            </div>
            <h3 className="font-display-lg text-display-lg text-on-surface mb-2">Processing</h3>
            <div className="flex items-center gap-4 mt-6">
              <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div className="w-[65%] h-full bg-primary transition-all duration-1000 ease-out" />
              </div>
              <span className="font-label-md text-on-surface-variant">65% Complete</span>
            </div>
            <p className="mt-4 font-body-md text-on-surface-variant">
              Approving 124 of 182 employee disbursements.
            </p>
          </div>

          {/* Total Gross Pay */}
          <div className="bg-white p-6 rounded-xl border border-outline-variant card-shadow card-hover transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label-sm text-on-surface-variant">Total Gross Pay</span>
              <span className="material-symbols-outlined text-primary bg-primary/5 p-2 rounded-lg">
                payments
              </span>
            </div>
            <p className="font-display-md text-display-md text-on-surface">
              {formatCurrency(428540)}
            </p>
            <div className="mt-2 flex items-center gap-1 text-on-primary-fixed-variant">
              <MaterialIcon icon="trending_up" className="text-[16px]" />
              <span className="font-label-sm">3.2% vs last month</span>
            </div>
          </div>

          {/* Total Net Pay */}
          <div className="bg-white p-6 rounded-xl border border-outline-variant card-shadow card-hover transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label-sm text-on-surface-variant">Total Net Pay</span>
              <span className="material-symbols-outlined text-secondary bg-secondary/5 p-2 rounded-lg">
                account_balance
              </span>
            </div>
            <p className="font-display-md text-display-md text-on-surface">
              {formatCurrency(312240.5)}
            </p>
            <div className="mt-2">
              <span className="font-label-sm text-outline">Standard disbursement range</span>
            </div>
          </div>
        </div>

        {/* Secondary Stats + Active Runs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Tax & Deductions */}
          <div className="bg-white rounded-xl border border-outline-variant card-shadow">
            <div className="p-6 border-b border-outline-variant">
              <h4 className="font-headline-sm text-on-surface">Tax &amp; Deductions</h4>
            </div>
            <div className="p-6 space-y-6">
              {[
                {
                  icon: "account_balance",
                  label: "Federal Tax",
                  sub: "Social Security, Medicare",
                  amount: 82410,
                },
                {
                  icon: "map",
                  label: "State/Local Tax",
                  sub: "NY, CA, TX Jurisdictions",
                  amount: 24180.2,
                },
                {
                  icon: "health_and_safety",
                  label: "Benefits & 401k",
                  sub: "Employer matching included",
                  amount: 9709.3,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
                      <MaterialIcon icon={item.icon} className="text-outline" />
                    </div>
                    <div>
                      <p className="font-label-md text-on-surface">{item.label}</p>
                      <p className="font-label-sm text-on-surface-variant">{item.sub}</p>
                    </div>
                  </div>
                  <p className="font-label-md text-on-surface">{formatCurrency(item.amount)}</p>
                </div>
              ))}
            </div>
            <div className="p-6 bg-surface-container-lowest border-t border-outline-variant flex justify-between items-center rounded-b-xl">
              <span className="font-label-md text-on-surface-variant">Total Withheld</span>
              <span className="font-headline-sm text-primary">{formatCurrency(116299.5)}</span>
            </div>
          </div>

          {/* Active Runs Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-outline-variant card-shadow overflow-hidden">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <h4 className="font-headline-sm text-on-surface">Active Payroll Runs</h4>
              <button className="text-primary font-label-md hover:underline">
                View All History
              </button>
            </div>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low text-on-surface-variant uppercase text-label-sm font-label-sm">
                    <tr>
                      {[
                        "ID / Description",
                        "Pay Date",
                        "Employees",
                        "Total Value",
                        "Status",
                        "",
                      ].map((h) => (
                        <th key={h} className="px-6 py-4">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {PAYROLL_RUNS.map((run) => (
                      <tr
                        key={run.id}
                        className="hover:bg-surface-container-low transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <p className="font-label-md text-on-surface">{run.id}</p>
                          <p className="font-label-sm text-on-surface-variant">{run.description}</p>
                        </td>
                        <td className="px-6 py-4 font-body-md text-on-surface">{run.payDate}</td>
                        <td className="px-6 py-4 font-body-md text-on-surface">{run.employees}</td>
                        <td className="px-6 py-4 font-label-md text-on-surface">
                          {formatCurrency(run.total)}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={run.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <MaterialIcon
                            icon="chevron_right"
                            className="text-outline group-hover:text-primary transition-colors"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-10 right-10 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <MaterialIcon icon="add" className="text-[32px]" filled />
      </button>
    </>
  );
}
