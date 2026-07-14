import { body } from "express-validator";

export const createPayrollValidator = [
  body("employee_id")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("Employee ID must be a positive integer."),

  body("employeeId")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("Employee ID must be a positive integer."),

  body("month")
    .optional({ nullable: true })
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be a number between 1 and 12."),

  body("year")
    .optional({ nullable: true })
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Year must be a valid 4-digit year."),

  body("period_id")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("Period ID must be a positive integer."),

  body("periodId")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("Period ID must be a positive integer."),

  body("bonus")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Bonus must be a non-negative number."),

  body("deduction")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Deduction must be a non-negative number."),

  body("status_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Status ID must be a positive integer."),

  body("statusId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Status ID must be a positive integer."),
];
