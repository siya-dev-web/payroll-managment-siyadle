import { body } from "express-validator";

export const createPayrollValidator = [
  body("employee_id")
    .notEmpty().withMessage("Employee ID is required.")
    .isInt({ min: 1 }).withMessage("Employee ID must be a positive integer."),

  body("month")
    .notEmpty().withMessage("Month is required.")
    .isInt({ min: 1, max: 12 }).withMessage("Month must be a number between 1 and 12."),

  body("year")
    .notEmpty().withMessage("Year is required.")
    .isInt({ min: 2000, max: 2100 }).withMessage("Year must be a valid 4-digit year."),

  body("bonus")
    .optional()
    .isFloat({ min: 0 }).withMessage("Bonus must be a non-negative number."),

  body("deduction")
    .optional()
    .isFloat({ min: 0 }).withMessage("Deduction must be a non-negative number."),

  body("status_id")
    .optional()
    .isInt({ min: 1 }).withMessage("Status ID must be a positive integer."),
];
