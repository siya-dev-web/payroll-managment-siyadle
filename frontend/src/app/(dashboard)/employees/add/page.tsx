"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Stepper } from "@/components/forms/Stepper";
import { FormField } from "@/components/forms/FormField";
import { Toast } from "@/components/ui/Toast";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useCreateEmployee } from "@/hooks/useEmployees";

const STEPS = [
  { label: "Personal" },
  { label: "Employment" },
  { label: "Payroll" },
];

interface EmployeeForm {
  // Step 1: Personal
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  // Step 2: Employment
  department: string;
  jobTitle: string;
  employmentType: string;
  joinDate: string;
  // Step 3: Payroll
  annualSalary: string;
  taxId: string;
  bankName: string;
  accountNumber: string;
}

const INITIAL_FORM: EmployeeForm = {
  fullName: "", email: "", phone: "", dateOfBirth: "",
  department: "Engineering", jobTitle: "", employmentType: "Full-time", joinDate: "",
  annualSalary: "", taxId: "", bankName: "", accountNumber: "",
};

const INPUT_CLASS =
  "w-full px-4 py-3 rounded-[10px] border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";

const SELECT_CLASS =
  "w-full px-4 py-3 rounded-[10px] border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white";

export default function AddEmployeePage() {
  const router = useRouter();
  const createEmployee = useCreateEmployee();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<EmployeeForm>(INITIAL_FORM);
  const [showToast, setShowToast] = useState(false);

  const update = (field: keyof EmployeeForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEmployee.mutate(
      {
        name: form.fullName,
        email: form.email,
        employeeId: `#EMP-${Date.now()}`,
        department: form.department,
        role: form.jobTitle,
        status: "Active",
        phone: form.phone,
        joinDate: form.joinDate,
        salary: parseFloat(form.annualSalary) || 0,
      },
      {
        onSuccess: () => {
          setShowToast(true);
          setTimeout(() => router.push("/employees"), 3000);
        },
      },
    );
  };

  return (
    <>
      <DashboardHeader title="Payroll Management" subtitle="Add New Employee" showSearch={false} />
      <main className="ml-0 min-h-[calc(100vh-64px)] p-gutter max-w-4xl mx-auto">
        <Stepper steps={STEPS} currentStep={step} />

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <form className="p-8" onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <section className="space-y-6">
                <div className="border-b border-outline-variant pb-4 mb-6">
                  <h3 className="font-display-md text-display-md text-on-surface">Personal Information</h3>
                  <p className="text-on-surface-variant font-body-md">
                    Provide the basic contact and identity details for the new staff member.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Full Name" id="fullName">
                    <input
                      className={INPUT_CLASS}
                      id="fullName"
                      placeholder="e.g. Jonathan Doe"
                      type="text"
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                      required
                    />
                  </FormField>
                  <FormField label="Email Address" id="email">
                    <input
                      className={INPUT_CLASS}
                      id="email"
                      placeholder="j.doe@company.com"
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      required
                    />
                  </FormField>
                  <FormField label="Phone Number" id="phone">
                    <input
                      className={INPUT_CLASS}
                      id="phone"
                      placeholder="+1 (555) 000-0000"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                  </FormField>
                  <FormField label="Date of Birth" id="dateOfBirth">
                    <input
                      className={INPUT_CLASS}
                      id="dateOfBirth"
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(e) => update("dateOfBirth", e.target.value)}
                    />
                  </FormField>
                </div>
              </section>
            )}

            {/* Step 2: Employment Details */}
            {step === 2 && (
              <section className="space-y-6">
                <div className="border-b border-outline-variant pb-4 mb-6">
                  <h3 className="font-display-md text-display-md text-on-surface">Employment Details</h3>
                  <p className="text-on-surface-variant font-body-md">
                    Specify the role, department, and contractual status within the organization.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Department" id="department">
                    <select
                      className={SELECT_CLASS}
                      id="department"
                      value={form.department}
                      onChange={(e) => update("department", e.target.value)}
                    >
                      {["Engineering", "Finance", "Human Resources", "Marketing", "Operations"].map(
                        (d) => <option key={d}>{d}</option>,
                      )}
                    </select>
                  </FormField>
                  <FormField label="Job Title" id="jobTitle">
                    <input
                      className={INPUT_CLASS}
                      id="jobTitle"
                      placeholder="e.g. Senior Accountant"
                      type="text"
                      value={form.jobTitle}
                      onChange={(e) => update("jobTitle", e.target.value)}
                      required
                    />
                  </FormField>
                  <FormField label="Employment Type" id="employmentType">
                    <select
                      className={SELECT_CLASS}
                      id="employmentType"
                      value={form.employmentType}
                      onChange={(e) => update("employmentType", e.target.value)}
                    >
                      {["Full-time", "Part-time", "Contractor", "Intern"].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Join Date" id="joinDate">
                    <input
                      className={INPUT_CLASS}
                      id="joinDate"
                      type="date"
                      value={form.joinDate}
                      onChange={(e) => update("joinDate", e.target.value)}
                    />
                  </FormField>
                </div>
              </section>
            )}

            {/* Step 3: Payroll Information */}
            {step === 3 && (
              <section className="space-y-6">
                <div className="border-b border-outline-variant pb-4 mb-6">
                  <h3 className="font-display-md text-display-md text-on-surface">Payroll Information</h3>
                  <p className="text-on-surface-variant font-body-md">
                    Configure financial parameters and disbursement details.
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Annual Gross Salary" id="annualSalary">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                        <input
                          className="w-full pl-8 pr-4 py-3 rounded-[10px] border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          id="annualSalary"
                          placeholder="0.00"
                          type="number"
                          value={form.annualSalary}
                          onChange={(e) => update("annualSalary", e.target.value)}
                        />
                      </div>
                    </FormField>
                    <FormField label="Tax ID / SSN" id="taxId">
                      <input
                        className={INPUT_CLASS}
                        id="taxId"
                        placeholder="XXX-XX-XXXX"
                        type="password"
                        value={form.taxId}
                        onChange={(e) => update("taxId", e.target.value)}
                      />
                    </FormField>
                  </div>
                  <div className="p-4 bg-surface-container-low border border-outline-variant rounded-lg">
                    <h4 className="font-label-md text-primary mb-4 flex items-center gap-2">
                      <MaterialIcon icon="account_balance" className="text-sm" />
                      Disbursement Account
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block font-label-sm text-on-surface-variant" htmlFor="bankName">
                          Bank Name
                        </label>
                        <input
                          className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20"
                          id="bankName"
                          placeholder="e.g. Chase Bank"
                          type="text"
                          value={form.bankName}
                          onChange={(e) => update("bankName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block font-label-sm text-on-surface-variant" htmlFor="accountNumber">
                          Account Number
                        </label>
                        <input
                          className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20"
                          id="accountNumber"
                          placeholder="0000 0000 0000"
                          type="text"
                          value={form.accountNumber}
                          onChange={(e) => update("accountNumber", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Form Controls */}
            <div className="mt-10 pt-6 border-t border-outline-variant flex justify-between items-center">
              <div className="flex gap-2">
                {step > 1 && (
                  <button
                    className="px-6 py-2.5 rounded-[10px] text-on-surface-variant font-label-md hover:bg-surface-variant transition-colors flex items-center gap-2"
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                  >
                    <MaterialIcon icon="arrow_back" className="text-sm" />
                    Back
                  </button>
                )}
                {step === 1 && (
                  <button
                    className="px-6 py-2.5 rounded-[10px] text-on-surface-variant font-label-md hover:text-error transition-colors"
                    type="button"
                    onClick={() => router.push("/employees")}
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="flex gap-4">
                {step < 3 && (
                  <button
                    className="px-8 py-2.5 rounded-[10px] bg-primary text-on-primary font-label-md hover:brightness-110 shadow-sm active:scale-95 transition-all flex items-center gap-2"
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                  >
                    Next Step
                    <MaterialIcon icon="arrow_forward" className="text-sm" />
                  </button>
                )}
                {step === 3 && (
                  <button
                    className="px-8 py-2.5 rounded-[10px] bg-primary text-on-primary font-label-md hover:brightness-110 shadow-sm active:scale-95 transition-all disabled:opacity-70"
                    type="submit"
                    disabled={createEmployee.isPending}
                  >
                    {createEmployee.isPending ? "Saving..." : "Save Employee"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>

      <Toast
        message="Employee successfully added to payroll database."
        show={showToast}
        onHide={() => setShowToast(false)}
      />
    </>
  );
}
