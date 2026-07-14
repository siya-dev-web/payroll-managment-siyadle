import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyEmailValidator,
} from "../validators/auth.validator.js";

const router = Router();

// POST /api/auth/register
router.post("/register", registerValidator, validate, authController.register);

// POST /api/auth/login
router.post("/login", loginValidator, validate, authController.login);

// GET /api/auth/me  — protected
router.get("/me", protect, authController.getMe);

// POST /api/auth/forgot-password
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validate,
  authController.forgotPassword,
);

// POST /api/auth/reset-password
router.post(
  "/reset-password",
  resetPasswordValidator,
  validate,
  authController.resetPassword,
);

// GET /api/auth/verify-email?token=...
router.get(
  "/verify-email",
  verifyEmailValidator,
  validate,
  authController.verifyEmail,
);

export default router;
