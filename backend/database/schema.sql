-- ============================================================
-- Payroll Management System - Database Schema
-- Normalization: Third Normal Form (3NF)
-- ============================================================



-- ============================================================
-- TABLE: users
-- Stores admin/HR accounts that manage the system
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id                 INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  full_name          VARCHAR(120)    NOT NULL,
  email              VARCHAR(191)    NOT NULL,
  password           VARCHAR(255)    NOT NULL,
  is_verified        TINYINT(1)      NOT NULL DEFAULT 0,
  verification_token VARCHAR(255)             DEFAULT NULL,
  created_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  INDEX idx_users_verification_token (verification_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: departments
-- Lookup table – no transitive dependency on other tables
-- ============================================================
CREATE TABLE IF NOT EXISTS departments (
  id              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100)  NOT NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_departments_name (department_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: positions
-- Lookup table – job titles normalised out of employees
-- ============================================================
CREATE TABLE IF NOT EXISTS positions (
  id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  position_name VARCHAR(100)  NOT NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_positions_name (position_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: employee_status
-- Lookup table – prevents status strings duplicated per row
-- ============================================================
CREATE TABLE IF NOT EXISTS employee_status (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  status_name VARCHAR(50)   NOT NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_employee_status_name (status_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: employees
-- Core entity. All FK columns reference normalised lookup tables
-- ============================================================
CREATE TABLE IF NOT EXISTS employees (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  created_by    INT UNSIGNED    NOT NULL,
  first_name    VARCHAR(80)     NOT NULL,
  last_name     VARCHAR(80)     NOT NULL,
  email         VARCHAR(191)    NOT NULL,
  phone         VARCHAR(30)              DEFAULT NULL,
  department_id INT UNSIGNED    NOT NULL,
  position_id   INT UNSIGNED    NOT NULL,
  status_id     INT UNSIGNED    NOT NULL,
  hire_date     DATE            NOT NULL,
  base_salary   DECIMAL(12, 2)  NOT NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_employees_email (email),
  INDEX idx_employees_department  (department_id),
  INDEX idx_employees_position    (position_id),
  INDEX idx_employees_status      (status_id),
  INDEX idx_employees_created_by  (created_by),
  INDEX idx_employees_hire_date   (hire_date),

  CONSTRAINT fk_employees_department
    FOREIGN KEY (department_id) REFERENCES departments (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,

  CONSTRAINT fk_employees_position
    FOREIGN KEY (position_id) REFERENCES positions (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,

  CONSTRAINT fk_employees_status
    FOREIGN KEY (status_id) REFERENCES employee_status (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,

  CONSTRAINT fk_employees_created_by
    FOREIGN KEY (created_by) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: payroll_periods
-- Separates period data so payrolls reference a single period row
-- instead of storing month/year strings repeatedly (3NF)
-- ============================================================
CREATE TABLE IF NOT EXISTS payroll_periods (
  id    INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  month TINYINT       NOT NULL COMMENT '1=January … 12=December',
  year  SMALLINT      NOT NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_payroll_periods_month_year (month, year),
  INDEX idx_payroll_periods_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: payroll_status
-- Lookup table – prevents status strings duplicated per payroll row
-- ============================================================
CREATE TABLE IF NOT EXISTS payroll_status (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  status_name VARCHAR(50)   NOT NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_payroll_status_name (status_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: payrolls
-- One record per employee per period.
-- net_salary is a derived value stored for historical accuracy
-- ============================================================
CREATE TABLE IF NOT EXISTS payrolls (
  id           INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  employee_id  INT UNSIGNED    NOT NULL,
  period_id    INT UNSIGNED    NOT NULL,
  status_id    INT UNSIGNED    NOT NULL,
  generated_by INT UNSIGNED    NOT NULL,
  base_salary  DECIMAL(12, 2)  NOT NULL,
  bonus        DECIMAL(12, 2)  NOT NULL DEFAULT 0.00,
  deduction    DECIMAL(12, 2)  NOT NULL DEFAULT 0.00,
  net_salary   DECIMAL(12, 2)  NOT NULL
                 COMMENT 'Stored as base_salary + bonus - deduction for immutable audit trail',
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_payrolls_employee_period (employee_id, period_id),
  INDEX idx_payrolls_period       (period_id),
  INDEX idx_payrolls_status       (status_id),
  INDEX idx_payrolls_generated_by (generated_by),
  INDEX idx_payrolls_created_at   (created_at),

  CONSTRAINT fk_payrolls_employee
    FOREIGN KEY (employee_id) REFERENCES employees (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,

  CONSTRAINT fk_payrolls_period
    FOREIGN KEY (period_id) REFERENCES payroll_periods (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,

  CONSTRAINT fk_payrolls_status
    FOREIGN KEY (status_id) REFERENCES payroll_status (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,

  CONSTRAINT fk_payrolls_generated_by
    FOREIGN KEY (generated_by) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: password_resets
-- Token-per-request pattern; old tokens expire automatically
-- ============================================================
CREATE TABLE IF NOT EXISTS password_resets (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED  NOT NULL,
  token      VARCHAR(255)  NOT NULL,
  expires_at DATETIME      NOT NULL,

  PRIMARY KEY (id),
  INDEX idx_password_resets_token   (token),
  INDEX idx_password_resets_user_id (user_id),

  CONSTRAINT fk_password_resets_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEED DATA – lookup tables
-- ============================================================

INSERT IGNORE INTO departments (department_name) VALUES
  ('Finance'),
  ('Information Technology'),
  ('Human Resources'),
  ('Marketing'),
  ('Operations'),
  ('Sales');

INSERT IGNORE INTO positions (position_name) VALUES
  ('Manager'),
  ('Senior Developer'),
  ('Developer'),
  ('HR Officer'),
  ('Accountant'),
  ('Marketing Specialist'),
  ('Sales Representative'),
  ('Operations Analyst');

INSERT IGNORE INTO employee_status (status_name) VALUES
  ('Active'),
  ('Inactive'),
  ('Suspended');

INSERT IGNORE INTO payroll_status (status_name) VALUES
  ('Pending'),
  ('Paid'),
  ('Cancelled');
