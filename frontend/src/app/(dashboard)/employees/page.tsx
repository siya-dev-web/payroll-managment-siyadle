"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Toast } from "@/components/ui/Toast";
import { useEmployees, useDeleteEmployee } from "@/hooks/useEmployees";
import { DEPARTMENTS, EMPLOYEE_STATUSES } from "@/constants";
import type { Employee, EmployeeStatus } from "@/types";

const PAGE_SIZE = 10;

// ─── Delete Confirmation Dialog ───────────────────────────────────────────────

function DeleteDialog({
  employee,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  employee: Employee;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4">
        <div className="w-12 h-12 bg-error-container rounded-full flex items-center justify-center mx-auto mb-4">
          <MaterialIcon icon="delete_forever" className="text-error text-[24px]" />
        </div>
        <h3 className="font-headline-sm text-on-surface text-center mb-2">Delete Employee</h3>
        <p className="font-body-md text-on-surface-variant text-center mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-on-surface">{employee.name}</span>? This action
          cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            className="flex-1 py-2.5 border border-outline-variant rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2.5 bg-error text-on-error rounded-lg font-label-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <MaterialIcon icon="delete" className="text-[18px]" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployeesPage() {
  const { data: employees, isLoading } = useEmployees();
  const deleteEmployee = useDeleteEmployee();

  const [department, setDepartment] = useState("All Departments");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);

  // Delete dialog state
  const [pendingDelete, setPendingDelete] = useState<Employee | null>(null);

  // Toast state
  const [toast, setToast] = useState({ show: false, message: "", isError: false });

  const showToast = (message: string, isError = false) => {
    setToast({ show: true, message, isError });
  };

  const filtered = (employees ?? []).filter((e) => {
    const deptMatch = department === "All Departments" || e.department === department;
    const statusMatch = status === "All Status" || e.status === status;
    return deptMatch && statusMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDeleteConfirm = () => {
    if (!pendingDelete) return;
    deleteEmployee.mutate(pendingDelete.id, {
      onSuccess: () => {
        setPendingDelete(null);
        showToast(`${pendingDelete.name} has been deleted successfully.`);
      },
      onError: (err: unknown) => {
        setPendingDelete(null);
        const message = err instanceof Error ? err.message : "Failed to delete employee.";
        showToast(message, true);
      },
    });
  };

  return (
    <>
      <DashboardHeader
        title="Payroll Management"
        showSearch
        searchPlaceholder="Search employees, ID, or department..."
      />

      {/* Delete confirmation dialog */}
      {pendingDelete && (
        <DeleteDialog
          employee={pendingDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPendingDelete(null)}
          isDeleting={deleteEmployee.isPending}
        />
      )}

      <div className="p-stack-lg min-h-[calc(100vh-128px)]">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-stack-lg gap-4">
          <div>
            <h2 className="font-display-md text-display-md text-on-surface">Employee Directory</h2>
            <p className="text-on-surface-variant font-body-md">
              Manage your global workforce and payroll assignments.
            </p>
          </div>
          <Link
            href="/employees/add"
            className="bg-primary text-on-primary px-6 py-2.5 rounded-lg flex items-center gap-2 font-label-md shadow-sm hover:brightness-110 active:scale-95 transition-all w-fit"
          >
            <MaterialIcon icon="add" />
            Add Employee
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-stack-lg flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant">
            <span className="text-label-sm text-on-surface-variant uppercase">Department:</span>
            <select
              className="bg-transparent border-none focus:ring-0 font-label-md py-0 pr-8 outline-none"
              value={department}
              onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
            >
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant">
            <span className="text-label-sm text-on-surface-variant uppercase">Status:</span>
            <select
              className="bg-transparent border-none focus:ring-0 font-label-md py-0 pr-8 outline-none"
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            >
              {EMPLOYEE_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <button className="ml-auto text-primary font-label-md flex items-center gap-1 hover:underline">
            <MaterialIcon icon="filter_list" className="text-[20px]" />
            Advanced Filters
          </button>
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <LoadingSpinner />
          ) : paginated.length === 0 ? (
            <EmptyState
              icon="group_off"
              title="No employees found"
              description="Try adjusting your filters or add a new employee."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low">
                  <tr>
                    {["Employee Name", "Employee ID", "Department", "Role", "Status", "Actions"].map(
                      (h, i) => (
                        <th
                          key={h}
                          className={`px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider border-b border-outline-variant ${i === 5 ? "text-right" : ""}`}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {paginated.map((employee) => (
                    <tr
                      key={employee.id}
                      className="employee-table-row transition-colors h-[56px] hover:-translate-y-px hover:shadow"
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          {employee.avatar ? (
                            <Image
                              className="w-10 h-10 rounded-full object-cover border border-outline-variant"
                              src={employee.avatar}
                              alt={employee.name}
                              width={40}
                              height={40}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                              {employee.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-label-md text-on-surface">{employee.name}</p>
                            <p className="text-label-sm text-on-surface-variant">{employee.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 font-body-md text-on-surface-variant">
                        {employee.employeeId}
                      </td>
                      <td className="px-6 py-3 font-body-md text-on-surface-variant">
                        {employee.department}
                      </td>
                      <td className="px-6 py-3 font-body-md text-on-surface-variant">
                        {employee.role}
                      </td>
                      <td className="px-6 py-3">
                        <StatusBadge status={employee.status as EmployeeStatus} />
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {/* View / Edit */}
                          <Link href={`/employees/${employee.id}`}>
                            <button
                              className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant hover:text-primary"
                              title="View & Edit"
                            >
                              <MaterialIcon icon="edit" className="text-[18px]" />
                            </button>
                          </Link>
                          {/* Delete */}
                          <button
                            className="p-2 hover:bg-error-container/30 rounded-full transition-colors text-on-surface-variant hover:text-error"
                            title="Delete employee"
                            onClick={() => setPendingDelete(employee)}
                          >
                            <MaterialIcon icon="delete" className="text-[18px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!isLoading && filtered.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalResults={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      {/* Toast */}
      <Toast
        message={toast.message}
        show={toast.show}
        onHide={() => setToast((t) => ({ ...t, show: false }))}
      />
    </>
  );
}
