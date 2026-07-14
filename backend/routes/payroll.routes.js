import { Router } from "express";
import { payrollController } from "../controllers/payroll.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { createPayrollValidator } from "../validators/payroll.validator.js";

const router = Router();

// All payroll routes require authentication.
router.use(protect);

// GET /api/payroll
router.get("/", payrollController.getAll);

// GET /api/payroll/history/:employeeId  — must be BEFORE /:id to avoid conflict
router.get("/history/:employeeId", payrollController.getHistory);

// GET /api/payroll/:id
router.get("/:id", payrollController.getById);

// POST /api/payroll
router.post("/", createPayrollValidator, validate, payrollController.create);

export default router;
