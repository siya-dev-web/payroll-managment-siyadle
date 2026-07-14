"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Modal } from "@/components/ui/Modal";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useEmployees } from "@/hooks/useEmployees";
import { usePayrollRuns, useRunPayroll } from "@/hooks/usePayroll";
import { formatCurrency } from "@/utils";

interface PayrollRow {
  id: string;
  name: string;
  department: string;
  position: string;
  baseSalary: number;
  bonus: number;
  deduction: number;
}

const RUN_STEPS = [
  { label: "Review Employees" },
  { label: "Adjust Payroll" },
  { label: "Generate Payroll" },
];

export default function RunPayrollPage() {
  const { data: employees = [], isLoading, isError, error } = useEmployees();
  const { refetch: refetchPayrollRuns } = usePayrollRuns();
  const runPayroll = useRunPayroll();
  const [rows, setRows] = useState<PayrollRow[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [currentStep] = useState(1);

  useEffect(() => {
    setRows(
      employees.map((employee) => ({
        id: employee.id,
        name: employee.name,
        department: employee.department,
        position: employee.role,
        baseSalary: employee.salary ?? 0,
        bonus: 0,
        deduction: 0,
      })),
    );
  }, [employees]);

  const updateRow = (id: string, field: "bonus" | "deduction", value: number) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const netPay = (row: PayrollRow) => row.baseSalary + row.bonus - row.deduction;
  const totalGrossSalary = rows.reduce((acc, row) => acc + row.baseSalary, 0);
  const totalBonus = rows.reduce((acc, row) => acc + row.bonus, 0);
  const totalDeductions = rows.reduce((acc, row) => acc + row.deduction, 0);
  const totalNetPayroll = rows.reduce((acc, row) => acc + netPay(row), 0);

  const handleCalculate = () => {
    setCalculating(true);
    setTimeout(() => {
      setCalculating(false);
      setCalculated(true);
    }, 1500);
  };

  const handleGeneratePayroll = async () => {
    if (rows.length === 0) return;

    try {
      for (const row of rows) {
        await runPayroll.mutateAsync({
          employeeId: Number(row.id),
          bonus: row.bonus,
          deduction: row.deduction,
          periodId: new Date().getMonth() + 1,
        });
      }

      await refetchPayrollRuns();
      setShowModal(true);
    } catch (err) {
      console.error("Payroll generation failed", err);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <>
      <DashboardHeader
        title="Run Payroll"
        subtitle="Payroll generation from MySQL employee data"
        showSearch
      />
      <div className="p-gutter max-w-container-max mx-auto w-full space-y-stack-lg">
        <div className="flex items-center justify-between bg-white p-stack-md rounded-xl border border-outline-variant shadow-sm">
          <div className="flex items-center gap-stack-md flex-1 px-4">
            {RUN_STEPS.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;
              return (
                <div
                  key={step.label}
                  className="flex items-center gap-stack-md flex-1 last:flex-none"
                >
                  <div
                    className={`flex items-center gap-2 ${isActive ? "text-primary font-bold" : "text-on-surface-variant"}`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        isActive
                          ? "bg-primary text-white"
                          : isCompleted
                            ? "bg-primary text-white"
                            : "bg-surface-container-high"
                      }`}
                    >
                      {stepNumber}
                    </span>
                    <span className="font-label-md">{step.label}</span>
                  </div>
                  {index < RUN_STEPS.length - 1 && (
                    <div
                      className={`h-[2px] flex-1 ${isCompleted ? "bg-primary/20" : "bg-surface-container-high"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

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

          {isLoading ? (
            <div className="px-gutter py-10 text-center text-on-surface-variant">
              Loading employees...
            </div>
          ) : isError ? (
            <div className="px-gutter py-10 text-center text-error">
              {(error as Error)?.message || "Unable to load employees."}
            </div>
          ) : rows.length === 0 ? (
            <div className="px-gutter py-10 text-center text-on-surface-variant">
              No employees found. Please add employees before running payroll.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      {[
                        "Employee Name",
                        "Department",
                        "Position",
                        "Base Salary",
                        "Bonus",
                        "Deduction",
                        "Net Salary",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-gutter py-3 font-label-sm text-outline uppercase tracking-wider text-left"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {rows.map((row) => (
                      <tr key={row.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-gutter py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                              {getInitials(row.name)}
                            </div>
                            <div>
                              <div className="font-label-md text-on-surface">{row.name}</div>
                              <div className="text-xs text-on-surface-variant">{row.position}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-gutter py-4 font-body-md">{row.department}</td>
                        <td className="px-gutter py-4 font-body-md">{row.position}</td>
                        <td className="px-gutter py-4 font-body-md">
                          {formatCurrency(row.baseSalary)}
                        </td>
                        <td className="px-gutter py-4">
                          <input
                            className="w-24 px-3 py-1.5 border border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary/20 outline-none"
                            type="number"
                            min="0"
                            value={row.bonus}
                            onChange={(event) =>
                              updateRow(row.id, "bonus", Number(event.target.value))
                            }
                          />
                        </td>
                        <td className="px-gutter py-4">
                          <input
                            className="w-24 px-3 py-1.5 border border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary/20 outline-none"
                            type="number"
                            min="0"
                            value={row.deduction}
                            onChange={(event) =>
                              updateRow(row.id, "deduction", Number(event.target.value))
                            }
                          />
                        </td>
                        <td className="px-gutter py-4 font-bold text-on-surface">
                          {formatCurrency(netPay(row))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-gutter py-stack-md bg-surface-container-low flex justify-between items-center">
                <p className="text-label-sm text-on-surface-variant">
                  Showing {rows.length} employee{rows.length === 1 ? "" : "s"}
                </p>
              </div>
            </>
          )}
        </section>

        <div className="grid grid-cols-12 gap-stack-lg">
          <div className="col-span-12 lg:col-span-8 bg-white p-stack-lg rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="font-headline-sm font-bold mb-4">Payroll Summary</h4>
              <div className="grid grid-cols-4 gap-stack-md">
                <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-lg">
                  <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                    Total Gross Salary
                  </p>
                  <p className="text-display-md font-bold text-on-surface">
                    {formatCurrency(totalGrossSalary)}
                  </p>
                </div>
                <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-lg">
                  <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                    Total Bonus
                  </p>
                  <p className="text-display-md font-bold text-on-surface">
                    {formatCurrency(totalBonus)}
                  </p>
                </div>
                <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-lg">
                  <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                    Total Deductions
                  </p>
                  <p className="text-display-md font-bold text-error">
                    -{formatCurrency(totalDeductions)}
                  </p>
                </div>
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-label-sm text-primary uppercase tracking-wider mb-1 font-bold">
                    Total Net Payroll
                  </p>
                  <p className="text-display-md font-bold text-primary">
                    {formatCurrency(totalNetPayroll)}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-4 p-4 bg-surface-container rounded-lg">
              <MaterialIcon icon="verified_user" className="text-secondary" />
              <p className="text-body-md text-on-surface-variant">
                Payroll amounts are calculated from the live employee records in the database and
                will be submitted to the backend for each selected employee.
              </p>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="bg-primary p-stack-lg rounded-xl shadow-lg text-white h-full flex flex-col">
              <h4 className="text-headline-sm font-bold mb-2">Ready to Process?</h4>
              <p className="text-body-md text-white/80 mb-stack-xl">
                Review the calculations one last time. Once approved, payroll will be generated for
                each employee.
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
                  onClick={handleGeneratePayroll}
                  disabled={runPayroll.isPending || rows.length === 0}
                >
                  {runPayroll.isPending ? (
                    <>
                      <MaterialIcon icon="progress_activity" className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <MaterialIcon icon="check_circle" filled />
                      Generate Payroll
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-stack-md">
          <MaterialIcon icon="check_circle" className="text-[40px]" filled />
        </div>
        <h3 className="font-display-md text-display-md font-bold text-on-surface mb-2">
          Payroll Submitted!
        </h3>
        <p className="text-body-md text-on-surface-variant mb-stack-xl">
          Payroll entries were created for {rows.length} employees totaling{" "}
          {formatCurrency(totalNetPayroll)}.
        </p>
        <button
          className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:shadow-lg transition-all active:scale-95"
          onClick={() => setShowModal(false)}
        >
          Close
        </button>
      </Modal>
    </>
  );
}
