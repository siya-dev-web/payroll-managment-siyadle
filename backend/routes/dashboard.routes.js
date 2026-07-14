import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/dashboard  — protected
router.get("/", protect, dashboardController.getStats);

export default router;
