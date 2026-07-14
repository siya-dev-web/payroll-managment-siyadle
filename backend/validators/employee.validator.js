import { body } from "express-validator";

export const createEmployeeValidator = [
  body("first_name")
    .trim()
    .notEmpty().withMessage("First name is required.")
    .isLength({ min: 2, max: 80 }).withMessage("First name must be between 2 and 80 characters."),

  body("last_name")
    .trim()
    .notEmpty().withMessage("Last name is required.")
    .isLength({ min: 2, max: 80 }).withMessage("Last name must be between 2 and 80 characters."),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body("phone")
    .optional({ nullable: true })
    .trim()
    .matches(/^[+\d\s\-().]{7,30}$/).withMessage("Please provide a valid phone number."),

  body("department_id")
    .notEmpty().withMessage("Department is required.")
    .isInt({ min: 1 }).withMessage("Department ID must be a positive integer."),

  body("position_id")
    .notEmpty().withMessage("Position is required.")
    .isInt({ min: 1 }).withMessage("Position ID must be a positive integer."),

  body("status_id")
    .notEmpty().withMessage("Status is required.")
    .isInt({ min: 1 }).withMessage("Status ID must be a positive integer."),

  body("hire_date")
    .notEmpty().withMessage("Hire date is required.")
    .isDate({ format: "YYYY-MM-DD" }).withMessage("Hire date must be a valid date in YYYY-MM-DD format."),

  body("base_salary")
    .notEmpty().withMessage("Base salary is required.")
    .isFloat({ min: 0 }).withMessage("Base salary must be a positive number."),
];

export const updateEmployeeValidator = [
  body("first_name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 }).withMessage("First name must be between 2 and 80 characters."),

  body("last_name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 }).withMessage("Last name must be between 2 and 80 characters."),

  body("email")
    .optional()
    .trim()
    .isEmail().withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body("phone")
    .optional({ nullable: true })
    .trim()
    .matches(/^[+\d\s\-().]{7,30}$/).withMessage("Please provide a valid phone number."),

  body("department_id")
    .optional()
    .isInt({ min: 1 }).withMessage("Department ID must be a positive integer."),

  body("position_id")
    .optional()
    .isInt({ min: 1 }).withMessage("Position ID must be a positive integer."),

  body("status_id")
    .optional()
    .isInt({ min: 1 }).withMessage("Status ID must be a positive integer."),

  body("hire_date")
    .optional()
    .isDate({ format: "YYYY-MM-DD" }).withMessage("Hire date must be a valid date in YYYY-MM-DD format."),

  body("base_salary")
    .optional()
    .isFloat({ min: 0 }).withMessage("Base salary must be a positive number."),
];
