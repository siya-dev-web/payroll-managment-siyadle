import { employeeService } from "../services/employee.service.js";
import { sendSuccess } from "../utils/response.js";

export const employeeController = {
  async getAll(req, res, next) {
    try {
      const result = await employeeService.getAll(req.query);
      return sendSuccess(res, 200, "Employees retrieved successfully.", result);
    } catch (err) {
      return next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const employee = await employeeService.getById(parseInt(req.params.id, 10));
      return sendSuccess(res, 200, "Employee retrieved successfully.", employee);
    } catch (err) {
      return next(err);
    }
  },

  async create(req, res, next) {
    try {
      const employee = await employeeService.create(req.body, req.user.id);
      return sendSuccess(res, 201, "Employee created successfully.", employee);
    } catch (err) {
      return next(err);
    }
  },

  async update(req, res, next) {
    try {
      const employee = await employeeService.update(parseInt(req.params.id, 10), req.body);
      return sendSuccess(res, 200, "Employee updated successfully.", employee);
    } catch (err) {
      return next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await employeeService.remove(parseInt(req.params.id, 10));
      return sendSuccess(res, 200, "Employee deleted successfully.");
    } catch (err) {
      return next(err);
    }
  },
};
