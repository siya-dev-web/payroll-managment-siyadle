"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Modal } from "@/components/ui/Modal";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useRunPayroll } from "@/hooks/usePayroll";
import { formatCurrency } from "@/utils";

interface PayrollRow {
  id: string;
  initials: string;
  bgColor: string;
  textColor: string;
  name: string;
  role: string;
  baseSalary: number;
  hoursWorked: number;
  bonus: number;
  deductions: number;
}

const INITIAL_ROWS: PayrollRow[] = [
  { id: "1", initials: "JD", bgColor: "bg-secondary-fixed", textColor: "text-on-secondary-fixed", name: "Jane Doe", role: "Software Engineer", baseSalary: 5400, hoursWorked: 80, bonus: 250, deductions: 120 },
  { id: "2", initials: "MS", bgColor: "bg-tertiary-fixed", textColor: "text-on-tertiary-fixed", name: "Marcus Smith", role: "Product Designer", baseSalary: 4800, hoursWorked: 78, bonus: 0, deductions: 85 },
  { id: "3", initials: "AK", bgColor: "bg-primary-fixed", textColor: "text-on-primary-fixed", name: "Alina Khan", role: "HR Manager", baseSalary: 6200, hoursWorked: 80, bonus: 500, deductions: 210 },
];

const RUN_STEPS = [
  { label: "Confirm Hours" },
  { label: "Review Bonuses" },
  { label: "Final Approval" },
];

