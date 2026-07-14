import pool from "../config/db.js";
import { getPaginationParams, buildPaginationMeta } from "../utils/pagination.js";

const ALLOWED_SORT_FIELDS = [
  "e.id", "e.first_name", "e.last_name", "e.email",
  "e.hire_date", "e.base_salary", "e.created_at",
];

export const employeeService = {
  /**
   * Get a paginated, searchable, filterable list of employees.
   */
  async getAll(query) {
    const { page, limit, offset, orderBy, orderDir } =
      getPaginationParams(query, ALLOWED_SORT_FIELDS);

    const search = query.search ? `%${query.search}%` : null;
    const departmentId = query.department_id ? parseInt(query.department_id, 10) : null;
    const statusId = query.status_id ? parseInt(query.status_id, 10) : null;

    const conditions = [];
    const params = [];

    if (search) {
      conditions.push(
        "(e.first_name LIKE ? OR e.last_name LIKE ? OR e.email LIKE ?)"
      );
      params.push(search, search, search);
    }
    if (departmentId) {
      conditions.push("e.department_id = ?");
      params.push(departmentId);
    }
    if (statusId) {
      conditions.push("e.status_id = ?");
      params.push(statusId);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countSql = `
      SELECT COUNT(*) AS total
      FROM employees e
      ${whereClause}
    `;
    const [countRows] = await pool.execute(countSql, params);
    const total = countRows[0].total;

    const dataSql = `
      SELECT
        e.id,
        e.first_name,
        e.last_name,
        e.email,
        e.phone,
        e.hire_date,
        e.base_salary,
        d.department_name,
        p.position_name,
        es.status_name
      FROM employees e
      INNER JOIN departments   d  ON e.department_id = d.id
      INNER JOIN positions     p  ON e.position_id   = p.id
      INNER JOIN employee_status es ON e.status_id   = es.id
      ${whereClause}
      ORDER BY ${orderBy} ${orderDir}
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.execute(dataSql, [...params, limit, offset]);

    return {
      employees: rows,
      pagination: buildPaginationMeta({ page, limit }, total),
    };
  },

  /**
   * Get a single employee by ID with joined lookup data.
   */
  async getById(id) {
    const [rows] = await pool.execute(
      `SELECT
         e.id,
         e.first_name,
         e.last_name,
         e.email,
         e.phone,
         e.hire_date,
         e.base_salary,
         e.created_at,
         e.updated_at,
         d.id            AS department_id,
         d.department_name,
         p.id            AS position_id,
         p.position_name,
         es.id           AS status_id,
         es.status_name,
         u.full_name     AS created_by_name
       FROM employees e
       INNER JOIN departments    d  ON e.department_id = d.id
       INNER JOIN positions      p  ON e.position_id   = p.id
       INNER JOIN employee_status es ON e.status_id    = es.id
       INNER JOIN users           u  ON e.created_by   = u.id
       WHERE e.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      const error = new Error("Employee not found.");
      error.statusCode = 404;
      throw error;
    }

    return rows[0];
  },

  /**
   * Create a new employee record.
   */
  async create(data, createdBy) {
    const {
      first_name, last_name, email, phone,
      department_id, position_id, status_id,
      hire_date, base_salary,
    } = data;

    const [existing] = await pool.execute(
      "SELECT id FROM employees WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      const error = new Error("An employee with this email already exists.");
      error.statusCode = 409;
      throw error;
    }

    const [result] = await pool.execute(
      `INSERT INTO employees
         (created_by, first_name, last_name, email, phone,
          department_id, position_id, status_id, hire_date, base_salary)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        createdBy, first_name, last_name, email, phone || null,
        department_id, position_id, status_id, hire_date, base_salary,
      ]
    );

    return this.getById(result.insertId);
  },

  /**
   * Update an employee. Only updates fields that are present in the payload.
   */
  async update(id, data) {
    await this.getById(id); // throws 404 if not found

    const fields = [];
    const params = [];

    const allowed = [
      "first_name", "last_name", "email", "phone",
      "department_id", "position_id", "status_id",
      "hire_date", "base_salary",
    ];

    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    }

    if (fields.length === 0) {
      const error = new Error("No valid fields provided for update.");
      error.statusCode = 400;
      throw error;
    }

    params.push(id);
    await pool.execute(
      `UPDATE employees SET ${fields.join(", ")} WHERE id = ?`,
      params
    );

    return this.getById(id);
  },

  /**
   * Delete an employee by ID.
   */
  async remove(id) {
    await this.getById(id); // throws 404 if not found

    await pool.execute("DELETE FROM employees WHERE id = ?", [id]);
  },
};
