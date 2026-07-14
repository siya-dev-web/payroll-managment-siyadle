import { payrollService } from "../services/payroll.service.js";
import { sendSuccess } from "../utils/response.js";

export const payrollController = {
  async getAll(req, res, next) {
    try {
      const result = await payrollService.getAll(req.query);
      return sendSuccess(res, 200, "Payroll records retrieved successfully.", result);
    } catch (err) {
      return next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const record = await payrollService.getById(parseInt(req.params.id, 10));
      return sendSuccess(res, 200, "Payroll record retrieved successfully.", record);
    } catch (err) {
      return next(err);
    }
  },

  async create(req, res, next) {
    try {
      const record = await payrollService.create(req.body, req.user.id);
      return sendSuccess(res, 201, "Payroll record created successfully.", record);
    } catch (err) {
      return next(err);
    }
  },

  async getHistory(req, res, next) {
    try {
      const history = await payrollService.getHistoryByEmployee(
        parseInt(req.params.employeeId, 10)
      );
      return sendSuccess(res, 200, "Payroll history retrieved successfully.", history);
    } catch (err) {
      return next(err);
    }
  },
};
