import { Router } from "express";
import { employeeController } from "../controllers/employee.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  createEmployeeValidator,
  updateEmployeeValidator,
} from "../validators/employee.validator.js";

const router = Router();

// All employee routes require authentication.
router.use(protect);

// GET /api/employees?page=1&limit=10&search=&department_id=&status_id=&sort=&order=
router.get("/", employeeController.getAll);

// GET /api/employees/:id
router.get("/:id", employeeController.getById);

// POST /api/employees
router.post("/", createEmployeeValidator, validate, employeeController.create);

// PUT /api/employees/:id
router.put("/:id", updateEmployeeValidator, validate, employeeController.update);

// DELETE /api/employees/:id
router.delete("/:id", employeeController.remove);

export default router;
