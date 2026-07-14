import pool from "../config/db.js";

export const dashboardService = {
  /**
   * Aggregate all key metrics for the dashboard in a minimal number of queries.
   */
  async getStats() {
    // 1. Total employees
    const [[{ total_employees }]] = await pool.execute(
      "SELECT COUNT(*) AS total_employees FROM employees"
    );

    // 2. Total payroll records
    const [[{ total_payroll_records }]] = await pool.execute(
      "SELECT COUNT(*) AS total_payroll_records FROM payrolls"
    );

    // 3. Monthly payroll total (current month and year)
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const [[{ monthly_total }]] = await pool.execute(
      `SELECT COALESCE(SUM(pr.net_salary), 0) AS monthly_total
       FROM payrolls pr
       INNER JOIN payroll_periods pp ON pr.period_id = pp.id
       WHERE pp.month = ? AND pp.year = ?`,
      [currentMonth, currentYear]
    );

    // 4. Average base salary across all active employees
    const [[{ average_salary }]] = await pool.execute(
      `SELECT COALESCE(AVG(e.base_salary), 0) AS average_salary
       FROM employees e
       INNER JOIN employee_status es ON e.status_id = es.id
       WHERE es.status_name = 'Active'`
    );

    // 5. Employee count per department
    const [employees_per_department] = await pool.execute(
      `SELECT
         d.department_name,
         COUNT(e.id) AS employee_count
       FROM departments d
       LEFT JOIN employees e ON e.department_id = d.id
       GROUP BY d.id, d.department_name
       ORDER BY employee_count DESC`
    );

    // 6. 5 most recent payroll records
    const [recent_payrolls] = await pool.execute(
      `SELECT
         pr.id,
         CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
         pp.month,
         pp.year,
         pr.net_salary,
         ps.status_name
       FROM payrolls pr
       INNER JOIN employees       e  ON pr.employee_id  = e.id
       INNER JOIN payroll_periods pp ON pr.period_id    = pp.id
       INNER JOIN payroll_status  ps ON pr.status_id    = ps.id
       ORDER BY pr.created_at DESC
       LIMIT 5`
    );

    return {
      total_employees,
      total_payroll_records,
      monthly_total: parseFloat(monthly_total),
      average_salary: parseFloat(Number(average_salary).toFixed(2)),
      employees_per_department,
      recent_payrolls,
    };
  },
};
