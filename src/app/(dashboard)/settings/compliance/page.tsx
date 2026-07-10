"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const FEDERAL_TAXES = [
  { category: "FICA - Social Security", sub: "OASDI Program", employerRate: "6.20%", employeeRate: "6.20%", wageBase: "$168,600" },
  { category: "FICA - Medicare", sub: "Hospital Insurance", employerRate: "1.45%", employeeRate: "1.45%", wageBase: "No Limit" },
  { category: "FUTA", sub: "Unemployment Tax", employerRate: "0.60%", employeeRate: "0.00%", wageBase: "$7,000" },
];

const STATE_JURISDICTIONS = [
  { state: "California", id: "CA-0394-22" },
  { state: "New York", id: "NY-8821-X1" },
  { state: "Texas", id: "TX-3310-L4" },
];

const BENEFITS = [
  { icon: "savings", label: "401(k) Matching", sub: "Up to 4% Gross", enabled: true },
  { icon: "medical_services", label: "Health Premium", sub: "80% Employer Paid", enabled: true },
  { icon: "commute", label: "Commuter Benefit", sub: "Not Configured", enabled: false },
  { icon: "school", label: "Tuition Matching", sub: "$5k Annual Cap", enabled: true },
];

export default function ComplianceSettingsPage() {
  const [benefits, setBenefits] = useState(BENEFITS.map((b) => ({ ...b })));

  const toggleBenefit = (index: number) => {
    setBenefits((prev) => prev.map((b, i) => (i === index ? { ...b, enabled: !b.enabled } : b)));
  };

  return (
    <>
      <DashboardHeader title="Tax &amp; Compliance" showSearch={false} />
      <section className="p-gutter max-w-container-max w-full mx-auto space-y-stack-lg">
        {/* Page Header */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-display-md text-display-md font-bold text-on-surface">Compliance Settings</h2>
            <p className="font-body-md text-on-surface-variant mt-1">
              Manage tax jurisdictions, statutory insurance, and benefit contribution rates.
            </p>
          </div>
          <div className="flex gap-stack-sm">
            <button className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant font-label-md hover:bg-surface-container-low transition-all">
              Export Report
            </button>
            <button className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md shadow-sm hover:opacity-90 active:scale-95 transition-all">
              Save All Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-gutter">
          {/* Federal Tax Rates */}
          <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="px-gutter py-stack-md border-b border-outline-variant flex justify-between items-center bg-surface-bright">
              <div className="flex items-center gap-2">
                <MaterialIcon icon="account_balance" className="text-primary" />
                <h3 className="font-label-md font-bold text-on-surface">Federal Tax Rates (2024)</h3>
              </div>
              <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-md tracking-wider">
                Active
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low text-on-surface-variant font-label-sm uppercase">
                  <tr>
                    {["Tax Category", "Employer Rate", "Employee Rate", "Wage Base Limit", "Action"].map((h) => (
                      <th key={h} className={`px-6 py-3 font-semibold ${h === "Action" ? "text-right" : ""}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {FEDERAL_TAXES.map((tax) => (
                    <tr key={tax.category} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-label-md font-bold">{tax.category}</span>
                          <span className="text-[12px] text-on-surface-variant">{tax.sub}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-body-md">{tax.employerRate}</td>
                      <td className="px-6 py-4 font-body-md">{tax.employeeRate}</td>
                      <td className="px-6 py-4 font-body-md">{tax.wageBase}</td>
                      <td className="px-6 py-4 text-right">
                        <MaterialIcon icon="edit" className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* State Jurisdictions */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-primary text-on-primary rounded-xl p-gutter shadow-lg relative overflow-hidden h-full flex flex-col justify-between">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h3 className="font-headline-sm font-bold">State Jurisdictions</h3>
                <p className="opacity-80 font-body-md mt-2">
                  Currently filing in 14 states across the US.
                </p>
                <div className="mt-stack-xl space-y-stack-md">
                  {STATE_JURISDICTIONS.map((j) => (
                    <div key={j.state} className="flex justify-between items-center border-b border-white/20 pb-2">
                      <span className="font-label-md">{j.state}</span>
                      <span className="font-label-md font-bold">{j.id}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="relative z-10 mt-stack-xl w-full py-2 bg-white text-primary rounded-lg font-bold font-label-md hover:bg-opacity-90 transition-all">
                Add New Jurisdiction
              </button>
            </div>
          </div>

          {/* Insurance Contributions */}
          <div className="col-span-12 lg:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-xl p-gutter shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center">
                <MaterialIcon icon="shield" />
              </div>
              <div>
                <h3 className="font-label-md font-bold text-on-surface">Insurance Contributions</h3>
                <p className="font-label-sm text-on-surface-variant">SUI and Workers&apos; Comp</p>
              </div>
            </div>
            <div className="space-y-stack-md">
              {[
                { label: "State Unemployment (SUI)", rate: "3.4%", width: "34%", note: "Next rate adjustment scheduled: Jan 01, 2025" },
                { label: "Workers' Compensation", rate: "1.12%", width: "11%", note: "Provider: Liberty Mutual (Group #A-4432)" },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-lg bg-surface-container-low border border-outline-variant">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-label-md font-bold">{item.label}</span>
                    <span className="text-primary font-bold">{item.rate}</span>
                  </div>
                  <div className="w-full bg-outline-variant h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: item.width }} />
                  </div>
                  <p className="mt-2 text-[12px] text-on-surface-variant">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Employer Benefits */}
          <div className="col-span-12 lg:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-xl p-gutter shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center">
                  <MaterialIcon icon="volunteer_activism" />
                </div>
                <div>
                  <h3 className="font-label-md font-bold text-on-surface">Employer Benefits</h3>
                  <p className="font-label-sm text-on-surface-variant">Statutory matching &amp; voluntary plans</p>
                </div>
              </div>
              <button className="text-primary font-bold font-label-sm hover:underline">Manage All</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((b, i) => (
                <div key={b.label} className={`p-4 border rounded-lg hover:border-primary transition-all ${b.enabled ? "border-primary/30" : "border-outline-variant"}`}>
                  <div className="flex justify-between items-center mb-2">
                    <MaterialIcon icon={b.icon} className="text-secondary text-[20px]" />
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        className="sr-only"
                        type="checkbox"
                        checked={b.enabled}
                        onChange={() => toggleBenefit(i)}
                      />
                      <div className={`w-8 h-4 rounded-full transition-colors ${b.enabled ? "bg-primary" : "bg-outline-variant"} relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-3 after:w-3 after:transition-all ${b.enabled ? "after:translate-x-4" : ""}`} />
                    </label>
                  </div>
                  <span className="font-label-md font-bold block">{b.label}</span>
                  <span className="text-[12px] text-on-surface-variant">{b.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Alert */}
          <div className="col-span-12 bg-error-container/20 border border-error/20 rounded-xl p-gutter flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center shrink-0">
              <MaterialIcon icon="warning" />
            </div>
            <div className="flex-1">
              <h4 className="font-label-md font-bold text-on-error-container">Critical Update Required</h4>
              <p className="font-body-md text-on-surface-variant">
                The State of California (CA) has updated its SUI wage base for the upcoming Q3 filing period.
                Please review and update your local rates to avoid non-compliance penalties.
              </p>
            </div>
            <button className="px-6 py-2 bg-error text-on-error rounded-lg font-bold font-label-md hover:bg-opacity-90 active:scale-95 transition-all shrink-0">
              Update Now
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
