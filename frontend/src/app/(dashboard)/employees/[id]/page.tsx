"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Toast } from "@/components/ui/Toast";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useEmployee, useUpdateEmployee } from "@/hooks/useEmployees";
import { formatCurrency } from "@/utils";

const TABS = [
  { id: "overview", label: "Overview",       icon: "overview"     },
  { id: "payroll",  label: "Payroll History", icon: "history"      },
  { id: "documents",label: "Documents",       icon: "description"  },
  { id: "settings", label: "Settings",        icon: "settings"     },
];

const MOCK_DOCUMENTS = [
  { name: "W-2 Tax Form 2023",     type: "PDF",  size: "1.2 MB", date: "Feb 15"        },
  { name: "Employment Agreement",  type: "DOCX", size: "0.8 MB", date: "Jan 12, 2021"  },
];

const INPUT_CLASS =
  "w-full px-4 py-2.5 rounded-[10px] border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-md";

const SELECT_CLASS =
  "w-full px-4 py-2.5 rounded-[10px] border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white font-body-md";

// ─── Edit form shape — mirrors what the backend PUT /employees/:id accepts ───

interface EditForm {
  first_name: string;
  last_name:  string;
  email:      string;
  phone:      string;
  hire_date:  string;
  base_salary:string;
  department_id: number;
  position_id:   number;
  status_id:     number;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: employee, isLoading } = useEmployee(id);
  const updateEmployee = useUpdateEmployee();

  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing,  setIsEditing]  = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", isError: false });

  // Build edit form from current employee data when editing starts
  const [editForm, setEditForm] = useState<EditForm>({
    first_name:    "",
    last_name:     "",
    email:         "",
    phone:         "",
    hire_date:     "",
    base_salary:   "",
    department_id: 1,
    position_id:   1,
    status_id:     1,
  });

  const startEditing = () => {
    if (!employee) return;
    const [first, ...rest] = employee.name.split(" ");
    setEditForm({
      first_name:    first ?? "",
      last_name:     rest.join(" "),
      email:         employee.email,
      phone:         employee.phone ?? "",
      hire_date:     employee.joinDate ?? "",
      base_salary:   String(employee.salary ?? ""),
      department_id: 1,
      position_id:   1,
      status_id:     employee.status === "Active" ? 1 : employee.status === "Inactive" ? 2 : 3,
    });
    setIsEditing(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmployee.mutate(
      {
        id,
        updates: {
          first_name:    editForm.first_name,
          last_name:     editForm.last_name,
          email:         editForm.email,
          phone:         editForm.phone || undefined,
          hire_date:     editForm.hire_date || undefined,
          base_salary:   parseFloat(editForm.base_salary) || undefined,
          department_id: editForm.department_id,
          position_id:   editForm.position_id,
          status_id:     editForm.status_id,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setToast({ show: true, message: "Employee updated successfully.", isError: false });
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : "Failed to update employee.";
          setToast({ show: true, message, isError: true });
        },
      },
    );
  };

  const upd = (field: keyof EditForm, value: string | number) =>
    setEditForm((prev) => ({ ...prev, [field]: value }));

  // ── Loading / not found states ──────────────────────────────────────────────

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

        {/* ── Employee Header Card ─────────────────────────────────────────── */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-outline-variant/50" />
          <div className="relative flex flex-col md:flex-row md:items-end gap-6 pt-6">
            {/* Avatar */}
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

            {/* Info */}
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

            {/* Actions */}
            <div className="flex gap-2 mb-2">
              <button
                className="px-4 py-2 bg-primary text-on-primary rounded-[10px] font-label-md flex items-center gap-2 hover:opacity-90 transition-all"
                onClick={startEditing}
              >
                <MaterialIcon icon="edit" className="text-[18px]" />
                Edit Profile
              </button>
              <Link href="/employees">
                <button className="p-2 border border-outline-variant text-on-surface-variant rounded-[10px] hover:bg-surface-container-low transition-all">
                  <MaterialIcon icon="arrow_back" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Inline Edit Form (shown when isEditing) ─────────────────────── */}
        {isEditing && (
          <section className="bg-surface-container-lowest border border-primary/30 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant bg-primary/5 flex justify-between items-center">
              <div>
                <h3 className="font-headline-sm text-on-surface">Edit Employee</h3>
                <p className="text-on-surface-variant text-body-md">
                  Update the details below and click Save to apply changes.
                </p>
              </div>
              <button
                className="p-2 text-on-surface-variant hover:text-on-surface transition-colors"
                onClick={() => setIsEditing(false)}
                type="button"
              >
                <MaterialIcon icon="close" />
              </button>
            </div>
            <form className="p-6" onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-label-md text-on-surface-variant" htmlFor="ef_first">First Name</label>
                  <input className={INPUT_CLASS} id="ef_first" type="text" value={editForm.first_name}
                    onChange={(e) => upd("first_name", e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="font-label-md text-on-surface-variant" htmlFor="ef_last">Last Name</label>
                  <input className={INPUT_CLASS} id="ef_last" type="text" value={editForm.last_name}
                    onChange={(e) => upd("last_name", e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="font-label-md text-on-surface-variant" htmlFor="ef_email">Email</label>
                  <input className={INPUT_CLASS} id="ef_email" type="email" value={editForm.email}
                    onChange={(e) => upd("email", e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="font-label-md text-on-surface-variant" htmlFor="ef_phone">Phone</label>
                  <input className={INPUT_CLASS} id="ef_phone" type="tel" value={editForm.phone}
                    onChange={(e) => upd("phone", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="font-label-md text-on-surface-variant" htmlFor="ef_hire">Hire Date</label>
                  <input className={INPUT_CLASS} id="ef_hire" type="date" value={editForm.hire_date}
                    onChange={(e) => upd("hire_date", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="font-label-md text-on-surface-variant" htmlFor="ef_salary">Base Salary ($)</label>
                  <input className={INPUT_CLASS} id="ef_salary" type="number" min="0" value={editForm.base_salary}
                    onChange={(e) => upd("base_salary", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="font-label-md text-on-surface-variant" htmlFor="ef_status">Status</label>
                  <select className={SELECT_CLASS} id="ef_status"
                    value={editForm.status_id}
                    onChange={(e) => upd("status_id", Number(e.target.value))}>
                    <option value={1}>Active</option>
                    <option value={2}>Inactive</option>
                    <option value={3}>Suspended</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-label-md text-on-surface-variant" htmlFor="ef_dept">Department</label>
                  <select className={SELECT_CLASS} id="ef_dept"
                    value={editForm.department_id}
                    onChange={(e) => upd("department_id", Number(e.target.value))}>
                    <option value={1}>Finance</option>
                    <option value={2}>Information Technology</option>
                    <option value={3}>Human Resources</option>
                    <option value={4}>Marketing</option>
                    <option value={5}>Operations</option>
                    <option value={6}>Sales</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-6 py-2.5 border border-outline-variant rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors"
                  onClick={() => setIsEditing(false)}
                  disabled={updateEmployee.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-70 flex items-center gap-2"
                  disabled={updateEmployee.isPending}
                >
                  {updateEmployee.isPending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <MaterialIcon icon="save" className="text-[18px]" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ── Navigation Tabs ──────────────────────────────────────────────── */}
        <nav className="flex border-b border-outline-variant">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-label-md flex items-center gap-2 transition-all ${
                activeTab === tab.id ? "active-tab" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <MaterialIcon icon={tab.icon} filled={activeTab === tab.id} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* ── Overview Tab ─────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-12 gap-stack-lg">
            {/* Quick Stats */}
            <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-stack-md">
              {[
                { icon: "payments",              bg: "bg-primary/10",           color: "text-primary",    label: "Annual Salary",      value: employee.salary ? formatCurrency(employee.salary) : "—" },
                { icon: "account_balance_wallet", bg: "bg-secondary/10",         color: "text-secondary",  label: "Total Earnings YTD", value: employee.salary ? formatCurrency(employee.salary * 0.5) : "—" },
                { icon: "event_busy",             bg: "bg-error-container/20",   color: "text-error",      label: "Leaves Taken",       value: "8 / 25 Days" },
                { icon: "schedule",               bg: "bg-tertiary-container/10",color: "text-tertiary",   label: "Avg. Work Hours",    value: "42.5 hrs/wk" },
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
                  <button onClick={startEditing}>
                    <MaterialIcon icon="edit_square" className="text-outline cursor-pointer hover:text-primary transition-colors" />
                  </button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  {[
                    { label: "Employee ID", value: employee.employeeId },
                    { label: "Department",  value: employee.department },
                    { label: "Role",        value: employee.role       },
                    { label: "Status",      value: employee.status     },
                    { label: "Email",       value: employee.email      },
                    { label: "Phone",       value: employee.phone ?? "—" },
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
                    { label: "Join Date",         value: employee.joinDate ?? "—" },
                    { label: "Work Type",         value: "Full-Time"              },
                    { label: "Reports To",        value: "Management"             },
                    { label: "Work Anniversary",  value: employee.joinDate ?? "—" },
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

              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low">
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

        {activeTab !== "overview" && (
          <div className="py-16 text-center text-on-surface-variant font-body-md">
            {TABS.find((t) => t.id === activeTab)?.label} content coming soon.
          </div>
        )}
      </div>

      <Toast
        message={toast.message}
        show={toast.show}
        onHide={() => setToast((t) => ({ ...t, show: false }))}
      />
    </>
  );
}