export default function RunPayrollPage() {
  const runPayroll = useRunPayroll();
  const [rows, setRows] = useState<PayrollRow[]>(INITIAL_ROWS);
  const [showModal, setShowModal] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [currentStep] = useState(1);

  const updateRow = (id: string, field: "hoursWorked" | "bonus", value: number) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const netPay = (row: PayrollRow) => row.baseSalary + row.bonus - row.deductions;
  const totalGross = rows.reduce((acc, r) => acc + r.baseSalary + r.bonus, 0);
  const totalDeductions = rows.reduce((acc, r) => acc + r.deductions, 0);
  const totalNet = rows.reduce((acc, r) => acc + netPay(r), 0);

  const handleCalculate = () => {
    setCalculating(true);
    setTimeout(() => {
      setCalculating(false);
      setCalculated(true);
    }, 1500);
  };

  const handleApprove = () => {
    runPayroll.mutate(undefined, { onSuccess: () => setShowModal(true) });
  };

  return (
    <>
      <DashboardHeader title="Run Payroll" subtitle="Pay Period: Oct 01 – Oct 15, 2024" showSearch />
      <div className="p-gutter max-w-container-max mx-auto w-full space-y-stack-lg">
        {/* Stepper */}
        <div className="flex items-center justify-between bg-white p-stack-md rounded-xl border border-outline-variant shadow-sm">
          <div className="flex items-center gap-stack-md flex-1 px-4">
            {RUN_STEPS.map((s, i) => {
              const num = i + 1;
              const isActive = num === currentStep;
              const isCompleted = num < currentStep;
              return (
                <div key={s.label} className="flex items-center gap-stack-md flex-1 last:flex-none">
                  <div className={`flex items-center gap-2 ${isActive ? "text-primary font-bold" : "text-on-surface-variant"}`}>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        isActive ? "bg-primary text-white" : isCompleted ? "bg-primary text-white" : "bg-surface-container-high"
                      }`}
                    >
                      {num}
                    </span>
                    <span className="font-label-md">{s.label}</span>
                  </div>
                  {i < RUN_STEPS.length - 1 && (
                    <div className={`h-[2px] flex-1 ${isCompleted ? "bg-primary/20" : "bg-surface-container-high"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Employee Review Table */}
        <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="px-gutter py-stack-md border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
            <h3 className="font-headline-sm font-bold text-on-surface">Employee Review Table</h3>
            <div className="flex gap-stack-sm">
              <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-low transition-all">
                <MaterialIcon icon="filter_list" className="text-[18px]" />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-low transition-all">
                <MaterialIcon icon="download" className="text-[18px]" />
                Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  {["Employee", "Base Salary", "Hours Worked", "Bonus ($)", "Deductions", "Net Pay", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className={`px-gutter py-3 font-label-sm text-outline uppercase tracking-wider ${h === "Net Pay" ? "text-right" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-gutter py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${row.bgColor} flex items-center justify-center ${row.textColor} font-bold`}>
                          {row.initials}
                        </div>
                        <div>
                          <div className="font-label-md text-on-surface">{row.name}</div>
                          <div className="text-xs text-on-surface-variant">{row.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-gutter py-4 font-body-md">{formatCurrency(row.baseSalary)}</td>
                    <td className="px-gutter py-4">
                      <input
                        className="w-20 px-3 py-1.5 border border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary/20 outline-none"
                        type="number"
                        value={row.hoursWorked}
                        onChange={(e) => updateRow(row.id, "hoursWorked", Number(e.target.value))}
                      />
                    </td>
                    <td className="px-gutter py-4">
                      <input
                        className="w-24 px-3 py-1.5 border border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary/20 outline-none"
                        type="number"
                        value={row.bonus}
                        onChange={(e) => updateRow(row.id, "bonus", Number(e.target.value))}
                      />
                    </td>
                    <td className="px-gutter py-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-error-container text-on-error-container text-[10px] font-bold rounded-md">
                          -{formatCurrency(row.deductions)}
                        </span>
                        <MaterialIcon icon="info" className="text-[16px] text-outline hover:text-primary cursor-pointer" />
                      </div>
                    </td>
                    <td className="px-gutter py-4 text-right font-bold text-on-surface">
                      {formatCurrency(netPay(row))}
                    </td>
                    <td className="px-gutter py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-primary hover:underline font-label-sm">Edit Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-gutter py-stack-md bg-surface-container-low flex justify-between items-center">
            <div className="flex items-center gap-stack-md">
              <p className="text-label-sm text-on-surface-variant">Showing {rows.length} of 12 employees</p>
              <div className="flex gap-1">
                {[1, 2].map((p) => (
                  <button
                    key={p}
                    className={`w-8 h-8 flex items-center justify-center border border-outline-variant rounded ${p === 1 ? "bg-primary text-white font-bold" : "bg-white hover:bg-surface-container transition-colors"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <button className="px-4 py-2 text-primary border border-primary rounded-lg font-bold hover:bg-primary/5 active:scale-95 transition-all">
              Add Adjustment
            </button>
          </div>
        </section>

        {/* Summary + Actions */}
        <div className="grid grid-cols-12 gap-stack-lg">
          <div className="col-span-12 lg:col-span-8 bg-white p-stack-lg rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="font-headline-sm font-bold mb-4">Payroll Summary</h4>
              <div className="grid grid-cols-3 gap-stack-md">
                <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-lg">
                  <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Total Gross</p>
                  <p className="text-display-md font-bold text-on-surface">{formatCurrency(totalGross)}</p>
                </div>
                <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-lg">
                  <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Total Deductions</p>
                  <p className="text-display-md font-bold text-error">-{formatCurrency(totalDeductions)}</p>
                </div>
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-label-sm text-primary uppercase tracking-wider mb-1 font-bold">Net Disbursements</p>
                  <p className="text-display-md font-bold text-primary">{formatCurrency(totalNet)}</p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-4 p-4 bg-surface-container rounded-lg">
              <MaterialIcon icon="verified_user" className="text-secondary" />
              <p className="text-body-md text-on-surface-variant">
                All statutory tax calculations have been automatically applied based on state and federal regulations
                for the current period.
              </p>
            </div>
          </div>

          {/* Action Panel */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-primary p-stack-lg rounded-xl shadow-lg text-white h-full flex flex-col">
              <h4 className="text-headline-sm font-bold mb-2">Ready to Process?</h4>
              <p className="text-body-md text-white/80 mb-stack-xl">
                Review the calculations one last time. Once approved, payments will be scheduled for the next
                business day.
              </p>
              <div className="space-y-3 mt-auto">
                <button
                  className={`w-full py-4 border border-white/30 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${calculated ? "bg-tertiary-container text-white" : "bg-white/10 hover:bg-white/20"}`}
                  onClick={handleCalculate}
                  disabled={calculating}
                >
                  {calculating ? (
                    <>
                      <MaterialIcon icon="refresh" className="animate-spin" />
                      Calculating...
                    </>
                  ) : calculated ? (
                    <>
                      <MaterialIcon icon="check" />
                      Recalculated
                    </>
                  ) : (
                    <>
                      <MaterialIcon icon="calculate" />
                      Calculate Totals
                    </>
                  )}
                </button>
                <button
                  className="w-full py-4 bg-white text-primary hover:bg-secondary-fixed rounded-lg font-bold flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 disabled:opacity-70"
                  onClick={handleApprove}
                  disabled={runPayroll.isPending}
                >
                  {runPayroll.isPending ? (
                    <>
                      <MaterialIcon icon="progress_activity" className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <MaterialIcon icon="check_circle" filled />
                      Approve &amp; Pay
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-stack-md">
          <MaterialIcon icon="check_circle" className="text-[40px]" filled />
        </div>
        <h3 className="font-display-md text-display-md font-bold text-on-surface mb-2">
          Payroll Submitted!
        </h3>
        <p className="text-body-md text-on-surface-variant mb-stack-xl">
          Payments for {rows.length} employees totaling {formatCurrency(totalNet)} have been successfully
          scheduled for Oct 16th, 2024.
        </p>
        <button
          className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:shadow-lg transition-all active:scale-95"
          onClick={() => setShowModal(false)}
        >
          Back to Dashboard
        </button>
      </Modal>
    </>
  );
}
