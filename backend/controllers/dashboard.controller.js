import { dashboardService } from "../services/dashboard.service.js";
import { sendSuccess } from "../utils/response.js";

export const dashboardController = {
  async getStats(req, res, next) {
    try {
      const stats = await dashboardService.getStats();
      return sendSuccess(res, 200, "Dashboard statistics retrieved successfully.", stats);
    } catch (err) {
      return next(err);
    }
  },
};
