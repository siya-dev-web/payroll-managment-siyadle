"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useEmployee } from "@/hooks/useEmployees";
import { formatCurrency } from "@/utils";

const TABS = [
  { id: "overview", label: "Overview", icon: "overview" },
  { id: "payroll", label: "Payroll History", icon: "history" },
  { id: "documents", label: "Documents", icon: "description" },
  { id: "settings", label: "Settings", icon: "settings" },
];

const MOCK_DOCUMENTS = [
  { name: "W-2 Tax Form 2023", type: "PDF", size: "1.2 MB", date: "Feb 15" },
  { name: "Employment Agreement", type: "DOCX", size: "0.8 MB", date: "Jan 12, 2021" },
];

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: employee, isLoading } = useEmployee(id);
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) return <LoadingSpinner text="Loading employee profile..." className="mt-20" />;
  if (!employee)
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <MaterialIcon icon="person_off" className="text-[48px] text-outline mb-4" />
        <p className="font-headline-sm text-on-surface-variant">Employee not found</p>
        <Link href="/employees" className="mt-4 text-primary hover:underline font-label-md">
          ← Back to Employees
        </Link>
      </div>
    );

  return (
    <>
      <DashboardHeader title="Payroll Management" showSearch searchPlaceholder="Search employees..." />
      <div className="p-gutter max-w-container-max mx-auto w-full flex-1 space-y-stack-lg">
        {/* Employee Header Card */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-outline-variant/50" />
          <div className="relative flex flex-col md:flex-row md:items-end gap-6 pt-6">
            <div className="relative">
              {employee.avatar ? (
                <Image
                  className="w-32 h-32 rounded-xl border-4 border-surface-container-lowest shadow-md object-cover"
                  src={employee.avatar}
                  alt={employee.name}
                  width={128}
                  height={128}
                />
              ) : (
                <div className="w-32 h-32 rounded-xl border-4 border-surface-container-lowest bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary">
                  {employee.name.charAt(0)}
                </div>
              )}
              <span className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-surface-container-lowest w-8 h-8 rounded-full" />
            </div>
            <div className="flex-1 mb-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display-md text-display-md text-on-surface">{employee.name}</h2>
                <StatusBadge status={employee.status} />
              </div>
              <p className="font-body-lg text-on-surface-variant mt-1">
                {employee.role} • {employee.department} Department
              </p>
              <div className="flex flex-wrap gap-4 mt-4 text-on-surface-variant">
                <div className="flex items-center gap-1.5">
                  <MaterialIcon icon="mail" className="text-outline" />
                  <span className="text-label-md">{employee.email}</span>
                </div>
                {employee.phone && (
                  <div className="flex items-center gap-1.5">
                    <MaterialIcon icon="phone" className="text-outline" />
                    <span className="text-label-md">{employee.phone}</span>
                  </div>
                )}
                {employee.joinDate && (
                  <div className="flex items-center gap-1.5">
                    <MaterialIcon icon="calendar_today" className="text-outline" />
                    <span className="text-label-md">Joined {employee.joinDate}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <button className="px-4 py-2 bg-primary text-on-primary rounded-[10px] font-label-md flex items-center gap-2 hover:opacity-90 transition-all">
                <MaterialIcon icon="edit" className="text-[18px]" />
                Edit Profile
              </button>
              <button className="p-2 border border-outline-variant text-on-surface-variant rounded-[10px] hover:bg-surface-container-low transition-all">
                <MaterialIcon icon="more_horiz" />
              </button>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <nav className="flex border-b border-outline-variant">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-label-md flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? "active-tab"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <MaterialIcon icon={tab.icon} filled={activeTab === tab.id} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-12 gap-stack-lg">
            {/* Quick Stats */}
            <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-stack-md">
              {[
                { icon: "payments", bg: "bg-primary/10", color: "text-primary", label: "Annual Salary", value: employee.salary ? formatCurrency(employee.salary) : "—" },
                { icon: "account_balance_wallet", bg: "bg-secondary/10", color: "text-secondary", label: "Total Earnings YTD", value: employee.salary ? formatCurrency(employee.salary * 0.5) : "—" },
                { icon: "event_busy", bg: "bg-error-container/20", color: "text-error", label: "Leaves Taken", value: "8 / 25 Days" },
                { icon: "schedule", bg: "bg-tertiary-container/10", color: "text-tertiary", label: "Avg. Work Hours", value: "42.5 hrs/wk" },
              ].map((stat) => (
                <div key={stat.label} className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                    <MaterialIcon icon={stat.icon} />
                  </div>
                  <div>
                    <p className="text-label-sm text-on-surface-variant">{stat.label}</p>
                    <p className="font-display-md text-display-md">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Personal Information */}
            <div className="col-span-12 lg:col-span-7 space-y-stack-lg">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                  <h3 className="font-headline-sm text-on-surface">Personal Information</h3>
                  <MaterialIcon icon="edit_square" className="text-outline cursor-pointer hover:text-primary transition-colors" />
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  {[
                    { label: "Employee ID", value: employee.employeeId },
                    { label: "Department", value: employee.department },
                    { label: "Role", value: employee.role },
                    { label: "Status", value: employee.status },
                    { label: "Email", value: employee.email },
                    { label: "Phone", value: employee.phone ?? "—" },
                  ].map((field) => (
                    <div key={field.label}>
                      <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">{field.label}</p>
                      <p className="text-body-lg font-medium text-on-surface">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low">
                  <h3 className="font-headline-sm text-on-surface">Employment Details</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  {[
                    { label: "Join Date", value: employee.joinDate ?? "—" },
                    { label: "Work Type", value: "Full-Time" },
                    { label: "Reports To", value: "Management" },
                    { label: "Work Anniversary", value: employee.joinDate ?? "—" },
                  ].map((field) => (
                    <div key={field.label}>
                      <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">{field.label}</p>
                      <p className="text-body-lg font-medium text-on-surface">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-5 space-y-stack-lg">
              {/* Payment Method */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline-sm text-on-surface">Payment Method</h3>
                  <MaterialIcon icon="verified" className="text-primary" filled />
                </div>
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded flex items-center justify-center border border-outline-variant shadow-sm">
                      <MaterialIcon icon="account_balance" className="text-on-primary-fixed-variant" />
                    </div>
                    <div>
                      <p className="font-label-md text-on-surface">Chase Manhattan Bank</p>
                      <p className="text-label-sm text-on-surface-variant">Direct Deposit • **** 4291</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 border border-outline-variant rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-low transition-all">
                  Update Payment Details
                </button>
              </div>

              {/* Documents */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                  <h3 className="font-headline-sm text-on-surface">Recent Documents</h3>
                </div>
                <div className="divide-y divide-outline-variant/30">
                  {MOCK_DOCUMENTS.map((doc) => (
                    <div key={doc.name} className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <MaterialIcon
                          icon={doc.type === "PDF" ? "picture_as_pdf" : "description"}
                          className={doc.type === "PDF" ? "text-error" : "text-primary"}
                        />
                        <div>
                          <p className="text-label-md font-medium text-on-surface group-hover:text-primary transition-colors">{doc.name}</p>
                          <p className="text-label-sm text-on-surface-variant">{doc.type} • {doc.size} • {doc.date}</p>
                        </div>
                      </div>
                      <MaterialIcon icon="download" className="text-outline-variant" />
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 text-primary font-label-md hover:bg-primary/5 transition-all">
                  View All Documents
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs: placeholder */}
        {activeTab !== "overview" && (
          <div className="py-16 text-center text-on-surface-variant font-body-md">
            {TABS.find((t) => t.id === activeTab)?.label} content coming soon.
          </div>
        )}
      </div>
    </>
  );
}
