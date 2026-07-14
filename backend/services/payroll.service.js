import pool from "../config/db.js";
import {
  getPaginationParams,
  buildPaginationMeta,
} from "../utils/pagination.js";

export const payrollService = {
  /**
   * Get paginated list of all payroll records.
   */
  async getAll(query) {
    const { page, limit, offset, orderBy, orderDir } = getPaginationParams(
      query,
      ["pr.id", "pr.net_salary", "pr.created_at"],
    );

    const [countRows] = await pool.execute(
      "SELECT COUNT(*) AS total FROM payrolls pr",
    );
    const total = countRows[0].total;

    const [rows] = await pool.execute(
      `SELECT
         pr.id,
         pr.base_salary,
         pr.bonus,
         pr.deduction,
         pr.net_salary,
         pr.created_at,
         CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
         e.id            AS employee_id,
         pp.month,
         pp.year,
         ps.status_name,
         u.full_name     AS generated_by_name
       FROM payrolls pr
       INNER JOIN employees      e   ON pr.employee_id  = e.id
       INNER JOIN payroll_periods pp  ON pr.period_id   = pp.id
       INNER JOIN payroll_status  ps  ON pr.status_id   = ps.id
       INNER JOIN users           u   ON pr.generated_by = u.id
       ORDER BY ${orderBy} ${orderDir}
       LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    return {
      payrolls: rows,
      pagination: buildPaginationMeta({ page, limit }, total),
    };
  },

  /**
   * Get a single payroll record by ID.
   */
  async getById(id) {
    const [rows] = await pool.execute(
      `SELECT
         pr.id,
         pr.base_salary,
         pr.bonus,
         pr.deduction,
         pr.net_salary,
         pr.created_at,
         e.id            AS employee_id,
         CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
         e.email         AS employee_email,
         pp.id           AS period_id,
         pp.month,
         pp.year,
         ps.id           AS status_id,
         ps.status_name,
         u.full_name     AS generated_by_name
       FROM payrolls pr
       INNER JOIN employees       e   ON pr.employee_id  = e.id
       INNER JOIN payroll_periods pp  ON pr.period_id    = pp.id
       INNER JOIN payroll_status  ps  ON pr.status_id    = ps.id
       INNER JOIN users           u   ON pr.generated_by  = u.id
       WHERE pr.id = ?`,
      [id],
    );

    if (rows.length === 0) {
      const error = new Error("Payroll record not found.");
      error.statusCode = 404;
      throw error;
    }

    return rows[0];
  },

  /**
   * Generate a new payroll record for an employee for a given month/year.
   * Net salary = base_salary + bonus - deduction.
   */
  async create(data, generatedBy) {
    const employee_id = data.employee_id ?? data.employeeId;
    const period_id = data.period_id ?? data.periodId;
    const month = data.month ?? new Date().getMonth() + 1;
    const year = data.year ?? new Date().getFullYear();
    const bonus = Number(data.bonus ?? 0);
    const deduction = Number(data.deduction ?? 0);
    const status_id = data.status_id ?? data.statusId ?? 1;

    if (!employee_id) {
      const error = new Error("Employee ID is required.");
      error.statusCode = 400;
      throw error;
    }

    const [empRows] = await pool.execute(
      "SELECT id, base_salary FROM employees WHERE id = ?",
      [employee_id],
    );
    if (empRows.length === 0) {
      const error = new Error("Employee not found.");
      error.statusCode = 404;
      throw error;
    }

    const base_salary = empRows[0].base_salary;

    let resolvedPeriodId = period_id;

    if (resolvedPeriodId) {
      const [periodRows] = await pool.execute(
        "SELECT id FROM payroll_periods WHERE id = ?",
        [resolvedPeriodId],
      );

      if (periodRows.length === 0) {
        if (
          Number.isInteger(resolvedPeriodId) &&
          resolvedPeriodId >= 1 &&
          resolvedPeriodId <= 12
        ) {
          const [periodResult] = await pool.execute(
            `INSERT INTO payroll_periods (month, year)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
            [resolvedPeriodId, year],
          );
          resolvedPeriodId = periodResult.insertId;
        } else {
          const error = new Error("Payroll period not found.");
          error.statusCode = 404;
          throw error;
        }
      }
    } else {
      const [periodResult] = await pool.execute(
        `INSERT INTO payroll_periods (month, year)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
        [month, year],
      );
      resolvedPeriodId = periodResult.insertId;
    }

    const [dup] = await pool.execute(
      "SELECT id FROM payrolls WHERE employee_id = ? AND period_id = ?",
      [employee_id, resolvedPeriodId],
    );
    if (dup.length > 0) {
      const error = new Error(
        "A payroll record for this employee already exists for the selected period.",
      );
      error.statusCode = 409;
      throw error;
    }

    const net_salary = parseFloat(base_salary) + bonus - deduction;

    const [result] = await pool.execute(
      `INSERT INTO payrolls
         (employee_id, period_id, status_id, generated_by, base_salary, bonus, deduction, net_salary)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employee_id,
        resolvedPeriodId,
        status_id,
        generatedBy,
        base_salary,
        bonus,
        deduction,
        net_salary,
      ],
    );

    return this.getById(result.insertId);
  },

  /**
   * Get full payroll history for a specific employee.
   */
  async getHistoryByEmployee(employeeId) {
    const [empCheck] = await pool.execute(
      "SELECT id FROM employees WHERE id = ?",
      [employeeId],
    );
    if (empCheck.length === 0) {
      const error = new Error("Employee not found.");
      error.statusCode = 404;
      throw error;
    }

    const [rows] = await pool.execute(
      `SELECT
         pr.id,
         pr.base_salary,
         pr.bonus,
         pr.deduction,
         pr.net_salary,
         pr.created_at,
         pp.month,
         pp.year,
         ps.status_name,
         u.full_name AS generated_by_name
       FROM payrolls pr
       INNER JOIN payroll_periods pp  ON pr.period_id   = pp.id
       INNER JOIN payroll_status  ps  ON pr.status_id   = ps.id
       INNER JOIN users           u   ON pr.generated_by = u.id
       WHERE pr.employee_id = ?
       ORDER BY pp.year DESC, pp.month DESC`,
      [employeeId],
    );

    return rows;
  },
};
